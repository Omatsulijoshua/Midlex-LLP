"use client";

import React, { useEffect, useState } from 'react';
import { apiFetch, getApiBaseUrl } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { DollarSign, Users, CheckCircle, Clock, FileText, ArrowUpRight, Search, ShieldCheck, Filter, ExternalLink, Plus } from 'lucide-react';
import Link from 'next/link';

interface Allocation {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  client: { id?: string; name: string; email: string; phone?: string };
  lawyer: { id?: string; name: string; email: string; phone?: string };
  totalPaid: number;
  totalPending: number;
  paymentCount: number;
}

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  txRef: string;
  description?: string;
  proofUrl?: string;
  createdAt: string;
  client: { name: string; email: string };
  case: { id: string; title: string; lawyer?: { name: string } };
  account?: { bankName: string; accountNumber: string };
}

export default function AccountantDashboardPage() {
  const { user, token } = useAuth();
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProof, setSelectedProof] = useState<Payment | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const fetchData = async () => {
    try {
      const [allocData, payData] = await Promise.all([
        apiFetch('/cases/allocations'),
        apiFetch('/payments'),
      ]);
      setAllocations(Array.isArray(allocData) ? allocData : []);
      setPayments(Array.isArray(payData) ? payData : []);
    } catch (err) {
      console.error('Error loading accountant data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleVerify = async (paymentId: string, status: 'SUCCESS' | 'FAILED') => {
    setIsVerifying(true);
    try {
      await apiFetch(`/payments/${paymentId}/verify`, {
        method: 'PATCH',
        body: JSON.stringify({ status, note: `Verified by Accountant ${user?.name || ''}` }),
      });
      alert(`Payment marked as ${status}`);
      setSelectedProof(null);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const totalRevenue = payments
    .filter((p) => p.status === 'SUCCESS')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const totalPending = payments
    .filter((p) => p.status === 'PENDING')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const filteredAllocations = allocations.filter((a) => {
    const q = searchTerm.toLowerCase();
    return (
      a.client.name.toLowerCase().includes(q) ||
      a.client.email.toLowerCase().includes(q) ||
      a.lawyer.name.toLowerCase().includes(q) ||
      a.title.toLowerCase().includes(q)
    );
  });

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-16 bg-gray-100 rounded-3xl w-1/3" />
        <div className="grid md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 bg-gray-100 rounded-3xl" />
          ))}
        </div>
        <div className="h-96 bg-gray-100 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-10 text-slate-900">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full uppercase tracking-wider">
              Finance & Accounting Portal
            </span>
            <span className="text-xs font-medium text-gray-400">Chief Accountant View</span>
          </div>
          <h1 className="text-3xl font-extrabold text-primary">Financial & Client Allocation Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/payments"
            className="flex items-center gap-2 px-6 py-3.5 bg-primary text-white font-bold text-sm rounded-2xl shadow-lg hover:bg-primary/90 transition-all"
          >
            <DollarSign size={18} /> Manage Payments & Accounts
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-lg relative overflow-hidden"
        >
          <div className="w-12 h-12 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center mb-4">
            <DollarSign size={24} />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Verified Revenue</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
            💥 ₦{totalRevenue.toLocaleString()}
          </h3>
          <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1">
            <CheckCircle size={14} /> Confirmed Firm Income
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-lg relative overflow-hidden"
        >
          <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mb-4">
            <Clock size={24} />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pending Collections</p>
          <h3 className="text-2xl font-extrabold text-amber-600 mt-1">
            ⏳ ₦{totalPending.toLocaleString()}
          </h3>
          <p className="text-xs text-amber-700 font-bold mt-2">
            {payments.filter((p) => p.status === 'PENDING').length} Pending Transactions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-lg relative overflow-hidden"
        >
          <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mb-4">
            <Users size={24} />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Client-Lawyer Allocations</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
            👥 {allocations.length} Cases
          </h3>
          <p className="text-xs text-blue-600 font-bold mt-2">
            {allocations.filter((a) => a.lawyer.name !== 'Unassigned').length} Active Counsel Assignments
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-lg relative overflow-hidden"
        >
          <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center mb-4">
            <ShieldCheck size={24} />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Successful Transactions</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
            ✅ {payments.filter((p) => p.status === 'SUCCESS').length}
          </h3>
          <p className="text-xs text-purple-600 font-bold mt-2">Audited & Verified</p>
        </motion.div>
      </div>

      {/* Client & Lawyer Allocation Directory */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-primary flex items-center gap-2">
              <Users className="text-secondary" size={24} />
              Client to Lawyer Allocations & Payment Directory
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Audit which lawyer is assigned to each client case and track fees collected.
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search client, lawyer, or case..."
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="pb-4 font-bold">Client Name & Email</th>
                <th className="pb-4 font-bold">Assigned Lawyer</th>
                <th className="pb-4 font-bold">Case Title & Status</th>
                <th className="pb-4 font-bold">Total Paid</th>
                <th className="pb-4 font-bold">Pending Amount</th>
                <th className="pb-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm font-medium">
              {filteredAllocations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400 italic">
                    No client-lawyer allocations matching your search.
                  </td>
                </tr>
              ) : (
                filteredAllocations.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4">
                      <p className="font-bold text-slate-900">{item.client.name}</p>
                      <p className="text-xs text-gray-500">{item.client.email}</p>
                      {item.client.phone && <p className="text-xs text-gray-400 mt-0.5">📞 {item.client.phone}</p>}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          item.lawyer.name !== 'Unassigned' ? 'bg-green-500' : 'bg-amber-400'
                        }`} />
                        <div>
                          <p className="font-bold text-primary">{item.lawyer.name}</p>
                          <p className="text-xs text-gray-500">{item.lawyer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <p className="font-bold text-slate-900 truncate max-w-[200px]">{item.title}</p>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase mt-1 ${
                        item.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 font-extrabold text-green-700">
                      ₦{item.totalPaid.toLocaleString()}
                    </td>
                    <td className="py-4 font-bold text-amber-600">
                      ₦{item.totalPending.toLocaleString()}
                    </td>
                    <td className="py-4 text-right">
                      <Link
                        href={`/dashboard/cases/${item.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-secondary hover:underline"
                      >
                        View Case <ArrowUpRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Client Payments Table */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-primary flex items-center gap-2">
            <DollarSign className="text-secondary" size={24} />
            All Payments & Client Bank Transfer Audit
          </h2>
          <span className="text-xs font-bold text-gray-400">Total: {payments.length} Payments</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="pb-4 font-bold">Client</th>
                <th className="pb-4 font-bold">Case Title</th>
                <th className="pb-4 font-bold">Amount</th>
                <th className="pb-4 font-bold">Reference</th>
                <th className="pb-4 font-bold">Status</th>
                <th className="pb-4 font-bold text-right">Proof / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm font-medium">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-4">
                    <p className="font-bold text-slate-900">{p.client?.name || 'Client'}</p>
                    <p className="text-xs text-gray-500">{p.client?.email}</p>
                  </td>
                  <td className="py-4 font-bold text-primary truncate max-w-[200px]">
                    {p.case?.title || 'Legal Fee'}
                  </td>
                  <td className="py-4 font-extrabold text-slate-900">
                    ₦{Number(p.amount).toLocaleString()}
                  </td>
                  <td className="py-4 text-xs font-mono text-gray-500">
                    {p.txRef}
                  </td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      p.status === 'SUCCESS'
                        ? 'bg-green-100 text-green-700'
                        : p.status === 'FAILED'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700 animate-pulse'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    {p.proofUrl ? (
                      <button
                        onClick={() => setSelectedProof(p)}
                        className="px-3.5 py-1.5 bg-amber-50 text-amber-800 text-xs font-bold rounded-xl border border-amber-200 hover:bg-amber-100 transition-all inline-flex items-center gap-1"
                      >
                        <FileText size={14} /> Audit Proof
                      </button>
                    ) : p.status === 'PENDING' ? (
                      <button
                        onClick={() => handleVerify(p.id, 'SUCCESS')}
                        className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition-all"
                      >
                        Verify Payment
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 font-bold">Verified</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proof Inspection Modal */}
      {selectedProof && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-lg w-full shadow-2xl border border-gray-100 space-y-6">
            <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="text-green-600" /> Audit Payment Receipt
            </h3>

            <div className="space-y-3 text-sm">
              <p><strong>Client:</strong> {selectedProof.client?.name} ({selectedProof.client?.email})</p>
              <p><strong>Case:</strong> {selectedProof.case?.title}</p>
              <p><strong>Amount:</strong> ₦{Number(selectedProof.amount).toLocaleString()}</p>
              <p><strong>Reference:</strong> <code className="text-xs bg-gray-100 p-1 rounded">{selectedProof.txRef}</code></p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Bank Transfer Receipt</p>
              {selectedProof.proofUrl?.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                <img src={selectedProof.proofUrl} alt="Bank Proof" className="max-h-60 mx-auto rounded-xl object-contain" />
              ) : (
                <a
                  href={selectedProof.proofUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl"
                >
                  <ExternalLink size={14} /> Open Document File
                </a>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                disabled={isVerifying}
                onClick={() => handleVerify(selectedProof.id, 'SUCCESS')}
                className="flex-1 py-3 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-all disabled:opacity-50"
              >
                Approve Payment
              </button>
              <button
                disabled={isVerifying}
                onClick={() => handleVerify(selectedProof.id, 'FAILED')}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all disabled:opacity-50"
              >
                Decline
              </button>
              <button
                onClick={() => setSelectedProof(null)}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
