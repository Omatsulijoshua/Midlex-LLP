"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

type TargetRole = 'ALL' | 'ADMIN' | 'LAWYER' | 'CLIENT';

interface AccountOption {
  id: string;
  name: string;
  email: string;
  role: TargetRole;
}

const roleLabels: Record<TargetRole, string> = {
  ALL: 'All users',
  ADMIN: 'Admins',
  LAWYER: 'Lawyers',
  CLIENT: 'Clients',
};

export default function NotificationsManagerPage() {
  const { user } = useAuth();
  const [targetRole, setTargetRole] = useState<TargetRole>('ALL');
  const [targetUserId, setTargetUserId] = useState('ALL');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');
  const [accounts, setAccounts] = useState<AccountOption[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [sentCount, setSentCount] = useState<number | null>(null);

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const [admins, lawyers, clients] = await Promise.all([
          apiFetch<any[]>('/users/admins'),
          apiFetch<any[]>('/users/lawyers'),
          apiFetch<any[]>('/users/clients'),
        ]);
        setAccounts([
          ...(Array.isArray(admins) ? admins.map((item) => ({ ...item, role: 'ADMIN' as TargetRole })) : []),
          ...(Array.isArray(lawyers) ? lawyers.map((item) => ({ ...item, role: 'LAWYER' as TargetRole })) : []),
          ...(Array.isArray(clients) ? clients.map((item) => ({ ...item, role: 'CLIENT' as TargetRole })) : []),
        ]);
      } catch (error) {
        console.error('Error loading accounts:', error);
      } finally {
        setIsLoadingAccounts(false);
      }
    };

    if (user?.role === 'ADMIN') void loadAccounts();
  }, [user?.role]);

  const filteredAccounts = useMemo(() => {
    if (targetRole === 'ALL') return accounts;
    return accounts.filter((account) => account.role === targetRole);
  }, [accounts, targetRole]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSending(true);
    setSentCount(null);
    try {
      const result = await apiFetch<any[]>('/notifications', {
        method: 'POST',
        body: JSON.stringify({
          title,
          message,
          link: link || undefined,
          targetRole,
          targetUserId: targetUserId === 'ALL' ? undefined : targetUserId,
        }),
      });
      setSentCount(Array.isArray(result) ? result.length : 0);
      setTitle('');
      setMessage('');
      setLink('');
      setTargetRole('ALL');
      setTargetUserId('ALL');
    } catch (error: any) {
      alert(error?.message || 'Failed to send notification');
    } finally {
      setIsSending(false);
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="rounded-[32px] border border-gray-100 bg-white p-8 text-gray-500">
        You do not have access to this page.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-primary">Notification Manager</h2>
        <p className="mt-2 text-gray-500">
          Send updates to everyone, a role group, or one selected account.
        </p>
      </div>

      {sentCount !== null && (
        <div className="rounded-[28px] border border-green-100 bg-green-50 p-5 text-green-700">
          Notification sent to {sentCount} account{sentCount === 1 ? '' : 's'}.
        </div>
      )}

      <form onSubmit={submit} className="rounded-[36px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-primary">Account Type</label>
            <select
              value={targetRole}
              onChange={(event) => {
                setTargetRole(event.target.value as TargetRole);
                setTargetUserId('ALL');
              }}
              className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 font-bold text-primary outline-none"
            >
              <option value="ALL">All</option>
              <option value="ADMIN">Admin</option>
              <option value="LAWYER">Lawyers</option>
              <option value="CLIENT">Clients</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-primary">Recipient</label>
            <select
              value={targetUserId}
              onChange={(event) => setTargetUserId(event.target.value)}
              disabled={isLoadingAccounts}
              className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 font-bold text-primary outline-none disabled:opacity-60"
            >
              <option value="ALL">{targetRole === 'ALL' ? 'All users' : `All ${roleLabels[targetRole]}`}</option>
              {filteredAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} - {account.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-primary">Title</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-primary">Link (optional)</label>
            <input
              value={link}
              onChange={(event) => setLink(event.target.value)}
              placeholder="/dashboard/payments"
              className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 outline-none"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-bold text-primary">Message</label>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={5}
              className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 outline-none"
              required
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSending}
            className="w-full rounded-2xl bg-primary px-8 py-4 font-bold text-white shadow-xl shadow-primary/20 disabled:opacity-50 sm:w-auto"
          >
            {isSending ? 'Sending...' : 'Send Notification'}
          </button>
        </div>
      </form>
    </div>
  );
}
