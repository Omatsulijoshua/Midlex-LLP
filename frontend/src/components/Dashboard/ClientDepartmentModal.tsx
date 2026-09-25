"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export type ClientPracticeDept = 'LITIGATION' | 'GENERAL';

interface ClientDepartmentModalProps {
  isOpen: boolean;
  onSelectDepartment: (dept: ClientPracticeDept) => void;
  onClose?: () => void;
  currentDept?: ClientPracticeDept | null;
}

export default function ClientDepartmentModal({
  isOpen,
  onSelectDepartment,
  onClose,
  currentDept,
}: ClientDepartmentModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleOpenNewCase = (dept: ClientPracticeDept) => {
    onSelectDepartment(dept);
    router.push(`/dashboard/cases/new?category=${dept}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="max-w-4xl w-full bg-white rounded-[40px] border border-slate-100 p-8 sm:p-12 shadow-2xl space-y-8 relative"
        >
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl flex items-center justify-center text-sm transition-all"
            >
              ✕
            </button>
          )}

          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <img src="/logo.jpg" alt="Midlex LLP" className="h-14 w-auto object-contain rounded-xl shadow-md border border-slate-100" />
            </div>
            <span className="px-4 py-1.5 bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-widest rounded-full border border-amber-200">
              CLIENT PRACTICE BRANCH SELECTION
            </span>
            <h2 className="text-3xl font-black text-slate-900">
              Choose Case Branch or Open New Matter
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Select whether you want to view &amp; manage your <strong>Litigation Court Cases</strong> or <strong>General / Property (Realty) Matters</strong>.
            </p>
          </div>

          {/* 2 Large Squares (Left & Right) */}
          <div className="grid md:grid-cols-2 gap-8 pt-4">
            {/* LEFT SQUARE: LITIGATION */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              className={`rounded-[32px] p-8 border-2 transition-all flex flex-col justify-between group relative overflow-hidden ${
                currentDept === 'LITIGATION'
                  ? 'bg-gradient-to-br from-slate-900 to-blue-950 text-white border-blue-500 shadow-2xl'
                  : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-slate-700 hover:border-amber-400 shadow-xl'
              }`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
              <div>
                <div className="w-16 h-16 bg-blue-500/20 text-amber-300 rounded-2xl flex items-center justify-center text-3xl font-black mb-6 border border-blue-400/30 group-hover:scale-110 transition-transform">
                  ⚖️
                </div>

                <span className="px-3 py-1 bg-blue-400/20 text-blue-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-400/30">
                  LEFT WING • COURT &amp; TRIALS
                </span>

                <h3 className="text-2xl font-black mt-3 mb-2 text-white group-hover:text-amber-300 transition-colors">
                  Litigation Cases &amp; Disputes
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  View your active High Court suits, trial hearing schedules, court motions, writs of summons, and advocacy counsel.
                </p>

                <ul className="mt-4 space-y-2 text-[11px] text-slate-300 font-medium">
                  <li className="flex items-center gap-2">✔️ High Court &amp; Magistrate Suits</li>
                  <li className="flex items-center gap-2">✔️ Trial Hearing Dates &amp; Orders</li>
                  <li className="flex items-center gap-2">✔️ Trial Counsel Direct Chat</li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 space-y-3">
                <button
                  onClick={() => onSelectDepartment('LITIGATION')}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  📁 View My Litigation Cases
                </button>
                <button
                  onClick={() => handleOpenNewCase('LITIGATION')}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  ➕ Open New Litigation Case
                </button>
              </div>
            </motion.div>

            {/* RIGHT SQUARE: GENERAL & PROPERTY / REALTY */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              className={`rounded-[32px] p-8 border-2 transition-all flex flex-col justify-between group relative overflow-hidden ${
                currentDept === 'GENERAL'
                  ? 'bg-gradient-to-br from-amber-950 to-slate-950 text-white border-amber-500 shadow-2xl'
                  : 'bg-gradient-to-br from-amber-950 via-slate-900 to-amber-950 text-white border-slate-700 hover:border-amber-400 shadow-xl'
              }`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
              <div>
                <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center text-3xl font-black mb-6 border border-amber-400/30 group-hover:scale-110 transition-transform">
                  🏢
                </div>

                <span className="px-3 py-1 bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-400/30">
                  RIGHT WING • REALTY &amp; ADVISORY
                </span>

                <h3 className="text-2xl font-black mt-3 mb-2 text-white group-hover:text-amber-300 transition-colors">
                  General &amp; Property Practice
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  View your land title verification, Certificate of Occupancy searches, Samson Sabbat property auto-allocated matters, contracts, and general advisory.
                </p>

                <ul className="mt-4 space-y-2 text-[11px] text-slate-300 font-medium">
                  <li className="flex items-center gap-2">✔️ Land Title Verification &amp; C of O</li>
                  <li className="flex items-center gap-2">✔️ Samson Sabbat Auto-Allocated Realty</li>
                  <li className="flex items-center gap-2">✔️ Commercial Contracts &amp; Advisory</li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 space-y-3">
                <button
                  onClick={() => onSelectDepartment('GENERAL')}
                  className="w-full py-3.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  📁 View My General &amp; Property Cases
                </button>
                <button
                  onClick={() => handleOpenNewCase('GENERAL')}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  ➕ Open New Property / General Case
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
