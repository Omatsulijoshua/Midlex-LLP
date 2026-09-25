"use client";
import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { getCbtSubmissions, getCbtQuestions, getCbtExams, CbtSubmission, CbtQuestion, CbtExam, CbtUser } from '@/lib/cbtStore';

export default function CbtResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: submissionId } = use(params);
  const [submission, setSubmission] = useState<CbtSubmission | null>(null);
  const [questions, setQuestions] = useState<CbtQuestion[]>([]);
  const [exam, setExam] = useState<CbtExam | null>(null);
  const [currentUser, setCurrentUser] = useState<CbtUser | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('midlex_cbt_session');
      if (session) {
        try { setCurrentUser(JSON.parse(session)); } catch (e) {}
      }
    }
    const subs = getCbtSubmissions();
    const found = subs.find((s) => s.id === submissionId);
    if (found) {
      setSubmission(found);
      const qList = getCbtQuestions(found.examId);
      setQuestions(qList);

      const allExams = getCbtExams();
      const targetExam = allExams.find((e) => e.id === found.examId);
      if (targetExam) setExam(targetExam);
    }
  }, [submissionId]);

  if (!submission) return <div className="p-10 text-center animate-pulse">Loading Midlex CBT examination results...</div>;

  // If Examinee and Exam is set to hide results immediately:
  if (currentUser?.role !== 'ADMIN' && (exam?.showResultsImmediately === false || exam?.showResultsImmediately === undefined)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white rounded-[40px] border border-slate-200 p-10 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center text-4xl mx-auto font-black shadow-inner">
            🤝
          </div>
          <div className="space-y-3">
            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-black uppercase tracking-widest rounded-full border border-emerald-200">
              Midlex CBT Examination Submitted
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-2">
              Thank you! We will get back to you with your results.
            </h1>
            <p className="text-slate-500 text-xs leading-relaxed">
              Your responses for <strong>{submission.examTitle}</strong> have been securely recorded and submitted to the Midlex Examination Board.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-left space-y-2 text-xs">
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500 font-medium">Candidate Name:</span>
              <strong className="text-slate-900">{submission.userName}</strong>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500 font-medium">Candidate ID:</span>
              <strong className="text-slate-900">{submission.candidateId}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Submission Timestamp:</span>
              <strong className="text-slate-900">{new Date(submission.submittedAt).toLocaleString()}</strong>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all text-sm block shadow-xl shadow-primary/20"
          >
            Return to Examinee Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Score Header Card */}
        <div className={`p-10 rounded-[40px] text-white shadow-xl ${
          submission.isPassed ? 'bg-gradient-to-r from-emerald-800 to-emerald-600' : 'bg-gradient-to-r from-red-900 to-red-700'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/20 pb-6 mb-6">
            <div>
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest">
                OFFICIAL RESULT REPORT
              </span>
              <h1 className="text-3xl font-black mt-2">{submission.examTitle}</h1>
              <p className="text-xs text-white/80 mt-1">Examinee: {submission.userName} ({submission.candidateId})</p>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-5xl font-black">{submission.percentage}%</div>
              <span className="inline-block mt-2 px-4 py-1.5 bg-white text-slate-900 font-black text-xs uppercase tracking-widest rounded-full shadow-md">
                {submission.isPassed ? '🎉 PASSED' : '❌ FAILED'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
              <p className="text-[10px] uppercase font-bold text-white/60">Marks Obtained</p>
              <p className="text-xl font-bold mt-1">{submission.score} / {submission.totalMarks}</p>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
              <p className="text-[10px] uppercase font-bold text-white/60">Submission Date</p>
              <p className="text-xs font-bold mt-1">{new Date(submission.submittedAt).toLocaleDateString()}</p>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
              <p className="text-[10px] uppercase font-bold text-white/60">Theory Status</p>
              <p className="text-xs font-bold mt-1">{submission.isGraded ? '✅ Graded' : '⏳ Pending Examiner Review'}</p>
            </div>
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Detailed Question Review & Explanations</h2>

          <div className="space-y-6 divide-y divide-slate-100">
            {questions.map((q, idx) => {
              const ans = submission.answers[q.id] || {};
              let isCorrect = false;

              if (q.type === 'MCQ') {
                isCorrect = ans.selectedOptionKey === q.correctOptionKey;
              } else if (q.type === 'TRUE_FALSE') {
                isCorrect = ans.selectedTrueFalse === q.correctTrueFalse;
              }

              return (
                <div key={q.id} className="pt-6 first:pt-0 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-primary">Question {idx + 1} ({q.type})</span>
                    {q.type !== 'THEORY' ? (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isCorrect ? `Correct (+${q.marks} Marks)` : 'Incorrect (0 Marks)'}
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-[10px] font-black uppercase">
                        Theory Response Submitted
                      </span>
                    )}
                  </div>

                  <p className="font-bold text-slate-800 text-base leading-relaxed">{q.questionText}</p>

                  {q.type === 'MCQ' && (
                    <div className="bg-slate-50 p-4 rounded-2xl text-xs space-y-1 border border-slate-100">
                      <p>Your Selected Option: <strong className="text-slate-900">{ans.selectedOptionKey || 'None'}</strong></p>
                      <p>Correct Option: <strong className="text-emerald-700">{q.correctOptionKey}</strong></p>
                    </div>
                  )}

                  {q.type === 'TRUE_FALSE' && (
                    <div className="bg-slate-50 p-4 rounded-2xl text-xs space-y-1 border border-slate-100">
                      <p>Your Selected Choice: <strong className="text-slate-900">{ans.selectedTrueFalse !== undefined ? (ans.selectedTrueFalse ? 'TRUE' : 'FALSE') : 'None'}</strong></p>
                      <p>Correct Statement: <strong className="text-emerald-700">{q.correctTrueFalse ? 'TRUE' : 'FALSE'}</strong></p>
                    </div>
                  )}

                  {q.type === 'THEORY' && (
                    <div className="bg-slate-50 p-4 rounded-2xl text-xs space-y-2 border border-slate-100">
                      <p className="font-bold text-slate-700">Your Submitted Written Response:</p>
                      <p className="text-slate-800 italic bg-white p-3 rounded-xl border border-slate-200">{ans.theoryAnswerText || 'No text submitted.'}</p>
                      {ans.theoryAttachmentUrl && (
                        <div className="mt-2">
                          <p className="font-bold text-slate-700 mb-1">Attached Document Sheet:</p>
                          <img src={ans.theoryAttachmentUrl} alt="Submitted attachment" className="h-20 w-20 object-cover rounded-xl border" />
                        </div>
                      )}
                    </div>
                  )}

                  {q.explanation && (
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs text-emerald-900">
                      <strong className="block mb-1">💡 Examiner Explanation:</strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all text-sm inline-block shadow-xl shadow-primary/20"
          >
            Return to Examinee Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
