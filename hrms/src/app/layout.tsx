import type { Metadata } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Midlex HRMS | Human Resource Management System',
  description: 'Midlex Law Firm Human Resource Management System for Staff, Lawyers, Leave Approvals, Attendance & Payroll',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-slate-100 min-h-screen font-sans selection:bg-amber-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
