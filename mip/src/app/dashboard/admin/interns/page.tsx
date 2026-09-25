"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMipUsers, saveMipUser, MipUser } from '@/lib/mipStore';

export default function AdminInternsManagementPage() {
  const [users, setUsers] = useState<MipUser[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('user123');
  const [internId, setInternId] = useState('');
  const [institution, setInstitution] = useState('Nigerian Law School, Abuja Campus');
  const [assignedSupervisor, setAssignedSupervisor] = useState('Barr. Monday Isidahome');

  useEffect(() => {
    setUsers(getMipUsers());
    setInternId(`MIP-2026-0${Math.floor(Math.random() * 90 + 10)}`);
  }, []);

  const handleCreateIntern = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert('Please fill in Student Intern Name and Email.');
      return;
    }

    const newUser = saveMipUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password || 'user123',
      role: 'STUDENT_INTERN',
      internId: internId.trim() || 'MIP-2026-099',
      institution: institution.trim(),
      assignedSupervisor: assignedSupervisor.trim(),
      totalHoursLogged: 0,
      startDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
    });

    alert(`Student Intern Account '${newUser.name}' created successfully with Intern ID ${newUser.internId}!`);
    setName('');
    setEmail('');
    setInternId(`MIP-2026-0${Math.floor(Math.random() * 90 + 10)}`);
    setUsers(getMipUsers());
  };

  const internsList = users.filter((u) => u.role === 'STUDENT_INTERN');

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-amber-950 text-white py-4 px-6 sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/admin" className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold text-xs">
              ⬅️ Admin Panel
            </Link>
            <h1 className="font-bold text-base">Student Intern Accounts & Supervisor Allocations</h1>
          </div>
          <span className="text-xs font-bold text-amber-200">Internship User Creator</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-10 space-y-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Intern Account Management</h2>
          <p className="text-slate-500 text-sm mt-1">Register student lawyers, assign Law School registration IDs, and allocate Senior Counsel Supervisors.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Create Form */}
          <div className="lg:col-span-1 bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Register New Student Lawyer</h3>

            <form onSubmit={handleCreateIntern} className="space-y-5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-widest mb-1">Full Student Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Amina Bello"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-widest mb-1">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. amina.bello@nls.edu.ng"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-widest mb-1">Password</label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-widest mb-1">Internship Registration ID</label>
                <input
                  type="text"
                  value={internId}
                  onChange={(e) => setInternId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-widest mb-1">Law School / Faculty Institution</label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-widest mb-1">Assigned Senior Counsel Supervisor</label>
                <select
                  value={assignedSupervisor}
                  onChange={(e) => setAssignedSupervisor(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                >
                  <option value="Barr. Monday Isidahome">Barr. Monday Isidahome (Internship Director)</option>
                  <option value="Barr. Uzoma Okonti">Barr. Uzoma Okonti (Head of Chambers)</option>
                  <option value="Barr. Hannah E.">Barr. Hannah E. (Partner)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl text-xs uppercase tracking-wider transition-all shadow-xl shadow-primary/20"
              >
                ➕ Auto-Create Student Intern Account
              </button>
            </form>
          </div>

          {/* Interns Table */}
          <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Registered Interns ({internsList.length})</h3>

            <div className="space-y-4">
              {internsList.map((intern) => (
                <div key={intern.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{intern.name}</h4>
                    <p className="text-slate-500">ID: <strong className="text-primary">{intern.internId}</strong> | Email: <strong>{intern.email}</strong></p>
                    <p className="text-slate-500 mt-1">Institution: <strong>{intern.institution}</strong></p>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-black text-[10px] uppercase">
                      {intern.status}
                    </span>
                    <p className="text-[11px] text-slate-500">Supervisor: <strong>{intern.assignedSupervisor}</strong></p>
                    <p className="text-[11px] text-slate-500">Logged Hours: <strong>{intern.totalHoursLogged || 0} Hours</strong></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
