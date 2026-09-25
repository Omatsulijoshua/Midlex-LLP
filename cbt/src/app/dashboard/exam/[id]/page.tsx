"use client";
import React, { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getCbtExams,
  getCbtQuestions,
  saveCbtSubmission,
  CbtExam,
  CbtQuestion,
  CbtUser,
  ExamineeAnswer,
} from '@/lib/cbtStore';

export default function InteractiveCbtExamEngine({ params }: { params: Promise<{ id: string }> }) {
  const { id: examId } = use(params);
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<CbtUser | null>(null);
  const [exam, setExam] = useState<CbtExam | null>(null);
  const [questions, setQuestions] = useState<CbtQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Examinee Answers State: questionId -> ExamineeAnswer
  const [answers, setAnswers] = useState<Record<string, ExamineeAnswer>>({});
  
  // Timer State (seconds)
  const [timeLeft, setTimeLeft] = useState<number>(1800); // 30 mins default
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Zoom Image Modal State
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('midlex_cbt_session');
      if (!session) {
        router.push('/');
        return;
      }
      try {
        const u = JSON.parse(session);
        setCurrentUser(u);
      } catch (e) {
        router.push('/');
        return;
      }
    }

    const allExams = getCbtExams();
    const foundExam = allExams.find((e) => e.id === examId);
    if (!foundExam) {
      alert('CBT Exam not found.');
      router.push('/dashboard');
      return;
    }
    setExam(foundExam);
    setTimeLeft((foundExam.durationMinutes || 30) * 60);

    const qList = getCbtQuestions(examId);
    setQuestions(qList);

    // Initialize blank answers
    const initAnswers: Record<string, ExamineeAnswer> = {};
    qList.forEach((q) => {
      initAnswers[q.id] = { questionId: q.id, isFlagged: false };
    });
    setAnswers(initAnswers);
  }, [examId, router]);

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0 && exam) {
      handleFinalSubmission();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId: string, optionKey: 'A' | 'B' | 'C' | 'D') => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        selectedOptionKey: optionKey,
      },
    }));
  };

  const handleSelectTrueFalse = (questionId: string, val: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        selectedTrueFalse: val,
      },
    }));
  };

  const handleTheoryTextChange = (questionId: string, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        theoryAnswerText: text,
      },
    }));
  };

  const handleTheoryImageUpload = (questionId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAnswers((prev) => ({
          ...prev,
          [questionId]: {
            ...prev[questionId],
            theoryAttachmentUrl: reader.result as string,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleFlag = (questionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        isFlagged: !prev[questionId]?.isFlagged,
      },
    }));
  };

  const handleFinalSubmission = () => {
    if (!exam || !currentUser) return;
    setIsSubmitting(true);

    // Calculate score for auto-gradable MCQ & True/False
    let totalScore = 0;
    let needsManualGrading = false;

    questions.forEach((q) => {
      const ans = answers[q.id];
      if (q.type === 'MCQ') {
        if (ans && ans.selectedOptionKey === q.correctOptionKey) {
          totalScore += q.marks;
        }
      } else if (q.type === 'TRUE_FALSE') {
        if (ans && ans.selectedTrueFalse === q.correctTrueFalse) {
          totalScore += q.marks;
        }
      } else if (q.type === 'THEORY') {
        needsManualGrading = true;
      }
    });

    const totalPossibleMarks = exam.totalMarks || 100;
    const percentage = Math.round((totalScore / totalPossibleMarks) * 100);
    const isPassed = percentage >= (exam.passingScore || 50);

    const submission = saveCbtSubmission({
      examId: exam.id,
      examTitle: exam.title,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      candidateId: currentUser.candidateId,
      answers,
      score: totalScore,
      totalMarks: totalPossibleMarks,
      percentage,
      isPassed,
      isGraded: !needsManualGrading,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      router.push(`/dashboard/results/${submission.id}`);
    }, 800);
  };

  if (!exam || questions.length === 0 || !currentUser) {
    return <div className="p-10 text-center animate-pulse">Initializing Computer-Based Test environment...</div>;
  }

  const currentQ = questions[currentIndex];
  const currentAns = answers[currentQ.id] || {};

  const answeredCount = Object.values(answers).filter(
    (a) => a.selectedOptionKey || a.selectedTrueFalse !== undefined || (a.theoryAnswerText && a.theoryAnswerText.trim().length > 0)
  ).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* CBT Header Bar with Timer & Candidate Badge */}
      <header className="bg-primary text-white py-4 px-6 sticky top-0 z-30 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary text-white rounded-xl flex items-center justify-center font-black text-lg">
            💻
          </div>
          <div>
            <h1 className="font-bold text-base text-white">{exam.title}</h1>
            <p className="text-xs text-amber-200">Candidate: {currentUser.name} ({currentUser.candidateId})</p>
          </div>
        </div>

        {/* Realtime Countdown Timer Badge */}
        <div className="flex items-center gap-4">
          <div className={`px-5 py-2 rounded-2xl font-black text-base flex items-center gap-2 shadow-inner ${
            timeLeft < 300 ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-900 text-amber-400 border border-amber-400/30'
          }`}>
            <span>⏱️ TIME REMAINING:</span>
            <span>{formatTimer(timeLeft)}</span>
          </div>

          <button
            onClick={() => setIsConfirmModalOpen(true)}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg"
          >
            Submit Examination
          </button>
        </div>
      </header>

      {/* Main Examination Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid lg:grid-cols-4 gap-6">
        {/* Left / Main Question Area */}
        <div className="lg:col-span-3 bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
          <div>
            {/* Question Header & Category Badge */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest rounded-full">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                  {currentQ.category}
                </span>
                {currentQ.isGerman && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-black rounded-full">
                    🇩🇪 German Language
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500">Marks: {currentQ.marks}</span>
                <button
                  onClick={() => toggleFlag(currentQ.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    currentAns.isFlagged
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {currentAns.isFlagged ? '🚩 Flagged for Review' : '🏳️ Flag Question'}
                </button>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-4 mb-8">
              <h2 className="text-xl font-bold text-slate-900 leading-relaxed whitespace-pre-line">
                {currentQ.questionText}
              </h2>

              {/* Question Image (with Zoom Modal trigger) */}
              {currentQ.imageUrl && (
                <div className="mt-4">
                  <div className="relative inline-block group cursor-pointer" onClick={() => setZoomImageUrl(currentQ.imageUrl!)}>
                    <img
                      src={currentQ.imageUrl}
                      alt="Question diagram"
                      className="max-h-64 rounded-2xl border border-slate-200 shadow-sm object-cover group-hover:opacity-90 transition-all"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-2xl flex items-center justify-center text-white font-bold text-xs transition-opacity">
                      🔍 Click to Zoom Image
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Response Section Based on Type */}

            {/* TYPE 1: Multiple Choice Options ABCD */}
            {currentQ.type === 'MCQ' && (
              <div className="space-y-3">
                <label className="block text-xs font-black text-primary uppercase tracking-widest mb-2">Select Correct Option (A, B, C, D):</label>
                {(currentQ.options || [
                  { key: 'A', text: 'Option A' },
                  { key: 'B', text: 'Option B' },
                  { key: 'C', text: 'Option C' },
                  { key: 'D', text: 'Option D' },
                ]).map((opt) => {
                  const isSelected = currentAns.selectedOptionKey === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectOption(currentQ.id, opt.key)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-primary text-white border-primary shadow-lg shadow-primary/10'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm ${
                          isSelected ? 'bg-secondary text-white' : 'bg-white text-primary border border-slate-200'
                        }`}>
                          {opt.key}
                        </span>
                        <span className="font-medium text-base">{opt.text}</span>
                      </div>
                      {opt.imageUrl && (
                        <img src={opt.imageUrl} alt={`Option ${opt.key}`} className="h-10 w-10 object-cover rounded-lg border" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* TYPE 2: True or False */}
            {currentQ.type === 'TRUE_FALSE' && (
              <div className="space-y-4">
                <label className="block text-xs font-black text-primary uppercase tracking-widest mb-2">Select Statement Status:</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleSelectTrueFalse(currentQ.id, true)}
                    className={`p-6 rounded-2xl border-2 font-black text-lg transition-all ${
                      currentAns.selectedTrueFalse === true
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg'
                        : 'bg-slate-50 text-slate-700 hover:bg-emerald-50 border-slate-200'
                    }`}
                  >
                    ✔️ TRUE (Richtig)
                  </button>
                  <button
                    onClick={() => handleSelectTrueFalse(currentQ.id, false)}
                    className={`p-6 rounded-2xl border-2 font-black text-lg transition-all ${
                      currentAns.selectedTrueFalse === false
                        ? 'bg-red-600 text-white border-red-600 shadow-lg'
                        : 'bg-slate-50 text-slate-700 hover:bg-red-50 border-slate-200'
                    }`}
                  >
                    ❌ FALSE (Falsch)
                  </button>
                </div>
              </div>
            )}

            {/* TYPE 3: Theory / Essay with Image Attachment */}
            {currentQ.type === 'THEORY' && (
              <div className="space-y-4">
                <label className="block text-xs font-black text-primary uppercase tracking-widest mb-2">Written Response & Document Attachment:</label>
                <textarea
                  rows={5}
                  value={currentAns.theoryAnswerText || ''}
                  onChange={(e) => handleTheoryTextChange(currentQ.id, e.target.value)}
                  placeholder="Type your written answer, translation, or legal analysis here..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/30 text-sm font-medium text-slate-800"
                />

                {/* Optional Image Attachment */}
                <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold text-slate-700">📷 Attach Written Sheet Image / Diagram (Optional)</p>
                      <p className="text-[10px] text-slate-400">Upload handwritten notes or translation diagram for examiner review.</p>
                    </div>
                    <label className="px-4 py-2 bg-primary text-white font-bold text-xs rounded-xl cursor-pointer hover:bg-primary/90">
                      Browse Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleTheoryImageUpload(currentQ.id, e)}
                      />
                    </label>
                  </div>

                  {currentAns.theoryAttachmentUrl && (
                    <div className="mt-3 flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200">
                      <img src={currentAns.theoryAttachmentUrl} alt="Examinee attachment" className="h-12 w-12 object-cover rounded-lg" />
                      <span className="text-xs font-bold text-emerald-700">Image attached successfully</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Navigation Buttons */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-8">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200 disabled:opacity-50 transition-all"
            >
              ⬅️ Previous Question
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="px-8 py-3 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary/90 transition-all shadow-md"
              >
                Next Question ➡️
              </button>
            ) : (
              <button
                onClick={() => setIsConfirmModalOpen(true)}
                className="px-8 py-3 bg-emerald-600 text-white font-black rounded-xl text-xs hover:bg-emerald-700 transition-all shadow-lg"
              >
                Finish & Submit Exam
              </button>
            )}
          </div>
        </div>

        {/* Right Sidebar: Question Grid Navigator */}
        <div className="bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm flex flex-col justify-between h-fit">
          <div>
            <h3 className="font-bold text-primary text-sm uppercase tracking-widest mb-4">Question Grid Navigator</h3>
            
            <div className="grid grid-cols-4 gap-2 mb-6">
              {questions.map((q, idx) => {
                const ans = answers[q.id] || {};
                const isAnswered = ans.selectedOptionKey || ans.selectedTrueFalse !== undefined || (ans.theoryAnswerText && ans.theoryAnswerText.trim().length > 0);
                const isCurrent = idx === currentIndex;
                const isFlagged = ans.isFlagged;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-11 rounded-xl font-black text-xs transition-all relative ${
                      isCurrent
                        ? 'ring-2 ring-primary ring-offset-2 scale-105'
                        : ''
                    } ${
                      isFlagged
                        ? 'bg-amber-400 text-slate-900 font-extrabold'
                        : isAnswered
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="space-y-2 text-xs border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-emerald-600 rounded-md" />
                <span className="text-slate-600 font-medium">Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-slate-200 rounded-md" />
                <span className="text-slate-600 font-medium">Unanswered ({questions.length - answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-amber-400 rounded-md" />
                <span className="text-slate-600 font-medium">Flagged for Review</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={() => setIsConfirmModalOpen(true)}
              className="w-full py-3.5 bg-emerald-600 text-white font-black text-xs rounded-xl shadow-lg hover:bg-emerald-700 transition-all uppercase tracking-wider"
            >
              Submit Exam ({answeredCount}/{questions.length})
            </button>
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {zoomImageUrl && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setZoomImageUrl(null)}>
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl p-4">
            <button className="absolute top-2 right-2 px-3 py-1 bg-slate-900 text-white font-bold text-xs rounded-full">✕ Close</button>
            <img src={zoomImageUrl} alt="Zoomed Diagram" className="max-h-[80vh] max-w-full rounded-2xl mx-auto object-contain" />
          </div>
        </div>
      )}

      {/* Final Submit Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-md w-full p-8 space-y-6 shadow-2xl text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center text-3xl mx-auto font-black">
              🏁
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary">Confirm Final CBT Submission?</h3>
              <p className="text-slate-500 text-xs mt-2">
                You have answered <strong>{answeredCount}</strong> out of <strong>{questions.length}</strong> questions.
                {questions.length - answeredCount > 0 && <span className="text-amber-600 block mt-1 font-bold">Warning: {questions.length - answeredCount} questions are unanswered.</span>}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="flex-1 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200"
              >
                Return to Exam
              </button>
              <button
                onClick={handleFinalSubmission}
                disabled={isSubmitting}
                className="flex-1 py-3.5 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Yes, Submit Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
