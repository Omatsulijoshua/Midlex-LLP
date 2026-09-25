"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  getMipLogbooks,
  getMipTasks,
  saveMipLogbookEntry,
  updateMipTaskStatus,
  MipUser,
  MipLogbookEntry,
  MipTask,
} from '@/lib/mipStore';

export default function StudentInternDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<MipUser | null>(null);
  const [logbooks, setLogbooks] = useState<MipLogbookEntry[]>([]);
  const [tasks, setTasks] = useState<MipTask[]>([]);

  // Logbook Modal State
  const [isLogbookModalOpen, setIsLogbookModalOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hoursLogged, setHoursLogged] = useState(8);
  const [chamberActivity, setChamberActivity] = useState('');
  const [legalLearningsText, setLegalLearningsText] = useState('');
  const [tasksCompleted, setTasksCompleted] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');

  // Task Response Modal State
  const [activeTask, setActiveTask] = useState<MipTask | null>(null);
  const [taskSubmissionText, setTaskSubmissionText] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('midlex_mip_session');
      if (!session) {
        router.push('/');
        return;
      }
      try {
        const u = JSON.parse(session);
        setCurrentUser(u);
        setLogbooks(getMipLogbooks(u.id));
        setTasks(getMipTasks(u.id));
      } catch (e) {
        router.push('/');
        return;
      }
    }
  }, [router]);

  const handleSaveLogbook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!chamberActivity.trim() || !legalLearningsText.trim()) {
      alert('Please fill in Chamber Activity and Legal Learnings.');
      return;
    }

    saveMipLogbookEntry({
      internId: currentUser.id,
      internName: currentUser.name,
      internEmail: currentUser.email,
      date,
      hoursLogged: Number(hoursLogged) || 8,
      chamberActivity: chamberActivity.trim(),
      legalLearningsText: legalLearningsText.trim(),
      tasksCompleted: tasksCompleted.trim() || 'General Chamber Attendance & Duties',
      attachmentUrl: attachmentUrl.trim() || undefined,
    });

    alert('Logbook entry submitted successfully for Supervisor approval!');
    setIsLogbookModalOpen(false);
    setChamberActivity('');
    setLegalLearningsText('');
    setTasksCompleted('');
    setAttachmentUrl('');
    setLogbooks(getMipLogbooks(currentUser.id));
  };

  const handleSubmitTaskResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask) return;
    if (!taskSubmissionText.trim()) {
      alert('Please enter your research or task response text.');
      return;
    }

    updateMipTaskStatus(activeTask.id, 'SUBMITTED', taskSubmissionText.trim());
    alert('Task response submitted to supervisor for review!');
    setActiveTask(null);
    setTaskSubmissionText('');
    if (currentUser) setTasks(getMipTasks(currentUser.id));
  };

  if (!currentUser) return <div className="p-10 text-center animate-pulse">Loading Student Intern Portal...</div>;

  const totalApprovedHours = logbooks
    .filter((l) => l.status === 'APPROVED')
    .reduce((sum, l) => sum + l.hoursLogged, 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Student Navigation Header */}
      <header className="bg-primary text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Midlex LLP" className="h-10 w-auto object-contain rounded-xl border border-white/20 shadow-sm" />
            <div>
              <h1 className="font-bold text-lg text-white">Midlex Internship Program (MIP)</h1>
              <p className="text-[11px] text-amber-200">Intern Registration ID: {currentUser.internId || 'MIP-2026-014'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-bold bg-white/10 px-4 py-2 rounded-xl text-white">
              👤 {currentUser.name}
            </span>
            {(currentUser.role === 'INTERNSHIP_ADMIN' || currentUser.role === 'INTERNSHIP_SUPER_ADMIN') && (
              <Link
                href="/dashboard/admin"
                className="px-4 py-2 bg-amber-600 text-white font-bold rounded-xl text-xs hover:bg-amber-700 transition-all"
              >
                📋 Admin Panel
              </Link>
            )}
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

      {/* Main Student Portal Container */}
      <main className="max-w-6xl mx-auto px-6 pt-10 space-y-10">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-primary via-slate-900 to-amber-950 text-white p-8 rounded-[36px] shadow-xl flex flex-wrap items-center justify-between gap-6 border border-amber-500/20">
          <div className="space-y-2">
            <span className="px-3 py-1 bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-400/30">
              STUDENT LAWYER INTERNSHIP PORTAL
            </span>
            <h2 className="text-3xl font-black">Welcome back, {currentUser.name}!</h2>
            <p className="text-xs text-amber-100/80 max-w-xl leading-relaxed">
              Institution: <strong>{currentUser.institution || 'Nigerian Law School'}</strong> | Supervisor: <strong>{currentUser.assignedSupervisor || 'Barr. Monday Isidahome'}</strong>
            </p>
          </div>

          <button
            onClick={() => setIsLogbookModalOpen(true)}
            className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider transition-all shadow-xl shadow-amber-500/20"
          >
            ✍️ Fill Daily Log Book Entry
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid sm:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Approved Hours Logged</p>
            <p className="text-3xl font-black text-emerald-600 mt-2">{totalApprovedHours} Hours</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Logbook Entries</p>
            <p className="text-3xl font-black text-primary mt-2">{logbooks.length} Entries</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Assigned Tasks</p>
            <p className="text-3xl font-black text-amber-600 mt-2">{tasks.length} Assignments</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending Approvals</p>
            <p className="text-3xl font-black text-blue-600 mt-2">
              {logbooks.filter((l) => l.status === 'PENDING').length} Items
            </p>
          </div>
        </div>

        {/* Chamber Tasks & Assignments Section */}
        <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Assigned Legal Research & Chamber Tasks</h3>
              <p className="text-slate-500 text-xs mt-1">Review legal briefs assigned by your Chamber Supervisors.</p>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
              {tasks.filter((t) => t.status !== 'APPROVED').length} Pending Tasks
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {tasks.map((t) => (
              <div key={t.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-full">
                      {t.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      t.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : t.status === 'SUBMITTED'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {t.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base">{t.title}</h4>
                  <p className="text-slate-600 text-xs mt-1 leading-relaxed">{t.description}</p>
                  <p className="text-[11px] text-slate-400 mt-2">Assigned by: <strong>{t.assignedByAdminName}</strong> | Due Date: <strong>{t.dueDate}</strong></p>
                </div>

                {t.status !== 'APPROVED' && (
                  <button
                    onClick={() => setActiveTask(t)}
                    className="w-full py-2.5 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary/90 transition-all mt-4"
                  >
                    ✍️ Submit Task Answer / Brief
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Logbook History Table */}
        <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Daily Internship Logbook History</h3>
              <p className="text-slate-500 text-xs mt-1">Official record of daily court attendance, research, and legal learnings.</p>
            </div>
            <button
              onClick={() => setIsLogbookModalOpen(true)}
              className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary/90 transition-all"
            >
              ➕ Add Logbook Entry
            </button>
          </div>

          <div className="space-y-4 divide-y divide-slate-100">
            {logbooks.map((log) => (
              <div key={log.id} className="pt-6 first:pt-0 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-slate-900 text-amber-400 text-xs font-black rounded-xl">
                      📅 {log.date}
                    </span>
                    <span className="text-xs font-bold text-slate-700">⏱️ {log.hoursLogged} Hours Logged</span>
                  </div>

                  <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                    log.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : log.status === 'REVISION_REQUESTED'
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {log.status === 'APPROVED' ? '✅ Approved by Supervisor' : log.status === 'REVISION_REQUESTED' ? '❌ Requires Revision' : '⏳ Pending Review'}
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl text-xs space-y-2 border border-slate-100">
                  <p><strong>Chamber & Court Activity:</strong> <span className="text-slate-800">{log.chamberActivity}</span></p>
                  <p><strong>Key Legal Learnings:</strong> <span className="text-slate-800 italic">{log.legalLearningsText}</span></p>
                  {log.supervisorNotes && (
                    <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-900 rounded-xl mt-2">
                      <strong>💬 Supervisor Feedback ({log.reviewedBy}):</strong> {log.supervisorNotes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Logbook Modal */}
      {isLogbookModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-xl w-full p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-primary">New Daily Internship Logbook Entry</h3>
              <button onClick={() => setIsLogbookModalOpen(false)} className="text-slate-400 font-bold text-sm">✕ Close</button>
            </div>

            <form onSubmit={handleSaveLogbook} className="space-y-5 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-widest mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-widest mb-1">Hours Logged</label>
                  <input
                    type="number"
                    min={1}
                    max={16}
                    value={hoursLogged}
                    onChange={(e) => setHoursLogged(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-widest mb-1">Court & Chamber Activity Summary *</label>
                <textarea
                  rows={3}
                  value={chamberActivity}
                  onChange={(e) => setChamberActivity(e.target.value)}
                  placeholder="Detail court sessions attended, client interview observations, or drafting performed..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-widest mb-1">Key Legal Learnings & Principles *</label>
                <textarea
                  rows={3}
                  value={legalLearningsText}
                  onChange={(e) => setLegalLearningsText(e.target.value)}
                  placeholder="State the legal principles, statutory provisions (e.g. Evidence Act, Civil Procedure Rules) or precedents learned..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-widest mb-1">Specific Tasks Completed</label>
                <input
                  type="text"
                  value={tasksCompleted}
                  onChange={(e) => setTasksCompleted(e.target.value)}
                  placeholder="e.g. Drafted Statement of Claim, Processed court filing"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsLogbookModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary/90 shadow-lg"
                >
                  Submit Logbook Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Submission Modal */}
      {activeTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-xl w-full p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-primary">Submit Task Response</h3>
              <button onClick={() => setActiveTask(null)} className="text-slate-400 font-bold text-sm">✕ Close</button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl text-xs">
              <p className="font-bold text-slate-900">{activeTask.title}</p>
              <p className="text-slate-600 mt-1">{activeTask.description}</p>
            </div>

            <form onSubmit={handleSubmitTaskResponse} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-widest mb-1">Research Response / Legal Memorandum Text</label>
                <textarea
                  rows={5}
                  value={taskSubmissionText}
                  onChange={(e) => setTaskSubmissionText(e.target.value)}
                  placeholder="Type your legal research brief, case citations, or draft text here..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary/90 shadow-lg"
              >
                Submit Task Brief to Supervisor
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
