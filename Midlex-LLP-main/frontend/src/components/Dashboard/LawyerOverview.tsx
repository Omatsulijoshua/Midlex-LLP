"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, Calendar, MessageSquare, Users } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface LawyerStats {
  totalClients: number;
  activeCases: number;
  upcomingCourts: number;
  newMessages: number;
}

interface LawyerCase {
  id: string;
  title: string;
  client?: { name: string };
}

export default function LawyerOverview() {
  const [cases, setCases] = useState<LawyerCase[]>([]);
  const [stats, setStats] = useState<LawyerStats>({
    totalClients: 0,
    activeCases: 0,
    upcomingCourts: 0,
    newMessages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const [statsData, casesData] = await Promise.all([
          apiFetch<LawyerStats>('/lawyer/stats'),
          apiFetch<LawyerCase[]>('/lawyer/cases'),
        ]);
        setStats(statsData);
        setCases(Array.isArray(casesData) ? casesData : []);
      } catch (error) {
        console.error('Error fetching lawyer overview:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const statCards = [
    { label: 'Open Cases', value: stats.activeCases, icon: <Briefcase size={22} />, color: 'bg-blue-500' },
    { label: 'View Clients', value: stats.totalClients, icon: <Users size={22} />, color: 'bg-green-500' },
    { label: 'Court Dates', value: stats.upcomingCourts, icon: <Calendar size={22} />, color: 'bg-amber-500' },
    { label: 'New Messages', value: stats.newMessages, icon: <MessageSquare size={22} />, color: 'bg-emerald-500' },
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-[28px] border border-gray-100 p-8 shadow-sm">
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-6`}>
              {stat.icon}
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-primary">{stat.value}</p>
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
        <div className="flex items-center justify-between gap-4 mb-8">
          <h3 className="text-2xl font-bold text-primary">Recent Activity</h3>
          <Link href="/dashboard/cases" className="text-secondary font-bold text-sm">View All</Link>
        </div>

        <div className="space-y-8">
          {cases.length > 0 ? cases.slice(0, 5).map((c) => (
            <div key={c.id} className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-primary font-bold">
                {(c.client?.name || c.title || 'C').charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-primary truncate">New case filed: {c.title}</p>
                <p className="text-sm text-gray-500">By Client {c.client?.name || 'Unknown'}</p>
              </div>
              <Link
                href={`/dashboard/cases/${c.id}`}
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
