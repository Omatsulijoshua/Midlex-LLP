import type { Metadata } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Midlex Analytics & Law Publishing | Law Reports, Legal Books & Research Analytics',
  description: 'Midlex Law Publishing & Analytics Platform for legal authors, advocates, law reporting, Supreme Court digests, and academic legal journals.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen font-sans selection:bg-amber-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
