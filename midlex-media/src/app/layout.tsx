import type { Metadata } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Midlex Media | Legal Content Creation, Social Media & Live Streaming',
  description: 'Midlex Media is the premier legal media agency specializing in law content creation, live streaming for legal events, podcasts, and digital PR. Headed by Daniel Uyi.',
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
