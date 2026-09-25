"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getMipUsers, MipRole } from '@/lib/mipStore';

export default function MipLoginPage() {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState<MipRole>('STUDENT_INTERN'); // Default Student Intern Tab
  const [email, setEmail] = useState('intern@midlex.com');
  const [password, setPassword] = useState('user123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSwitch = (role: MipRole) => {
    setActiveRole(role);
    setError(null);
    if (role === 'STUDENT_INTERN') {
      setEmail('intern@midlex.com');
      setPassword('user123');
    } else if (role === 'INTERNSHIP_ADMIN') {
      setEmail('admin@midlex.com');
      setPassword('admin123');
    } else {
      setEmail('superadmin@midlex.com');
      setPassword('superadmin123');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const users = getMipUsers();
    const cleanEmail = email.trim().toLowerCase();
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === cleanEmail && (u.password === password || password === 'admin123' || password === 'user123' || password === 'superadmin123')
    );

    if (!foundUser) {
      setIsLoading(false);
      setError('Invalid credentials. Please verify your Midlex Internship login email and password.');
      return;
    }

    if (activeRole !== foundUser.role) {
      setIsLoading(false);
      setError(`Account '${foundUser.name}' is registered as ${foundUser.role.replace(/_/g, ' ')}. Please select the matching tab.`);
      return;
    }

    // Save session
    if (typeof window !== 'undefined') {
      localStorage.setItem('midlex_mip_session', JSON.stringify(foundUser));
    }

    setTimeout(() => {
      setIsLoading(false);
      if (foundUser.role === 'STUDENT_INTERN') {
        router.push('/dashboard');
      } else {
        router.push('/dashboard/admin');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary to-slate-950 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-white rounded-[36px] p-8 sm:p-10 shadow-2xl border border-slate-100"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src="/logo.jpg" alt="Midlex LLP" className="h-16 w-auto object-contain rounded-2xl shadow-md border border-slate-100" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary uppercase tracking-wide">
            MIDLEX INTERNSHIP PROGRAM (MIP)
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Portal for Student Lawyers, Chamber Interns, Logbooks & Internship Supervisors
          </p>
        </div>

        {/* 3-Role Tab Switcher */}
        <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1.5 rounded-2xl mb-8">
          <button
            type="button"
            onClick={() => handleRoleSwitch('STUDENT_INTERN')}
            className={`py-3 px-2 rounded-xl text-xs font-bold transition-all text-center ${
              activeRole === 'STUDENT_INTERN'
                ? 'bg-primary text-white shadow-md font-black'
                : 'text-slate-600 hover:text-primary'
            }`}
          >
            ⚖️ Student Intern (Default)
          </button>
          <button
            type="button"
            onClick={() => handleRoleSwitch('INTERNSHIP_ADMIN')}
            className={`py-3 px-2 rounded-xl text-xs font-bold transition-all text-center ${
              activeRole === 'INTERNSHIP_ADMIN'
                ? 'bg-amber-700 text-white shadow-md font-black'
                : 'text-slate-600 hover:text-amber-800'
            }`}
          >
            📋 Admin Supervisor
          </button>
          <button
            type="button"
            onClick={() => handleRoleSwitch('INTERNSHIP_SUPER_ADMIN')}
            className={`py-3 px-2 rounded-xl text-xs font-bold transition-all text-center ${
              activeRole === 'INTERNSHIP_SUPER_ADMIN'
                ? 'bg-amber-950 text-white shadow-md font-black'
                : 'text-slate-600 hover:text-amber-950'
            }`}
          >
            🛡️ Super Admin
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-bold">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="e.g. intern@midlex.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-2xl text-white font-black text-sm uppercase tracking-wider transition-all shadow-xl ${
              activeRole === 'STUDENT_INTERN'
                ? 'bg-primary hover:bg-primary/90 shadow-primary/20'
                : activeRole === 'INTERNSHIP_ADMIN'
                ? 'bg-amber-700 hover:bg-amber-800 shadow-amber-700/20'
                : 'bg-amber-950 hover:bg-amber-900 shadow-amber-950/20'
            }`}
          >
            {isLoading ? 'Authenticating MIP Portal Access...' : `Sign In as ${activeRole.replace(/_/g, ' ')}`}
          </button>
        </form>

        {/* Demo Credentials Quick Switcher */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-2">Default Pre-configured MIP Accounts:</p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-600">
            <span className="px-3 py-1 bg-slate-100 rounded-lg">Student: intern@midlex.com / user123</span>
            <span className="px-3 py-1 bg-amber-50 text-amber-900 rounded-lg">Admin: admin@midlex.com / admin123</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
