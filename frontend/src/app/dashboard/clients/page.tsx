"use client";
import React, { useDeferredValue, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import DashboardSearchBar from '@/components/Dashboard/DashboardSearchBar';

import MonthPickerFilter, { getCurrentMonthStr, isItemInMonth } from '@/components/Dashboard/MonthPickerFilter';

export default function ClientsPage() {
  const { user } = useAuth();
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonthStr());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        if (user?.role === 'ADMIN') {
          const data = await apiFetch('/users/clients');
          setClients(data);
        } else {
          // Lawyer view: fetch cases and extract unique clients
          const cases = await apiFetch('/cases/my-cases');
          const uniqueClients = Array.from(
            new Set(cases.filter((c: any) => c.client).map((c: any) => JSON.stringify(c.client)))
          ).map((s: any) => JSON.parse(s));
          setClients(uniqueClients);
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClients();
  }, [user?.role]);

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setTempPassword(null);
    try {
      const created = await apiFetch('/users/clients', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setTempPassword(created.temporaryPassword || null);
      setIsAddModalOpen(false);
      setFormData({ name: '', email: '', phone: '', password: '' });

      // refresh list
      const data = await apiFetch('/users/clients');
      setClients(data);
    } catch (error) {
      console.error('Error adding client:', error);
      alert('Failed to add client');
    }
  };

  if (isLoading) return <div className="animate-pulse space-y-4">
    {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-3xl" />)}
  </div>;

  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const filteredClients = clients.filter((client) => {
    if (!isItemInMonth(client.createdAt, selectedMonth)) {
      return false;
    }
    if (!normalizedQuery) return true;
    return [client.name, client.email, client.phone]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(normalizedQuery));
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold text-primary">
            {user?.role === 'ADMIN' ? 'Clients' : 'My Clients'}
          </h2>
          <p className="text-gray-500 mt-1">
            {user?.role === 'ADMIN'
              ? 'Create and manage client accounts. Create cases from the Cases page.'
              : 'Clients assigned to your cases.'}
          </p>
        </div>
        {user?.role === 'ADMIN' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all"
          >
            Add New Client
          </button>
        )}
      </div>

      <MonthPickerFilter
        selectedMonth={selectedMonth}
        onChange={setSelectedMonth}
        totalCount={filteredClients.length}
        countLabel="registered clients"
      />

      {tempPassword && (
        <div className="bg-white border border-gray-100 rounded-[32px] p-6">
          <p className="font-bold text-primary mb-1">Client created</p>
          <p className="text-gray-600 text-sm">
            Temporary password: <span className="font-mono font-bold">{tempPassword}</span>
          </p>
          <p className="text-xs text-gray-400 mt-2">An email is also sent (in dev it logs in the backend console).</p>
        </div>
      )}

      <DashboardSearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search clients by name, email, or phone"
        count={filteredClients.length}
        countLabel="clients"
      />
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredClients.map((client, i) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all"
          >
            <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xl mb-6">
              {client.name.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">{client.name}</h3>
            <p className="text-gray-500 text-sm mb-8">{client.email}</p>
            
            <div className="flex gap-3">
              <Link 
                href="/dashboard/messages"
                className="flex-1 py-4 bg-primary text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all"
              >
                Messages
              </Link>
              {user?.role === 'ADMIN' && (
                <Link
                  href="/dashboard/cases/new"
                  className="px-5 py-4 bg-secondary text-white font-bold rounded-2xl flex items-center justify-center hover:bg-secondary/90 transition-all"
                  title="Create Case"
                >
                  +
                </Link>
              )}
            </div>
          </motion.div>
        ))}
        {filteredClients.length === 0 && (
          <div className="col-span-full text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
            <p className="text-gray-500">
              {clients.length === 0 ? 'No clients assigned to you yet.' : 'No clients matched your search.'}
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
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl p-10 overflow-hidden"
            >
              <h3 className="text-2xl font-bold text-primary mb-6">Add Client</h3>
              <form onSubmit={handleAddClient} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                    placeholder="Client name"
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
                    placeholder="client@example.com"
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
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Temporary Password (optional)</label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                    placeholder="Leave blank to auto-generate"
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
