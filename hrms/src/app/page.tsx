"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function HRMSLoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'HR_ADMIN' | 'STAFF'>('HR_ADMIN');
  const [email, setEmail] = useState('hr@midlex.com');
  const [password, setPassword] = useState('admin123');
  const [staffName, setStaffName] = useState('Samson Sabbat');
  const [department, setDepartment] = useState('LITIGATION');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      const userObj = {
        role,
        email: email || (role === 'HR_ADMIN' ? 'hr@midlex.com' : 'samson@midlex.com'),
        name: role === 'HR_ADMIN' ? 'Midlex HR Director' : staffName || 'Samson Sabbat',
        department: role === 'HR_ADMIN' ? 'HUMAN_RESOURCES' : department,
      };
      localStorage.setItem('midlex_hrms_user', JSON.stringify(userObj));
      router.push('/dashboard');
    }
  };

  const setQuickRole = (targetRole: 'HR_ADMIN' | 'STAFF') => {
    setRole(targetRole);
    if (targetRole === 'HR_ADMIN') {
      setEmail('hr@midlex.com');
      setPassword('admin123');
    } else {
      setEmail('samson@midlex.com');
      setPassword('staff123');
      setStaffName('Samson Sabbat');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Background Glow effects */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[300px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 mb-4 shadow-inner">
            <Image
              src="/logo.jpg"
              alt="Midlex Logo"
              width={160}
              height={55}
              className="h-12 w-auto object-contain mx-auto"
            />
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black tracking-widest uppercase rounded-full">
              HUMAN RESOURCE MANAGEMENT SYSTEM
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Midlex HRMS Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Staff Directory, Leave Approvals, Attendance Clocking &amp; Payroll Management
          </p>
        </div>

        {/* 2 Square Portal Switcher */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button
            type="button"
            onClick={() => setQuickRole('HR_ADMIN')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              role === 'HR_ADMIN'
                ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10'
                : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600'
            }`}
          >
            <div className="text-xl mb-1">👑</div>
            <div className="font-black text-sm text-white">HR Admin</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Approve leaves, staff &amp; payroll</div>
          </button>

          <button
            type="button"
            onClick={() => setQuickRole('STAFF')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              role === 'STAFF'
                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600'
            }`}
          >
            <div className="text-xl mb-1">⚖️</div>
            <div className="font-black text-sm text-white">Staff / Lawyer</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Clock attendance &amp; apply leave</div>
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Work Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-all"
              placeholder="e.g. hr@midlex.com or samson@midlex.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-all"
              placeholder="••••••••"
            />
          </div>

          {role === 'STAFF' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-all"
                  placeholder="Staff Name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-all"
                >
                  <option value="LITIGATION">Litigation Department</option>
                  <option value="GENERAL">General / Property</option>
                  <option value="FINANCE">Finance &amp; Accounts</option>
                  <option value="ADMIN">Administrative Staff</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-sm uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 mt-6"
          >
            Access {role === 'HR_ADMIN' ? 'HR Management Dashboard' : 'Staff Self-Service Dashboard'} →
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Midlex Legal Practice — Official HR Management System</p>
        </div>
      </div>
    </div>
  );
}
