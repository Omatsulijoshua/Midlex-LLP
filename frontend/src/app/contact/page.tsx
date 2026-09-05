 "use client";

import dynamic from "next/dynamic";
import MarketingShell from "@/components/marketing/MarketingShell";

const Contact = dynamic(() => import("@/components/Contact/Contact"), { ssr: false });

export default function ContactPage() {
  return (
    <MarketingShell>
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-6">Contact</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Send us a message and we’ll respond as soon as possible. For urgent matters, please call or visit our office.
          </p>
        </div>
      </section>
      <Contact />
    </MarketingShell>
  );
}
