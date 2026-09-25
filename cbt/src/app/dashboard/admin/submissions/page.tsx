"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getCbtSubmissions,
  getCbtQuestions,
  updateCbtSubmissionGrading,
  CbtSubmission,
  CbtQuestion,
  ExamineeAnswer,
} from '@/lib/cbtStore';

export default function AdminSubmissionsGradingPage() {
  const [submissions, setSubmissions] = useState<CbtSubmission[]>([]);
  const [selectedSub, setSelectedSub] = useState<CbtSubmission | null>(null);
  const [examQuestions, setExamQuestions] = useState<CbtQuestion[]>([]);

  // Editing marks & notes
  const [editingAnswers, setEditingAnswers] = useState<Record<string, ExamineeAnswer>>({});

  useEffect(() => {
    const list = getCbtSubmissions();
    setSubmissions(list);
    if (list.length > 0) {
      handleSelectSubmission(list[0]);
    }
  }, []);

  const handleSelectSubmission = (sub: CbtSubmission) => {
    setSelectedSub(sub);
    const qList = getCbtQuestions(sub.examId);
    setExamQuestions(qList);
    setEditingAnswers({ ...sub.answers });
  };

  const handleScoreChange = (qId: string, score: number) => {
    setEditingAnswers((prev) => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        scoreAwarded: score,
      },
    }));
  };

  const handleNotesChange = (qId: string, notes: string) => {
    setEditingAnswers((prev) => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        adminGradingNotes: notes,
      },
    }));
  };

  const handleSaveGrading = () => {
    if (!selectedSub) return;
    let newScore = 0;

    examQuestions.forEach((q) => {
      const ans = editingAnswers[q.id];
      if (q.type === 'MCQ') {
        if (ans && ans.selectedOptionKey === q.correctOptionKey) {
          newScore += q.marks;
        }
      } else if (q.type === 'TRUE_FALSE') {
        if (ans && ans.selectedTrueFalse === q.correctTrueFalse) {
          newScore += q.marks;
        }
      } else if (q.type === 'THEORY') {
        newScore += Number(ans?.scoreAwarded || 0);
      }
    });

    const isPassed = Math.round((newScore / (selectedSub.totalMarks || 100)) * 100) >= 50;
    const updated = updateCbtSubmissionGrading(selectedSub.id, editingAnswers, newScore, isPassed);
    if (updated) {
      setSelectedSub(updated);
      setSubmissions(getCbtSubmissions());
      alert('Theory grades & feedback saved successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-amber-900 text-white py-4 px-6 sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/admin" className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold text-xs">
              ⬅️ Admin Panel
            </Link>
            <h1 className="font-bold text-base">CBT Submissions & Theory Evaluation</h1>
          </div>
          <span className="text-xs font-bold text-amber-200">Examiner Review</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-10 space-y-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Examinee Attempts & Theory Grading</h2>
          <p className="text-slate-500 text-sm mt-1">
            Review examinee answers, inspect uploaded theory handwritten sheets, and assign scores.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Submissions List Sidebar */}
          <div className="bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest mb-4">Completed Attempts ({submissions.length})</h3>
              
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {submissions.map((sub) => {
                  const isSelected = selectedSub?.id === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => handleSelectSubmission(sub)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all ${
                        isSelected
                          ? 'bg-amber-900 text-white border-amber-900 shadow-md'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-sm truncate">{sub.userName}</p>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                          sub.isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {sub.percentage}% ({sub.isPassed ? 'PASS' : 'FAIL'})
                        </span>
                      </div>
                      <p className={`text-xs mt-1 truncate ${isSelected ? 'text-amber-200' : 'text-slate-500'}`}>
                        {sub.examTitle}
                      </p>
                      <div className="flex items-center justify-between mt-2 text-[10px] opacity-70">
                        <span>Candidate: {sub.candidateId}</span>
                        <span>{new Date(sub.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </button>
                  );
                })}

                {submissions.length === 0 && (
                  <p className="text-xs text-slate-400 italic p-4 text-center">No completed CBT submissions yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Submission Review & Theory Evaluation Area */}
          <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-6">
            {selectedSub ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="px-3 py-1 bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-widest rounded-full">
                      EXAMINEE EVALUATION
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedSub.userName} ({selectedSub.candidateId})</h3>
                    <p className="text-xs text-slate-500">{selectedSub.examTitle}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-black text-slate-900">{selectedSub.score} / {selectedSub.totalMarks} Marks</p>
                    <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                      selectedSub.isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      Score: {selectedSub.percentage}% ({selectedSub.isPassed ? 'PASSED' : 'FAILED'})
                    </span>
                  </div>
                </div>

                <div className="space-y-6 divide-y divide-slate-100">
                  {examQuestions.map((q, idx) => {
                    const ans = editingAnswers[q.id] || {};
                    let isMcqCorrect = false;

                    if (q.type === 'MCQ') {
                      isMcqCorrect = ans.selectedOptionKey === q.correctOptionKey;
                    } else if (q.type === 'TRUE_FALSE') {
                      isMcqCorrect = ans.selectedTrueFalse === q.correctTrueFalse;
                    }

                    return (
                      <div key={q.id} className="pt-6 first:pt-0 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-primary">Question {idx + 1} ({q.type} - Max {q.marks} Marks)</span>
                          {q.type !== 'THEORY' ? (
                            <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              isMcqCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {isMcqCorrect ? `Auto-Graded (${q.marks}/${q.marks})` : 'Auto-Graded (0 Marks)'}
                            </span>
                          ) : (
                            <span className="px-3 py-0.5 bg-amber-100 text-amber-900 rounded-full text-[10px] font-black uppercase">
                              ✍️ Theory Question - Manual Grading
                            </span>
                          )}
                        </div>

                        <p className="font-bold text-slate-800 text-sm">{q.questionText}</p>

                        {q.type === 'MCQ' && (
                          <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border">
                            Examinee Choice: <strong>{ans.selectedOptionKey || 'None'}</strong> | Correct Key: <strong className="text-emerald-700">{q.correctOptionKey}</strong>
                          </p>
                        )}

                        {q.type === 'TRUE_FALSE' && (
                          <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border">
                            Examinee Choice: <strong>{ans.selectedTrueFalse !== undefined ? (ans.selectedTrueFalse ? 'TRUE' : 'FALSE') : 'None'}</strong> | Correct Key: <strong className="text-emerald-700">{q.correctTrueFalse ? 'TRUE' : 'FALSE'}</strong>
                          </p>
                        )}

                        {q.type === 'THEORY' && (
                          <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/60 space-y-3">
                            <div>
                              <p className="text-xs font-bold text-amber-900 mb-1">Written Theory Answer Submitted:</p>
                              <p className="text-xs text-slate-800 bg-white p-3 rounded-xl border border-slate-200 italic">
                                {ans.theoryAnswerText || 'No written text provided.'}
                              </p>
                            </div>

                            {ans.theoryAttachmentUrl && (
                              <div>
                                <p className="text-xs font-bold text-amber-900 mb-1">📷 Attached Student Answer Sheet / Image Diagram:</p>
                                <img src={ans.theoryAttachmentUrl} alt="Submitted Theory Sheet" className="max-h-48 rounded-xl border border-slate-300" />
                              </div>
                            )}

                            {/* Examiner Mark Assignment */}
                            <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-amber-200">
                              <div>
                                <label className="block text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-1">
                                  Award Score (Max {q.marks} Marks)
                                </label>
                                <input
                                  type="number"
                                  max={q.marks}
                                  min={0}
                                  value={ans.scoreAwarded || 0}
                                  onChange={(e) => handleScoreChange(q.id, Number(e.target.value))}
                                  className="w-full px-4 py-2 bg-white border border-amber-300 rounded-xl font-bold text-sm text-slate-900"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-1">
                                  Examiner Feedback / Notes
                                </label>
                                <input
                                  type="text"
                                  value={ans.adminGradingNotes || ''}
                                  onChange={(e) => handleNotesChange(q.id, e.target.value)}
                                  placeholder="e.g. Good translation, minor grammar flaw"
                                  className="w-full px-4 py-2 bg-white border border-amber-300 rounded-xl text-xs font-medium text-slate-900"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={handleSaveGrading}
                    className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-xl shadow-emerald-600/20 uppercase tracking-wider"
                  >
                    💾 Save Theory Grades & Update Score
                  </button>
                </div>
              </>
            ) : (
              <div className="p-10 text-center text-slate-400 italic">Select a completed submission from the left list to review.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
