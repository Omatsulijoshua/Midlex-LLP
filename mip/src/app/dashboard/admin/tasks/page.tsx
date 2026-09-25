"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMipUsers, getMipTasks, saveMipTask, MipTask, MipUser } from '@/lib/mipStore';

export default function AdminTasksBuilderPage() {
  const [tasks, setTasks] = useState<MipTask[]>([]);
  const [interns, setInterns] = useState<MipUser[]>([]);
  const [currentUser, setCurrentUser] = useState<MipUser | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Legal Research & Case Brief');
  const [assignedToInternId, setAssignedToInternId] = useState('');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('midlex_mip_session');
      if (session) {
        try { setCurrentUser(JSON.parse(session)); } catch (e) {}
      }
    }
    const users = getMipUsers();
    const studentList = users.filter((u) => u.role === 'STUDENT_INTERN');
    setInterns(studentList);
    if (studentList.length > 0) {
      setAssignedToInternId(studentList[0].id);
    }
    setTasks(getMipTasks());
  }, []);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !assignedToInternId) {
      alert('Please fill in task title, description, and assign an intern.');
      return;
    }

    const targetIntern = interns.find((i) => i.id === assignedToInternId);

    saveMipTask({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      assignedToInternId,
      assignedToName: targetIntern ? targetIntern.name : 'Student Lawyer',
      assignedByAdminName: currentUser ? currentUser.name : 'Barr. Monday Isidahome',
      dueDate,
    });

    alert('Legal research task assigned to intern successfully!');
    setTitle('');
    setDescription('');
    setTasks(getMipTasks());
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-amber-950 text-white py-4 px-6 sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/admin" className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold text-xs">
              ⬅️ Admin Panel
            </Link>
            <h1 className="font-bold text-base">Chamber Tasks & Research Assignment Builder</h1>
          </div>
          <span className="text-xs font-bold text-amber-200">Internship Task Manager</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-10 space-y-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Task & Case Brief Assignment Builder</h2>
          <p className="text-slate-500 text-sm mt-1">Assign legal research briefs, court document drafting, and case summaries to student lawyers.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Create Task Form */}
          <div className="lg:col-span-1 bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Assign New Chamber Task</h3>

            <form onSubmit={handleCreateTask} className="space-y-5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-widest mb-1">Assign To Student Intern *</label>
                <select
                  value={assignedToInternId}
                  onChange={(e) => setAssignedToInternId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                >
                  {interns.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} ({i.internId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-widest mb-1">Task Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                >
                  <option value="Legal Research & Case Brief">Legal Research & Case Brief</option>
                  <option value="Drafting Statement of Claim / Affidavit">Drafting Statement of Claim / Affidavit</option>
                  <option value="Court Briefing Note & Observation">Court Briefing Note & Observation</option>
                  <option value="Client Interview Digest">Client Interview Digest</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-widest mb-1">Task Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Research on Land Use Act Sec 28"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-widest mb-1">Detailed Description & Instructions *</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide precise research questions or legal principles to brief..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-widest mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl text-xs uppercase tracking-wider transition-all shadow-xl shadow-primary/20"
              >
                ➕ Assign Task to Student Intern
              </button>
            </form>
          </div>

          {/* Active Tasks List */}
          <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Chamber Assignments ({tasks.length})</h3>

            <div className="space-y-4">
              {tasks.map((t) => (
                <div key={t.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-primary uppercase">{t.category}</span>
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

                  <h4 className="font-bold text-slate-900 text-sm">{t.title}</h4>
                  <p className="text-slate-600">{t.description}</p>
                  <p className="text-slate-400">Assigned To: <strong>{t.assignedToName}</strong> | Due Date: <strong>{t.dueDate}</strong></p>

                  {t.submissionText && (
                    <div className="p-3 bg-white border border-slate-200 rounded-xl mt-2">
                      <p className="font-bold text-slate-700 mb-1">Submitted Research Response:</p>
                      <p className="text-slate-800 italic">{t.submissionText}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
