"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getMipUsers, getMipLogbooks, getMipTasks, MipUser, MipLogbookEntry, MipTask } from '@/lib/mipStore';

export default function MipAdminDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<MipUser | null>(null);
  const [interns, setInterns] = useState<MipUser[]>([]);
  const [logbooks, setLogbooks] = useState<MipLogbookEntry[]>([]);
  const [tasks, setTasks] = useState<MipTask[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('midlex_mip_session');
      if (!session) {
        router.push('/');
        return;
      }
      try {
        const u = JSON.parse(session);
        if (u.role !== 'INTERNSHIP_ADMIN' && u.role !== 'INTERNSHIP_SUPER_ADMIN') {
          router.push('/dashboard');
          return;
        }
        setCurrentUser(u);
      } catch (e) {
        router.push('/');
        return;
      }
    }
    const allUsers = getMipUsers();
    setInterns(allUsers.filter((u) => u.role === 'STUDENT_INTERN'));
    setLogbooks(getMipLogbooks());
    setTasks(getMipTasks());
  }, [router]);

  if (!currentUser) return <div className="p-10 text-center animate-pulse">Loading Internship Admin Command Center...</div>;

  const pendingLogbooks = logbooks.filter((l) => l.status === 'PENDING');

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-amber-950 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Midlex LLP" className="h-10 w-auto object-contain rounded-xl border border-amber-500/30 shadow-sm" />
            <div>
              <h1 className="font-bold text-lg text-white">Midlex Internship Program (MIP) — Admin Command Center</h1>
              <p className="text-[11px] text-amber-200">
                {currentUser.role === 'INTERNSHIP_SUPER_ADMIN' ? '🛡️ Internship Super Admin Mode' : '📋 Internship Admin Supervisor Panel'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-white/10 text-white font-bold rounded-xl text-xs hover:bg-white/20 transition-all"
            >
              👁️ View Student Portal
            </Link>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') localStorage.removeItem('midlex_mip_session');
                router.push('/');
              }}
              className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl text-xs hover:bg-red-700 transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 pt-10 space-y-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Internship Director Command Center</h2>
          <p className="text-slate-500 text-sm mt-1">Review student lawyer daily logbooks, assign chamber tasks, and track supervisor evaluations.</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid sm:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Registered Student Lawyers</p>
            <p className="text-3xl font-black text-primary mt-2">{interns.length} Interns</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending Logbook Reviews</p>
            <p className="text-3xl font-black text-amber-600 mt-2">{pendingLogbooks.length} Entries</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Research Tasks</p>
            <p className="text-3xl font-black text-emerald-600 mt-2">{tasks.length} Assignments</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Approved Logbooks</p>
            <p className="text-3xl font-black text-blue-600 mt-2">{logbooks.filter((l) => l.status === 'APPROVED').length}</p>
          </div>
        </div>

        {/* Quick Admin Management Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          <Link
            href="/dashboard/admin/logbooks"
            className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 bg-amber-100 text-amber-900 rounded-2xl flex items-center justify-center text-2xl font-black mb-6 group-hover:scale-110 transition-transform">
                📖
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Logbook Review & Approval</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Review student daily logbook entries, inspect court attendance notes, enter supervisor feedback, and approve logged hours.
              </p>
            </div>
            <span className="mt-8 font-bold text-xs text-amber-800 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Review Logbooks ➡️
            </span>
          </Link>

          <Link
            href="/dashboard/admin/interns"
            className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-2xl font-black mb-6 group-hover:scale-110 transition-transform">
                👤
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Intern Accounts & Supervisors</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Create new student lawyer accounts, set Law School registration IDs, and assign senior chamber counsel supervisors.
              </p>
            </div>
            <span className="mt-8 font-bold text-xs text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Manage Interns ➡️
            </span>
          </Link>

          <Link
            href="/dashboard/admin/tasks"
            className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 bg-emerald-100 text-emerald-900 rounded-2xl flex items-center justify-center text-2xl font-black mb-6 group-hover:scale-110 transition-transform">
                📝
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Chamber Tasks & Assignments</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Assign legal research topics, statement of claim drafts, and case summaries to interns with due dates.
              </p>
            </div>
            <span className="mt-8 font-bold text-xs text-emerald-800 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Manage Tasks ➡️
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
}
