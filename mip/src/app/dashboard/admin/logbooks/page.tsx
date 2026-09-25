"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMipLogbooks, updateLogbookStatus, MipLogbookEntry, MipUser } from '@/lib/mipStore';

export default function AdminLogbooksReviewPage() {
  const [logbooks, setLogbooks] = useState<MipLogbookEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<MipUser | null>(null);
  const [activeLog, setActiveLog] = useState<MipLogbookEntry | null>(null);
  const [supervisorNotes, setSupervisorNotes] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('midlex_mip_session');
      if (session) {
        try { setCurrentUser(JSON.parse(session)); } catch (e) {}
      }
    }
    setLogbooks(getMipLogbooks());
  }, []);

  const handleUpdateStatus = (status: 'APPROVED' | 'REVISION_REQUESTED') => {
    if (!activeLog || !currentUser) return;
    updateLogbookStatus(activeLog.id, status, supervisorNotes.trim() || undefined, currentUser.name);
    alert(`Logbook entry marked as ${status}!`);
    setActiveLog(null);
    setSupervisorNotes('');
    setLogbooks(getMipLogbooks());
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-amber-950 text-white py-4 px-6 sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/admin" className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold text-xs">
              ⬅️ Admin Command Center
            </Link>
            <h1 className="font-bold text-base">Student Internship Logbook Approval Panel</h1>
          </div>
          <span className="text-xs font-bold text-amber-200">Logbook Supervisor Review</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-10 space-y-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Internship Logbook Approval & Review</h2>
          <p className="text-slate-500 text-sm mt-1">Verify daily court attendance, legal research notes, and approve logged internship hours.</p>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-900">Submitted Logbook Entries ({logbooks.length})</h3>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-4 py-2 rounded-xl">
              Pending Approval: {logbooks.filter((l) => l.status === 'PENDING').length} Entries
            </span>
          </div>

          <div className="space-y-6 divide-y divide-slate-100">
            {logbooks.map((log) => (
              <div key={log.id} className="pt-6 first:pt-0 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{log.internName}</h4>
                    <p className="text-xs text-slate-500">Date: <strong>{log.date}</strong> | Hours Logged: <strong>{log.hoursLogged} Hours</strong></p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase ${
                      log.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : log.status === 'REVISION_REQUESTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800 animate-pulse'
                    }`}>
                      {log.status}
                    </span>
                    <button
                      onClick={() => {
                        setActiveLog(log);
                        setSupervisorNotes(log.supervisorNotes || '');
                      }}
                      className="px-4 py-2 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary/90"
                    >
                      ✍️ Review & Comment
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl text-xs space-y-2 border border-slate-200">
                  <p><strong>Court / Chamber Activity:</strong> <span className="text-slate-800">{log.chamberActivity}</span></p>
                  <p><strong>Legal Principles & Provisions Learned:</strong> <span className="text-slate-800 italic">{log.legalLearningsText}</span></p>
                  {log.attachmentUrl && (
                    <div className="mt-2">
                      <p className="font-bold text-slate-700 mb-1">Uploaded Draft / Scanned Document Sheet:</p>
                      <img src={log.attachmentUrl} alt="Logbook attachment" className="h-24 w-auto object-cover rounded-xl border" />
                    </div>
                  )}
                  {log.supervisorNotes && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl mt-2 font-medium">
                      💬 <strong>Supervisor Notes ({log.reviewedBy}):</strong> {log.supervisorNotes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Supervisor Review Modal */}
      {activeLog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-xl w-full p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-primary">Logbook Supervisor Evaluation</h3>
              <button onClick={() => setActiveLog(null)} className="text-slate-400 font-bold text-sm">✕ Close</button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl text-xs space-y-1">
              <p><strong>Intern:</strong> {activeLog.internName}</p>
              <p><strong>Activity Date:</strong> {activeLog.date} ({activeLog.hoursLogged} Hours)</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-widest mb-1">Supervisor Feedback & Guidance Notes</label>
                <textarea
                  rows={4}
                  value={supervisorNotes}
                  onChange={(e) => setSupervisorNotes(e.target.value)}
                  placeholder="Add feedback, commendations, or specific legal corrections for the student lawyer..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('REVISION_REQUESTED')}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg"
                >
                  ❌ Request Revision
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('APPROVED')}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg"
                >
                  ✅ Approve Logbook Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
