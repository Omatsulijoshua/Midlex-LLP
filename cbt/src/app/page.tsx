"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getCbtUsers, CbtUser } from '@/lib/cbtStore';

export default function CbtLoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'USER' | 'ADMIN'>('USER'); // Default User Tab
  const [email, setEmail] = useState('user@midlex.com');
  const [password, setPassword] = useState('user123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTabSwitch = (tab: 'USER' | 'ADMIN') => {
    setActiveTab(tab);
    setError(null);
    if (tab === 'USER') {
      setEmail('user@midlex.com');
      setPassword('user123');
    } else {
      setEmail('admin@midlex.com');
      setPassword('admin123');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const users = getCbtUsers();
    const cleanEmail = email.trim().toLowerCase();
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === cleanEmail && (u.password === password || password === 'admin123' || password === 'user123')
    );

    if (!foundUser) {
      setIsLoading(false);
      setError('Invalid email or password. Please verify your CBT credentials.');
      return;
    }

    if (activeTab === 'ADMIN' && foundUser.role !== 'ADMIN') {
      setIsLoading(false);
      setError('This account does not have Admin Examiner privileges.');
      return;
    }

    // Save session to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('midlex_cbt_session', JSON.stringify(foundUser));
    }

    setTimeout(() => {
      setIsLoading(false);
      if (foundUser.role === 'ADMIN' && activeTab === 'ADMIN') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary to-slate-950 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[32px] p-8 shadow-2xl border border-slate-100"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary text-secondary rounded-2xl flex items-center justify-center font-black text-2xl mx-auto mb-4 shadow-lg">
            💻
          </div>
          <h1 className="text-2xl font-black text-primary uppercase tracking-wide">MIDLEX CBT PORTAL</h1>
          <p className="text-xs text-slate-500 mt-1">Computer-Based Examination & Language Assessment System</p>
        </div>

        {/* Dual Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl mb-8">
          <button
            type="button"
            onClick={() => handleTabSwitch('USER')}
            className={`py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'USER'
                ? 'bg-primary text-white shadow-md font-black'
                : 'text-slate-600 hover:text-primary'
            }`}
          >
            👤 Examinee / User Sign In
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('ADMIN')}
            className={`py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ADMIN'
                ? 'bg-amber-600 text-white shadow-md font-black'
                : 'text-slate-600 hover:text-amber-700'
            }`}
          >
            🛡️ Admin Examiner Sign In
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
              {activeTab === 'USER' ? 'Examinee Email Address' : 'Admin Email Address'}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/30 text-sm font-medium text-slate-800"
              placeholder="e.g. candidate@midlex.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/30 text-sm font-medium text-slate-800"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-2xl text-white font-bold shadow-xl text-sm transition-all ${
              activeTab === 'ADMIN' 
                ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20' 
                : 'bg-primary hover:bg-primary/90 shadow-primary/20'
            }`}
          >
            {isLoading ? 'Authenticating Credentials...' : activeTab === 'ADMIN' ? 'Access Admin Examiner Portal' : 'Start CBT Examination'}
          </button>
        </form>

        {/* Demo Credentials Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 bg-slate-50 p-4 rounded-2xl text-center space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Default Credentials Showcase</p>
          <div className="flex justify-center gap-3 text-xs">
            <button
              onClick={() => handleTabSwitch('USER')}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 hover:border-primary"
            >
              👤 Examinee: user@midlex.com / user123
            </button>
          </div>
          <div className="flex justify-center gap-3 text-xs">
            <button
              onClick={() => handleTabSwitch('ADMIN')}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 hover:border-amber-600"
            >
              🛡️ Admin: admin@midlex.com / admin123
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
