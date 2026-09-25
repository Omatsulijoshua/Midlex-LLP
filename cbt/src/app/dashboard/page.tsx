"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCbtExams, getCbtSubmissions, CbtExam, CbtSubmission, CbtUser } from '@/lib/cbtStore';

export default function CbtStudentDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<CbtUser | null>(null);
  const [exams, setExams] = useState<CbtExam[]>([]);
  const [submissions, setSubmissions] = useState<CbtSubmission[]>([]);

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
    setExams(getCbtExams());
    setSubmissions(getCbtSubmissions());
  }, [router]);

  if (!currentUser) return <div className="p-10 text-center animate-pulse">Loading examinee portal...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Header Navigation */}
      <header className="bg-primary text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Midlex LLP" className="h-10 w-auto object-contain rounded-xl border border-white/20 shadow-sm" />
            <div>
              <h1 className="font-bold text-lg text-white">Midlex CBT Examination Portal</h1>
              <p className="text-[11px] text-amber-200">Candidate ID: {currentUser.candidateId}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-bold bg-white/10 px-4 py-2 rounded-xl text-white">
              👤 {currentUser.name} ({currentUser.email})
            </span>
            {currentUser.role === 'ADMIN' && (
              <Link
                href="/dashboard/admin"
                className="px-4 py-2 bg-amber-600 text-white font-bold rounded-xl text-xs hover:bg-amber-700 transition-all"
              >
                🛡️ Go to Admin Examiner Panel
              </Link>
            )}
            <button
              onClick={() => {
                if (typeof window !== 'undefined') localStorage.removeItem('midlex_cbt_session');
                router.push('/');
              }}
              className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl text-xs hover:bg-red-700 transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 pt-10 space-y-10">
        <div>
          <h2 className="text-3xl font-black text-primary">Available CBT Examinations</h2>
          <p className="text-slate-500 text-sm mt-1">
            Select an examination to launch the real-time computer-based testing interface.
          </p>
        </div>

        {/* Exams Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {exams.map((exam) => {
            const userSub = submissions.find((s) => s.examId === exam.id && s.userId === currentUser.id);

            return (
              <div
                key={exam.id}
                className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                      {exam.subject}
                    </span>
                    {userSub ? (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        userSub.isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {userSub.isPassed ? `PASSED (${userSub.percentage}%)` : `FAILED (${userSub.percentage}%)`}
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
                        READY TO START
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-primary mb-3">{exam.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">{exam.description}</p>

                  <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl text-center mb-6 border border-slate-100">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</p>
                      <p className="font-bold text-slate-800 text-sm">{exam.durationMinutes} Mins</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Questions</p>
                      <p className="font-bold text-slate-800 text-sm">{exam.questionCount} Items</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pass Score</p>
                      <p className="font-bold text-emerald-600 text-sm">{exam.passingScore} Marks</p>
                    </div>
                  </div>
                </div>

                <div>
                  {userSub ? (
                    <Link
                      href={`/dashboard/results/${userSub.id}`}
                      className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all text-sm flex items-center justify-center gap-2 shadow-md"
                    >
                      <span>📊 View Score & Breakdown Report</span>
                    </Link>
                  ) : (
                    <Link
                      href={`/dashboard/exam/${exam.id}`}
                      className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all text-sm flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
                    >
                      <span>🚀 Launch CBT Examination</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
