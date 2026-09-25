"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { saveCbtUser, getCbtUsers, getCbtExams, CbtUser, CbtExam } from '@/lib/cbtStore';

export default function AdminCreateUserPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [candidateId, setCandidateId] = useState('');
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [availableExams, setAvailableExams] = useState<CbtExam[]>([]);
  const [existingUsers, setExistingUsers] = useState<CbtUser[]>([]);

  const [createdUserCard, setCreatedUserCard] = useState<CbtUser | null>(null);

  useEffect(() => {
    setAvailableExams(getCbtExams());
    setExistingUsers(getCbtUsers());
    // Auto-generate candidate ID & password
    generateDefaults();
  }, []);

  const generateDefaults = () => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    setCandidateId(`MID-CBT-${randomDigits}`);
    setPassword(`midlex${randomDigits}`);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      alert('Please fill out Name, Email, and Password.');
      return;
    }

    const newUser = saveCbtUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      role: 'USER',
      candidateId: candidateId.trim(),
      assignedExamIds: selectedExams.length > 0 ? selectedExams : availableExams.map((e) => e.id),
    });

    setCreatedUserCard(newUser);
    setExistingUsers(getCbtUsers());
    setName('');
    setEmail('');
    generateDefaults();
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-amber-900 text-white py-4 px-6 sticky top-0 z-30 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/admin" className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold text-xs">
              ⬅️ Admin Panel
            </Link>
            <h1 className="font-bold text-base">Auto-Create Examinee User Accounts</h1>
          </div>
          <span className="text-xs font-bold text-amber-200">Examiner Tools</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-10 space-y-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Examinee Account Creator</h2>
          <p className="text-slate-500 text-sm mt-1">
            Automatically register examinees with their Email, Password, and Candidate ID for CBT access.
          </p>
        </div>

        {/* Newly Created Credentials Display Card */}
        {createdUserCard && (
          <div className="p-6 bg-emerald-900 text-white rounded-[28px] shadow-xl space-y-4 border border-emerald-700">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-200">
                ✅ ACCOUNT CREATED SUCCESSFULLY
              </span>
              <button onClick={() => setCreatedUserCard(null)} className="text-xs text-white/60 hover:text-white font-bold">✕ Dismiss</button>
            </div>
            <div className="grid sm:grid-cols-4 gap-4 bg-emerald-950/60 p-4 rounded-2xl text-xs border border-emerald-800">
              <div>
                <p className="text-emerald-300 font-bold uppercase tracking-wider text-[10px]">Candidate Name</p>
                <p className="font-bold text-white text-sm mt-0.5">{createdUserCard.name}</p>
              </div>
              <div>
                <p className="text-emerald-300 font-bold uppercase tracking-wider text-[10px]">Email (Login)</p>
                <p className="font-bold text-white text-sm mt-0.5">{createdUserCard.email}</p>
              </div>
              <div>
                <p className="text-emerald-300 font-bold uppercase tracking-wider text-[10px]">Password</p>
                <p className="font-bold text-amber-300 text-sm mt-0.5">{createdUserCard.password}</p>
              </div>
              <div>
                <p className="text-emerald-300 font-bold uppercase tracking-wider text-[10px]">Candidate Reg ID</p>
                <p className="font-bold text-white text-sm mt-0.5">{createdUserCard.candidateId}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Create Form */}
          <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
            <form onSubmit={handleCreateUser} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Examinee Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Uzoma Okonti"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-sm text-slate-800"
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Email Address (Login) *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. uzoma@midlex.com"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-sm text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Auto-Generated Password *</label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-sm text-amber-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Candidate Registration ID</label>
                <input
                  type="text"
                  value={candidateId}
                  onChange={(e) => setCandidateId(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-sm text-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-2xl text-sm shadow-xl shadow-amber-600/20 transition-all uppercase tracking-wider"
              >
                ✨ Automatically Create User Account
              </button>
            </form>
          </div>

          {/* Existing Accounts List */}
          <div className="bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest mb-4">Existing Accounts ({existingUsers.length})</h3>
              <div className="space-y-3 max-h-[420px] overflow-y-auto">
                {existingUsers.map((u) => (
                  <div key={u.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900">{u.name}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        u.role === 'ADMIN' ? 'bg-amber-100 text-amber-900' : 'bg-primary/10 text-primary'
                      }`}>
                        {u.role}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-1">{u.email}</p>
                    <p className="text-slate-400 text-[10px] mt-0.5">ID: {u.candidateId}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
