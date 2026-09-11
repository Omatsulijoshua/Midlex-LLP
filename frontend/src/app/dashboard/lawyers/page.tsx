"use client";
import React, { useDeferredValue, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardSearchBar from '@/components/Dashboard/DashboardSearchBar';

interface Lawyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  litigationTeam?: string;
}

const defaultTeams = [
  'TEAM ANCHOR',
  'TEAM ALPHA',
  'TITAN LITIGATION',
  'MARITIME PRACTICE GROUP',
  'CORPORATE DISPUTE TEAM',
];

export default function LawyersPage() {
  const { user } = useAuth();
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [teams, setTeams] = useState<string[]>(defaultTeams);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: 'lawyer123',
    litigationTeam: 'TEAM ANCHOR',
  });
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const fetchLawyers = async () => {
    try {
      const data = await apiFetch('/users/lawyers');
      setLawyers(data);
    } catch (error) {
      console.error('Error fetching lawyers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLawyers();
    if (typeof window !== 'undefined') {
      const savedTeams = localStorage.getItem('midlex_teams');
      if (savedTeams) {
        try { setTeams(JSON.parse(savedTeams)); } catch (e) {}
      }
    }
  }, []);

  const handleAddLawyer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/users/lawyers', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      fetchLawyers();
      setIsAddModalOpen(false);
      setFormData({ name: '', email: '', phone: '', password: 'lawyer123', litigationTeam: 'TEAM ANCHOR' });
    } catch (error) {
      console.error('Error adding lawyer:', error);
      alert('Failed to add lawyer');
    }
  };

  const handleUpdateTeam = async (lawyerId: string, newTeam: string) => {
    try {
      await apiFetch(`/users/lawyers/${lawyerId}/team`, {
        method: 'PATCH',
        body: JSON.stringify({ litigationTeam: newTeam }),
      });
      setLawyers((prev) =>
        prev.map((l) => (l.id === lawyerId ? { ...l, litigationTeam: newTeam } : l))
      );
    } catch (error) {
      console.error('Error updating lawyer team:', error);
      alert('Failed to update lawyer team');
    }
  };

  if (user?.role !== 'ADMIN') return <div className="p-10">Access Denied.</div>;

  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const filteredLawyers = normalizedQuery
    ? lawyers.filter((lawyer) =>
        [lawyer.name, lawyer.email, lawyer.phone]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedQuery)),
      )
    : lawyers;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Manage Legal Team</h2>
          <p className="text-gray-500 mt-1">Review and manage lawyers within the firm.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all"
        >
          Add New Lawyer
        </button>
      </div>

      <DashboardSearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search lawyers by name, email, or phone"
        count={filteredLawyers.length}
        countLabel="lawyers"
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredLawyers.map((lawyer) => (
          <motion.div 
            key={lawyer.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary font-bold text-2xl mb-6">
              {lawyer.name.charAt(0)}
            </div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-primary">{lawyer.name}</h3>
              <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold tracking-wide">
                🛡️ {lawyer.litigationTeam || 'TEAM ANCHOR'}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                {lawyer.email}
              </p>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                {lawyer.phone}
              </p>
              <div className="pt-2">
                <label className="block text-[11px] font-bold text-gray-400 mb-1">Litigation Team Assignment:</label>
                <select
                  value={lawyer.litigationTeam || 'TEAM ANCHOR'}
                  onChange={(e) => handleUpdateTeam(lawyer.id, e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800"
                >
                  {teams.map((t) => (
                    <option key={t} value={t}>🛡️ {t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-50 flex gap-4">
              <button className="text-sm font-bold text-primary hover:text-secondary">View Performance</button>
              <button className="text-sm font-bold text-red-500 ml-auto">Revoke Access</button>
            </div>
          </motion.div>
        ))}
        {filteredLawyers.length === 0 && (
          <div className="col-span-full text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
            <p className="text-gray-500">
              {lawyers.length === 0 ? 'No lawyers found.' : 'No lawyers matched your search.'}
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-primary/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl p-10 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-bold text-primary mb-6">Add Firm Lawyer</h3>
              <form onSubmit={handleAddLawyer} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                    placeholder="Barr. Jane Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                    placeholder="jane@midlex.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                    placeholder="+234 ..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Assigned Litigation Team</label>
                  <select
                    value={formData.litigationTeam}
                    onChange={(e) => setFormData({ ...formData, litigationTeam: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all text-sm font-bold text-gray-800"
                    required
                  >
                    {teams.map((t) => (
                      <option key={t} value={t}>🛡️ {t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Account Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-8 py-4 text-gray-400 font-bold hover:text-primary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
