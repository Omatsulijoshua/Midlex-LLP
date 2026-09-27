import type { Metadata } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Midlex Realty | Verified Property Sales, Management & Real Estate Conveyancing',
  description: 'Midlex Realty is the premier real estate and property management arm of Midlex Law Firm. Verified land sales, facility management, title search, C of O verification, and conveyancing.',
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
