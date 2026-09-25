"use client";

import Navbar from "@/components/Navbar";
import MarketingFooter from "@/components/marketing/MarketingFooter";

export default function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      {children}
      <MarketingFooter />
    </main>
  );
}

