"use client";
import React, { useDeferredValue, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import DashboardSearchBar from '@/components/Dashboard/DashboardSearchBar';

interface Case {
  id: string;
  title: string;
  description: string;
  status: string;
  client: { name: string };
  lawyer?: { name: string };
  suitNumber?: string;
  court?: string;
  litigationTeam?: string;
  createdAt: string;
}

export default function CasesPage() {
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const isStaff = user?.role === 'ADMIN' || user?.role === 'LAWYER';

  useEffect(() => {
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
    fetchCases();
  }, [user]);

  if (isLoading) return <div className="animate-pulse space-y-4">
    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-3xl" />)}
  </div>;

  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const filteredCases = normalizedQuery
    ? cases.filter((c) =>
        [
          c.title,
          c.description,
          c.status,
          c.client?.name,
          c.lawyer?.name,
          c.suitNumber,
          c.court,
          c.litigationTeam,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedQuery)),
      )
    : cases;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {isStaff && (
            <span className="px-3 py-1 bg-secondary/10 border border-secondary text-secondary rounded-full text-xs font-bold uppercase tracking-widest">
              OFFICIAL LITIGATION DIRECTORY
            </span>
          )}
          <h2 className="text-3xl font-bold text-primary mt-2">
            {isStaff ? 'MIDLEX CASE DIRECTORY' : 'My Cases'}
          </h2>
        </div>
        {user?.role === 'CLIENT' && (
          <Link 
            href="/dashboard/cases/new"
            className="px-8 py-4 bg-secondary text-white font-bold rounded-2xl shadow-xl shadow-secondary/20 hover:bg-secondary/90 transition-all text-center"
          >
            Create New Case
          </Link>
        )}
      </div>

      <DashboardSearchBar
        value={query}
        onChange={setQuery}
        placeholder={isStaff ? "Search directory by Suit No., Title, Court, Counsel..." : "Search cases by title or details..."}
        count={filteredCases.length}
        countLabel="matters"
      />

      <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest">S/N</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest">SUIT NO.</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest">CASE TITLE</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest">COURT</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest">LITIGATION TEAM</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCases.map((c, index) => {
                const cleanId = c.id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
                const shortId = cleanId.length > 4 ? cleanId.slice(0, 4) : (cleanId || '102');
                const suitNo = c.suitNumber || `SUIT NO: HCB/${shortId}/2026`;
                const courtName = c.court || 'High Court of Edo State';
                const teamName = c.litigationTeam || (c.lawyer?.name ? `${c.lawyer.name} (Lead Counsel)` : 'Midlex Senior Advocacy Panel');

                return (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-all group">
                    <td className="px-6 py-5 font-bold text-primary">{index + 1}</td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold tracking-wide">
                        {suitNo}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-bold text-primary text-base">{c.title}</div>
                      <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        c.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-700 font-medium">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-secondary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0v-4m0 4h4" />
                        </svg>
                        <span>{courtName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-primary font-semibold">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>{teamName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link 
                        href={`/dashboard/cases/${c.id}`}
                        className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary/90 transition-all shadow-md shadow-primary/10 inline-flex items-center gap-1"
                      >
                        <span>View Matter</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {filteredCases.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-gray-400 italic">
                    No case directory entries matched your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
