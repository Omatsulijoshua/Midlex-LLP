"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

type ReminderCourtDate = {
  id: string;
  date: string;
  location: string;
  description?: string | null;
  caseId: string;
  case: { title: string };
};

type ReminderPayment = {
  id: string;
  amount: number;
  currency: string;
  dueDate: string | null;
  caseId: string;
  case?: { title?: string };
};

type RemindersResponse = {
  rangeDays: number;
  counts: {
    upcomingCourtDates: number;
    duePayments: number;
    overduePayments: number;
  };
  courtDates: ReminderCourtDate[];
  payments: {
    dueSoon: ReminderPayment[];
    overdue: ReminderPayment[];
  };
};

function caseTitle(value?: { title?: string | null } | null) {
  return value?.title || "Case";
}

function formatDateTime(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

export default function RemindersBar({ days = 7 }: { days?: number }) {
  const [data, setData] = useState<RemindersResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await apiFetch(`/reminders?days=${days}`);
        if (!alive) return;
        setData(res);
        setError(null);
      } catch (e: any) {
        if (!alive) return;
        setData(null);
        setError(e?.message || "Failed to load reminders");
      }
    })();
    return () => {
      alive = false;
    };
  }, [days]);

  const hasAnything = useMemo(() => {
    if (!data) return false;
    return (
      data.counts.upcomingCourtDates + data.counts.duePayments + data.counts.overduePayments > 0
    );
  }, [data]);

  if (error) return null;
  if (!data) return null;
  if (!hasAnything) return null;

  return (
    <div className="mb-6 rounded-[28px] border border-amber-100 bg-amber-50/70 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-700/70">
            Reminders (next {data.rangeDays} days)
          </p>
          <p className="mt-1 text-sm font-bold text-amber-900">
            {data.counts.upcomingCourtDates} court date(s) • {data.counts.duePayments} payment(s) due •{" "}
            {data.counts.overduePayments} overdue
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/schedule"
            className="px-4 py-2 rounded-xl bg-white border border-amber-200 text-amber-900 font-bold text-xs hover:border-amber-300 transition-all"
          >
            View Schedule
          </Link>
          <Link
            href="/dashboard/payments"
            className="px-4 py-2 rounded-xl bg-amber-700 text-white font-bold text-xs hover:bg-amber-800 transition-all"
          >
            View Payments
          </Link>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-white/70 border border-amber-100 p-4">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-widest">Upcoming Court Dates</p>
          <div className="mt-2 space-y-2">
            {data.courtDates.slice(0, 2).map((d) => (
              <Link
                key={d.id}
                href={`/dashboard/cases/${d.caseId}`}
                className="block rounded-xl border border-amber-100 bg-white p-3 hover:border-amber-200 transition-all"
              >
                <p className="text-sm font-bold text-amber-900">{caseTitle(d.case)}</p>
                <p className="text-xs text-amber-800/80 font-medium">{formatDateTime(d.date)} • {d.location}</p>
              </Link>
            ))}
            {data.courtDates.length === 0 && (
              <p className="text-xs text-amber-800/70 font-medium">No upcoming court dates.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white/70 border border-amber-100 p-4">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-widest">Payments Due Soon</p>
          <div className="mt-2 space-y-2">
            {data.payments.dueSoon.slice(0, 2).map((p) => (
              <Link
                key={p.id}
                href="/dashboard/payments"
                className="block rounded-xl border border-amber-100 bg-white p-3 hover:border-amber-200 transition-all"
              >
                <p className="text-sm font-bold text-amber-900">{caseTitle(p.case)}</p>
                <p className="text-xs text-amber-800/80 font-medium">
                  {p.currency} {p.amount.toLocaleString()} • due {p.dueDate ? formatDateTime(p.dueDate) : "—"}
                </p>
              </Link>
            ))}
            {data.payments.dueSoon.length === 0 && (
              <p className="text-xs text-amber-800/70 font-medium">No payments due soon.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white/70 border border-amber-100 p-4">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-widest">Overdue Payments</p>
          <div className="mt-2 space-y-2">
            {data.payments.overdue.slice(0, 2).map((p) => (
              <Link
                key={p.id}
                href="/dashboard/payments"
                className="block rounded-xl border border-amber-100 bg-white p-3 hover:border-amber-200 transition-all"
              >
                <p className="text-sm font-bold text-amber-900">{caseTitle(p.case)}</p>
                <p className="text-xs text-amber-800/80 font-medium">
                  {p.currency} {p.amount.toLocaleString()} • overdue {p.dueDate ? formatDateTime(p.dueDate) : "—"}
                </p>
              </Link>
            ))}
            {data.payments.overdue.length === 0 && (
              <p className="text-xs text-amber-800/70 font-medium">No overdue payments.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

