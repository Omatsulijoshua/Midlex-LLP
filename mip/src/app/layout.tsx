import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Midlex Internship Program (MIP) | Student Lawyers & Chamber Portal',
  description: 'Official Midlex LLP Internship Management System for student lawyers, logbooks, chamber assignments, and performance evaluations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-amber-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
