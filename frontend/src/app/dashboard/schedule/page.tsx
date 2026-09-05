"use client";
import React, { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SchedulePage() {
  const [courtDates, setCourtDates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const cases = await apiFetch('/cases/my-cases');
        const allDates: any[] = [];
        for (const c of cases) {
          const dates = await apiFetch(`/court-dates/case/${c.id}`);
          allDates.push(...dates.map((d: any) => ({ ...d, caseTitle: c.title })));
        }
        setCourtDates(allDates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      } catch (error) {
        console.error('Error fetching schedule:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  if (isLoading) return <div className="animate-pulse space-y-4">
    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-3xl" />)}
  </div>;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-primary">Court Schedule</h2>
      
      <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Upcoming Appearances</p>
          <span className="px-4 py-1 bg-secondary text-white text-xs font-bold rounded-full">
            {courtDates.length} Events
          </span>
        </div>
        
        <div className="divide-y divide-gray-50">
          {courtDates.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 hover:bg-gray-50/50 transition-all group flex flex-col md:flex-row md:items-center gap-8"
            >
              <div className="flex-shrink-0 text-center md:w-24">
                <p className="text-2xl font-bold text-primary">{new Date(event.date).getDate()}</p>
                <p className="text-xs font-bold text-secondary uppercase tracking-widest">
                  {new Date(event.date).toLocaleString('default', { month: 'short' })}
                </p>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-2 h-2 bg-secondary rounded-full" />
                  <h3 className="font-bold text-primary">{event.description}</h3>
                </div>
                <p className="text-sm text-gray-500 font-medium">{event.caseTitle}</p>
              </div>

              <div className="flex flex-col md:items-end gap-2">
                <p className="text-sm font-bold text-primary flex items-center gap-2">
                   <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.location}
                </p>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                  {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <Link 
                href={`/dashboard/cases/${event.caseId}`}
                className="px-6 py-2 bg-white border border-gray-100 text-primary font-bold rounded-xl text-sm hover:border-secondary hover:text-secondary transition-all"
              >
                Case Details
              </Link>
            </motion.div>
          ))}
          {courtDates.length === 0 && (
            <div className="p-20 text-center text-gray-400 italic">
              No court dates scheduled yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
