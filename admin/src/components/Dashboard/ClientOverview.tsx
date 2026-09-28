"use client";
import React, { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';
import ClientDepartmentModal, { ClientPracticeDept } from './ClientDepartmentModal';

export default function ClientOverview() {
  const [cases, setCases] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState<ClientPracticeDept | null>(null);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);

  useEffect(() => {
    // Check saved client department
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('midlex_client_dept') as ClientPracticeDept | null;
      if (saved) {
        setSelectedDept(saved);
      } else {
        // Open 2-squares selection modal on client dashboard load
        setIsDeptModalOpen(true);
      }
    }

    const fetchCases = async () => {
      try {
        const data = await apiFetch('/cases/my-cases');
        setCases(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching client cases:', error);
      }
    };
    fetchCases();
  }, []);

  const handleSelectDepartment = (dept: ClientPracticeDept) => {
    setSelectedDept(dept);
    setIsDeptModalOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('midlex_client_dept', dept);
    }
  };

  // Helper to determine Litigation vs General case
  const isLitigationCase = (c: any) => {
    const text = `${c.title || ''} ${c.description || ''} ${c.category || ''} ${c.court || ''}`.toLowerCase();
    return c.category === 'LITIGATION' || text.includes('court') || text.includes('suit') || text.includes('trial') || text.includes('litigation');
  };

  const filteredCases = cases.filter((c) => {
    if (!selectedDept) return true;
    if (selectedDept === 'LITIGATION') return isLitigationCase(c);
    return !isLitigationCase(c);
  });

  return (
    <div className="space-y-8">
      {/* 2 Squares Department Choice Modal */}
      <ClientDepartmentModal
        isOpen={isDeptModalOpen}
        onSelectDepartment={handleSelectDepartment}
        onClose={() => setIsDeptModalOpen(false)}
        currentDept={selectedDept}
      />

      {/* 2 Big Interactive Profile Choice Buttons (Left: Litigation, Right: General) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-slate-500">
            CHOOSE CLIENT MATTER PROFILE (LEFT & RIGHT)
          </span>
          {selectedDept && (
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Active: {selectedDept === 'LITIGATION' ? '⚖️ Litigation Court Matters' : '🏢 General & Property Matters'}
            </span>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* LEFT BUTTON: LITIGATION DISPUTES */}
          <button
            type="button"
            onClick={() => handleSelectDepartment('LITIGATION')}
            className={`p-6 sm:p-8 rounded-[32px] border-2 text-left transition-all relative overflow-hidden group shadow-lg ${
              selectedDept === 'LITIGATION'
                ? 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white border-blue-500 shadow-blue-900/30 scale-[1.01]'
                : 'bg-white text-slate-900 border-slate-200 hover:border-blue-500 hover:shadow-xl'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl mb-4 ${
                selectedDept === 'LITIGATION' ? 'bg-blue-500/20 text-amber-300 border border-blue-400/30' : 'bg-blue-50 text-blue-700 border border-blue-100'
              }`}>
                ⚖️
              </div>
              <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${
                selectedDept === 'LITIGATION' ? 'bg-amber-400 text-slate-950' : 'bg-blue-100 text-blue-800'
              }`}>
                LEFT PROFILE • COURT & TRIALS
              </span>
            </div>

            <h3 className={`text-2xl font-black mb-2 ${selectedDept === 'LITIGATION' ? 'text-white' : 'text-slate-900'}`}>
              Litigation Court Cases
            </h3>
            <p className={`text-xs leading-relaxed ${selectedDept === 'LITIGATION' ? 'text-slate-300' : 'text-slate-500'}`}>
              View your High Court suits, hearing dates, trial timelines, court filings, and chat with your trial advocate team.
            </p>

            <div className={`mt-6 pt-4 border-t flex items-center justify-between text-xs font-bold ${
              selectedDept === 'LITIGATION' ? 'border-white/10 text-amber-300' : 'border-slate-100 text-blue-700'
            }`}>
              <span>View Litigation Matters ➔</span>
              {selectedDept === 'LITIGATION' && <span className="bg-emerald-500 text-slate-950 px-3.5 py-1 rounded-full text-[10px] font-black">ACTIVE VIEW</span>}
            </div>
          </button>

          {/* RIGHT BUTTON: GENERAL & PROPERTY REALTY */}
          <button
            type="button"
            onClick={() => handleSelectDepartment('GENERAL')}
            className={`p-6 sm:p-8 rounded-[32px] border-2 text-left transition-all relative overflow-hidden group shadow-lg ${
              selectedDept === 'GENERAL'
                ? 'bg-gradient-to-br from-amber-950 via-slate-900 to-amber-950 text-white border-amber-500 shadow-amber-900/30 scale-[1.01]'
                : 'bg-white text-slate-900 border-slate-200 hover:border-amber-500 hover:shadow-xl'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl mb-4 ${
                selectedDept === 'GENERAL' ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' : 'bg-amber-50 text-amber-700 border border-amber-100'
              }`}>
                🏢
              </div>
              <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${
                selectedDept === 'GENERAL' ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-900'
              }`}>
                RIGHT PROFILE • REALTY & ADVISORY
              </span>
            </div>

            <h3 className={`text-2xl font-black mb-2 ${selectedDept === 'GENERAL' ? 'text-white' : 'text-slate-900'}`}>
              General & Property Matters
            </h3>
            <p className={`text-xs leading-relaxed ${selectedDept === 'GENERAL' ? 'text-slate-300' : 'text-slate-500'}`}>
              View land title verifications, Certificate of Occupancy searches, Samson Sabbat property conveyancing & corporate advisory.
            </p>

            <div className={`mt-6 pt-4 border-t flex items-center justify-between text-xs font-bold ${
              selectedDept === 'GENERAL' ? 'border-white/10 text-amber-300' : 'border-slate-100 text-amber-700'
            }`}>
              <span>View Property & General Matters ➔</span>
              {selectedDept === 'GENERAL' && <span className="bg-emerald-500 text-slate-950 px-3.5 py-1 rounded-full text-[10px] font-black">ACTIVE VIEW</span>}
            </div>
          </button>
        </div>
      </div>

      {/* Top Client Branch Status Bar */}
      <div className={`p-6 rounded-[28px] text-white shadow-xl flex flex-wrap items-center justify-between gap-4 border transition-all ${
        selectedDept === 'LITIGATION'
          ? 'bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-blue-500/30'
          : 'bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 border-amber-500/30'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-2xl ${
            selectedDept === 'LITIGATION' ? 'bg-blue-600/30 text-amber-300 border border-blue-400/40' : 'bg-amber-600/30 text-amber-400 border border-amber-400/40'
          }`}>
            {selectedDept === 'LITIGATION' ? '⚖️' : '🏢'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-400/30">
                ACTIVE CLIENT WORKSPACE
              </span>
            </div>
            <h3 className="text-xl font-black text-white mt-1">
              {selectedDept === 'LITIGATION' ? 'Litigation Cases & Disputes' : 'General & Property (Realty) Matters'}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {selectedDept === 'LITIGATION'
                ? 'Viewing court litigation suits, hearing dates, and trial advocate briefs.'
                : 'Viewing land title verification, Samson Sabbat property matters, & commercial agreements.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/dashboard/cases/new?category=${selectedDept || 'LITIGATION'}`}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20"
          >
            ➕ Open New {selectedDept === 'LITIGATION' ? 'Litigation' : 'Property / General'} Case
          </Link>
          <button
            onClick={() => setIsDeptModalOpen(true)}
            className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs transition-all border border-white/10"
          >
            🔄 Switch View (2 Squares)
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[40px] border border-gray-100 p-8 sm:p-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-primary">
                  My {selectedDept === 'LITIGATION' ? 'Litigation Cases' : selectedDept === 'GENERAL' ? 'General & Property Cases' : 'Cases'}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Showing {filteredCases.length} active matters
                </p>
              </div>
              <Link
                href={`/dashboard/cases/new?category=${selectedDept || 'LITIGATION'}`}
                className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary/90 transition-all"
              >
                + New Case
              </Link>
            </div>

            <div className="space-y-6">
              {filteredCases.length > 0 ? filteredCases.map((c: any) => (
                <div key={c.id} className="p-8 rounded-3xl bg-[#fafafa] border border-gray-100 hover:border-amber-300 transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-full">
                        {c.category === 'LITIGATION' ? '⚖️ Litigation' : '🏢 Property / General'}
                      </span>
                      <h4 className="text-lg font-bold text-primary">{c.title}</h4>
                    </div>
                    <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full">
                      {c.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed">{c.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400">
                      Lawyer: <strong className="text-primary">{c.lawyer?.name || (c.category === 'GENERAL' || c.category === 'PROPERTY' ? 'Samson Sabbat' : 'Assigned Counsel')}</strong>
                    </span>
                    <Link 
                      href={`/dashboard/cases/${c.id}`}
                      className="px-6 py-2.5 bg-white border border-gray-200 text-primary font-bold rounded-xl text-xs hover:border-secondary hover:text-secondary transition-all shadow-sm"
                    >
                      Open Case
                    </Link>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                  <p className="text-gray-500 font-bold text-sm">
                    No active {selectedDept === 'LITIGATION' ? 'litigation suits' : 'general or property cases'} found.
                  </p>
                  <Link 
                    href={`/dashboard/cases/new?category=${selectedDept || 'LITIGATION'}`}
                    className="mt-4 px-8 py-3.5 bg-secondary text-white font-bold rounded-2xl inline-block text-xs uppercase tracking-wider shadow-lg shadow-secondary/20"
                  >
                    Open New {selectedDept === 'LITIGATION' ? 'Litigation' : 'Property / General'} Case
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-primary p-8 rounded-[40px] text-white">
            <h4 className="text-xl font-bold mb-3">Legal Consultation &amp; Support</h4>
            <p className="text-white/70 text-xs mb-6 leading-relaxed">
              Need immediate advice on court litigation, land title verification, or contract reviews?
            </p>
            <Link 
              href={filteredCases.length > 0 ? `/dashboard/cases/${(filteredCases[0] as any).id}` : `/dashboard/cases/new?category=${selectedDept || 'LITIGATION'}`}
              className="w-full py-4 bg-secondary text-white font-bold rounded-2xl shadow-lg shadow-secondary/20 inline-block text-center text-xs uppercase tracking-wider"
            >
              Chat with Midlex Counsel
            </Link>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-gray-100">
            <h4 className="text-xl font-bold text-primary mb-4">Upcoming Case Dates</h4>
            <div className="space-y-4">
              <p className="text-gray-400 text-xs italic">No upcoming court hearings scheduled.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
