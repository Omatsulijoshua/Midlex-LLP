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
  createdAt: string;
}

export default function CasesPage() {
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

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
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedQuery)),
      )
    : cases;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-primary">All Cases</h2>
        {user?.role === 'CLIENT' && (
          <Link 
            href="/dashboard/cases/new"
            className="px-8 py-4 bg-secondary text-white font-bold rounded-2xl shadow-xl shadow-secondary/20 hover:bg-secondary/90 transition-all"
          >
            Create New Case
          </Link>
        )}
      </div>

      <DashboardSearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search cases by title, client, counsel, status, or detail"
        count={filteredCases.length}
        countLabel="cases"
      />

      <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Case Title</th>
                <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Client</th>
                <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Counsel</th>
                <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCases.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/30 transition-all group">
                  <td className="px-8 py-6 font-bold text-primary">{c.title}</td>
                  <td className="px-8 py-6 text-sm text-gray-500">{c.client.name}</td>
                  <td className="px-8 py-6 text-sm text-gray-500">{c.lawyer?.name || 'Unassigned'}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      c.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="px-8 py-6 text-right">
                    <Link 
                      href={`/dashboard/cases/${c.id}`}
                      className="px-4 py-2 bg-gray-100 text-primary font-bold rounded-xl text-sm hover:bg-primary hover:text-white transition-all"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredCases.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-gray-400 italic">
                    No cases matched your search.
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
