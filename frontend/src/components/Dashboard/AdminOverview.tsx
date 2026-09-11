"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DollarSign, FileText, TrendingUp, Users } from 'lucide-react';
import { apiFetch } from '@/lib/api';

import MonthPickerFilter, { getCurrentMonthStr, isItemInMonth } from './MonthPickerFilter';

interface AdminStats {
  totalCases: number;
  activeLawyers: number;
  pendingPayments: number;
  totalRevenue: number;
}

interface ActivityItem {
  id: string;
  title: string;
  createdAt?: string;
  client?: { name: string };
}

const fallbackStats: AdminStats = {
  totalCases: 0,
  activeLawyers: 0,
  pendingPayments: 0,
  totalRevenue: 0,
};

export default function AdminOverview() {
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonthStr());
  const [allCases, setAllCases] = useState<any[]>([]);
  const [allPayments, setAllPayments] = useState<any[]>([]);
  const [allClients, setAllClients] = useState<any[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const [casesData, paymentsData, clientsData, activityData] = await Promise.all([
          apiFetch('/cases').catch(() => []),
          apiFetch('/payments').catch(() => []),
          apiFetch('/users/clients').catch(() => []),
          apiFetch<ActivityItem[]>('/admin/recent-activity').catch(() => []),
        ]);
        setAllCases(Array.isArray(casesData) ? casesData : []);
        setAllPayments(Array.isArray(paymentsData) ? paymentsData : []);
        setAllClients(Array.isArray(clientsData) ? clientsData : []);
        setActivity(Array.isArray(activityData) ? activityData : []);
      } catch (error) {
        console.error('Error fetching admin overview:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const filteredCases = allCases.filter(c => isItemInMonth(c.createdAt, selectedMonth));
  const filteredPayments = allPayments.filter(p => isItemInMonth(p.createdAt || p.paidAt, selectedMonth));
  const filteredClients = allClients.filter(cl => isItemInMonth(cl.createdAt, selectedMonth));
  const filteredActivity = activity.filter(a => isItemInMonth(a.createdAt, selectedMonth));

  const totalRevenue = filteredPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const pendingPaymentsCount = filteredPayments.filter(p => p.status === 'PENDING').length;

  const statCards = [
    { label: 'Cases (This Month)', value: filteredCases.length, icon: <FileText size={22} />, color: 'bg-blue-500' },
    { label: 'Clients Registered', value: filteredClients.length, icon: <Users size={22} />, color: 'bg-green-500' },
    { label: 'Pending Payments', value: pendingPaymentsCount, icon: <DollarSign size={22} />, color: 'bg-amber-500' },
    { label: 'Monthly Revenue', value: `NGN ${totalRevenue.toLocaleString()}`, icon: <TrendingUp size={22} />, color: 'bg-emerald-500' },
  ];

  const quickActions = [
    { label: 'Open Cases', href: '/dashboard/cases' },
    { label: 'View Client', href: '/dashboard/clients' },
    { label: 'Review Payment', href: '/dashboard/payments' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-44 bg-white rounded-[28px] border border-gray-100" />
          ))}
        </div>
        <div className="h-20 bg-white rounded-[28px] border border-gray-100" />
        <div className="h-80 bg-white rounded-[32px] border border-gray-100" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <MonthPickerFilter
        selectedMonth={selectedMonth}
        onChange={setSelectedMonth}
        totalCount={filteredCases.length}
        countLabel="cases this month"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-[28px] border border-gray-100 p-8 shadow-sm">
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-6`}>
              {stat.icon}
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-primary break-words">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="bg-white border border-gray-100 rounded-2xl px-6 py-5 text-center font-bold text-primary hover:border-secondary hover:text-secondary transition-all"
          >
            {action.label}
          </Link>
        ))}
      </div>

      <section className="bg-white rounded-[32px] border border-gray-100 p-6 sm:p-10 shadow-sm">
        <h3 className="text-2xl font-bold text-primary mb-8">Recent Activity</h3>
        <div className="space-y-8">
          {activity.length > 0 ? activity.slice(0, 5).map((item) => (
            <div key={item.id} className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-primary font-bold">
                {(item.client?.name || item.title || 'C').charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-primary truncate">New case filed: {item.title}</p>
                <p className="text-sm text-gray-500">By Client {item.client?.name || 'Unknown'}</p>
              </div>
              <Link
                href={`/dashboard/cases/${item.id}`}
                className="px-6 py-3 bg-gray-50 rounded-xl text-primary font-bold hover:bg-primary hover:text-white transition-all"
              >
                View
              </Link>
            </div>
          )) : (
            <div className="text-center py-12 text-gray-400 italic">No recent activity.</div>
          )}
        </div>
      </section>
    </div>
  );
}
