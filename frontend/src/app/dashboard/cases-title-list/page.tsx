"use client";
import React, { useDeferredValue, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import DashboardSearchBar from '@/components/Dashboard/DashboardSearchBar';

interface CaseItem {
  id: string;
  title: string;
  description: string;
  status: string;
  client: { name: string; email?: string; phone?: string };
  lawyer?: { name: string };
  litigationTeam?: string;
  timeline?: { status?: string; title?: string }[];
  createdAt: string;
}

import MonthPickerFilter, { getCurrentMonthStr, isItemInMonth } from '@/components/Dashboard/MonthPickerFilter';
import EditCaseModal from '@/components/Dashboard/EditCaseModal';

export default function CasesTitleListPage() {
  const { user } = useAuth();
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [selectedCaseId, setSelectedCaseId] = useState<string | 'ALL'>('ALL');
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonthStr());
  const [editingCase, setEditingCase] = useState<CaseItem | null>(null);

  const fetchCases = async () => {
    try {
      const endpoint = user?.role === 'ADMIN' ? '/cases' : '/cases/my-cases';
      const data = await apiFetch(endpoint);
      setCases(data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [user]);

  if (isLoading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-10 bg-gray-100 rounded-2xl w-64" />
        <div className="h-32 bg-gray-100 rounded-3xl" />
        <div className="h-64 bg-gray-100 rounded-3xl" />
      </div>
    );
  }

  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const filteredCases = cases.filter((c) => {
    if (!isItemInMonth(c.createdAt, selectedMonth)) {
      return false;
    }
    if (selectedCaseId !== 'ALL' && c.id !== selectedCaseId) {
      return false;
    }
    if (normalizedQuery) {
      const searchTargets = [
        c.title,
        c.description,
        c.status,
        c.client?.name,
        c.lawyer?.name,
      ].filter(Boolean);
      return searchTargets.some((val) => String(val).toLowerCase().includes(normalizedQuery));
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-widest">
            REGISTRY CASES LIST
          </span>
          <h2 className="text-3xl font-bold text-primary mt-2">Cases</h2>
          <p className="text-gray-500 text-sm mt-1">
            Select any registered case title below to inspect matter specifications.
          </p>
        </div>
      </div>

      <MonthPickerFilter
        selectedMonth={selectedMonth}
        onChange={setSelectedMonth}
        totalCount={filteredCases.length}
        countLabel="cases in registry"
      />

      {/* Case Titles Sidebar / Selector List */}
      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider flex items-center gap-2">
            <span>📁 REGISTERED CASE TITLES ({cases.length})</span>
          </h3>
          {selectedCaseId !== 'ALL' && (
            <button
              onClick={() => setSelectedCaseId('ALL')}
              className="text-xs text-secondary font-bold hover:underline"
            >
              Show All Case Titles
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2.5 max-h-56 overflow-y-auto p-1">
          <button
            onClick={() => setSelectedCaseId('ALL')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
              selectedCaseId === 'ALL'
                ? 'bg-primary text-white border-primary shadow-md'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            📋 All Cases ({cases.length})
          </button>
          {cases.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedCaseId(item.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border truncate max-w-xs ${
                selectedCaseId === item.id
                  ? 'bg-secondary text-white border-secondary shadow-md'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
              title={item.title}
            >
              ⚖️ {item.title}
            </button>
          ))}
        </div>
      </div>

      <DashboardSearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search case titles, clients, or counsel..."
        count={filteredCases.length}
        countLabel="cases"
      />

      {/* Main Table Matching Exact Screenshot */}
      <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-400">
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest">CASE TITLE</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest">CLIENT</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest">COUNSEL</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest">STATUS</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest">DATE</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCases.map((c) => {
                const formattedDate = c.createdAt
                  ? new Date(c.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'N/A';

                const latestTimeline = c.timeline && c.timeline.length > 0 ? c.timeline[c.timeline.length - 1] : null;
                const realStatus = (latestTimeline?.status || c.status || 'OPEN').toUpperCase();

                return (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-all group">
                    <td className="px-8 py-6">
                      <div className="font-bold text-primary text-base">{c.title}</div>
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-700 font-semibold">
                      {c.client?.name || 'N/A'}
                    </td>
                    <td className="px-8 py-6 text-sm text-primary font-bold">
                      {c.litigationTeam || c.lawyer?.name || '—'}
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`inline-block px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          realStatus === 'OPEN' || realStatus === 'NEW'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : realStatus === 'IN_PROGRESS' || realStatus === 'HEARING'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : realStatus === 'COMPLETED' || realStatus === 'RESOLVED'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-gray-100 text-gray-700 border-gray-200'
                        }`}
                      >
                        {(!realStatus || realStatus === 'OPEN' || realStatus === 'NEW') ? 'CASE MATTER REGISTERED' : String(realStatus).replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-500 font-medium">
                      {formattedDate}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {(user?.role === 'ADMIN' || user?.role === 'LAWYER') && (
                          <button
                            onClick={() => setEditingCase(c)}
                            className="px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold rounded-xl text-xs transition-all flex items-center gap-1"
                            title="Edit Title"
                          >
                            ✏️ Edit Title
                          </button>
                        )}
                        <Link
                          href={`/dashboard/cases/${c.id}`}
                          className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary/90 transition-all shadow-md inline-flex items-center gap-1.5"
                        >
                          <span>View</span>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredCases.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-gray-400 font-medium italic">
                    No cases matched your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <EditCaseModal
        caseItem={editingCase}
        isOpen={Boolean(editingCase)}
        onClose={() => setEditingCase(null)}
        onUpdated={fetchCases}
      />
    </div>
  );
}
