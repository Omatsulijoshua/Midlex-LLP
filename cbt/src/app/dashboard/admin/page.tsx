"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCbtUsers, getCbtExams, getCbtQuestions, getCbtSubmissions, CbtUser, CbtExam, CbtSubmission } from '@/lib/cbtStore';

export default function AdminCbtDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<CbtUser | null>(null);
  const [users, setUsers] = useState<CbtUser[]>([]);
  const [exams, setExams] = useState<CbtExam[]>([]);
  const [questionsCount, setQuestionsCount] = useState<number>(0);
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
        if (u.role !== 'ADMIN') {
          router.push('/dashboard');
          return;
        }
        setCurrentUser(u);
      } catch (e) {
        router.push('/');
        return;
      }
    }
    const allUsers = getCbtUsers();
    setUsers(allUsers);
    setExams(getCbtExams());
    setQuestionsCount(getCbtQuestions().length);
    setSubmissions(getCbtSubmissions());
  }, [router]);

  if (!currentUser) return <div className="p-10 text-center animate-pulse">Loading Admin Examiner Portal...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Admin Top Header */}
      <header className="bg-amber-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Midlex LLP" className="h-10 w-auto object-contain rounded-xl border border-amber-500/30 shadow-sm" />
            <div>
              <h1 className="font-bold text-lg text-white">Midlex CBT Admin Examiner Command Center</h1>
              <p className="text-[11px] text-amber-200">Question Authoring, User Auto-Creation & Theory Grading</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-white/10 text-white font-bold rounded-xl text-xs hover:bg-white/20 transition-all"
            >
              👁️ View Examinee Portal
            </Link>
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
          <h2 className="text-3xl font-black text-slate-900">Examiner Command Dashboard</h2>
          <p className="text-slate-500 text-sm mt-1">Manage examinee user accounts, author CBT questions, and review theory submissions.</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid sm:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Examinee Accounts</p>
            <p className="text-3xl font-black text-primary mt-2">{users.filter((u) => u.role === 'USER').length}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">CBT Exam Modules</p>
            <p className="text-3xl font-black text-amber-600 mt-2">{exams.length}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Question Bank Size</p>
            <p className="text-3xl font-black text-emerald-600 mt-2">{questionsCount} Items</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Completed Attempts</p>
            <p className="text-3xl font-black text-blue-600 mt-2">{submissions.length}</p>
          </div>
        </div>

        {/* Quick Admin Actions Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          <Link
            href="/dashboard/admin/create-user"
            className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-2xl font-black mb-6 group-hover:scale-110 transition-transform">
                👤
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Auto-Create User Accounts</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Automatically generate examinee accounts with Email, Password, Candidate Registration ID, and Exam Allocations.
              </p>
            </div>
            <span className="mt-8 font-bold text-xs text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Create Accounts ➡️
            </span>
          </Link>

          <Link
            href="/dashboard/admin/questions"
            className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center text-2xl font-black mb-6 group-hover:scale-110 transition-transform">
                📝
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Question Bank & Types</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Set German language prompts, Diagram Images, MCQ (ABCD), True/False, and Theory questions with image attachment support.
              </p>
            </div>
            <span className="mt-8 font-bold text-xs text-amber-700 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Set Questions ➡️
            </span>
          </Link>

          <Link
            href="/dashboard/admin/submissions"
            className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center text-2xl font-black mb-6 group-hover:scale-110 transition-transform">
                📊
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Submissions & Theory Grading</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Review examinee score reports, inspect handwritten/uploaded theory images, and enter custom grades/feedback.
              </p>
            </div>
            <span className="mt-8 font-bold text-xs text-emerald-700 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Review Submissions ➡️
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
}
