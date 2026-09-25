"use client";
import React, { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

import Link from 'next/link';

export default function ClientOverview() {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const data = await apiFetch('/cases/my-cases');
        setCases(data);
      } catch (error) {
        console.error('Error fetching client cases:', error);
      }
    };
    fetchCases();
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[40px] border border-gray-100 p-10">
            <h3 className="text-2xl font-bold text-primary mb-8">My Cases</h3>
            <div className="space-y-6">
              {cases.length > 0 ? cases.map((c: any) => (
                <div key={c.id} className="p-8 rounded-3xl bg-[#fafafa] border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-bold text-primary">{c.title}</h4>
                    <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full">
                      {c.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-6">{c.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-primary border-2 border-white" />
                      <div className="w-8 h-8 rounded-full bg-secondary border-2 border-white" />
                    </div>
                    <Link 
                      href={`/dashboard/cases/${c.id}`}
                      className="px-6 py-2 bg-white border border-gray-200 text-primary font-bold rounded-xl text-sm hover:border-secondary hover:text-secondary transition-all"
                    >
                      Open Case
                    </Link>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10">
                   <p className="text-gray-500">You don't have any active cases.</p>
                    <Link 
                      href="/dashboard/cases/new"
                      className="mt-4 px-8 py-3 bg-secondary text-white font-bold rounded-2xl inline-block"
                    >
                      Request Legal Help
                    </Link>
                 </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-primary p-8 rounded-[40px] text-white">
            <h4 className="text-xl font-bold mb-4">Quick Support</h4>
            <p className="text-white/60 text-sm mb-8 leading-relaxed">
              Need immediate assistance? Our legal team is available for 
              real-time consultations.
            </p>
            <Link 
              href={cases.length > 0 ? `/dashboard/cases/${(cases[0] as any).id}` : '/dashboard/cases/new'}
              className="w-full py-4 bg-secondary text-white font-bold rounded-2xl shadow-lg shadow-secondary/20 inline-block text-center"
            >
              Chat with Lawyer
            </Link>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-gray-100">
            <h4 className="text-xl font-bold text-primary mb-6">Upcoming Dates</h4>
            <div className="space-y-4">
              <p className="text-gray-500 text-sm italic">No upcoming court dates scheduled.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
