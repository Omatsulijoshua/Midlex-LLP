import Link from "next/link";
import { notFound } from "next/navigation";
import MarketingShell from "@/components/marketing/MarketingShell";

const practice = {
  "real-estate": {
    title: "Real Estate Law",
    summary:
      "Support across property acquisition, due diligence, documentation, conveyancing, tenancy, and land disputes.",
    bullets: [
      "Property due diligence and title verification",
      "Deeds, conveyancing, and transaction advisory",
      "Tenancy, leases, and property management disputes",
      "Land disputes, injunctions, and recovery of possession",
    ],
    docs: ["Survey plan", "Title documents (C of O / Deed)", "Means of identification", "Transaction history (if any)"],
  },
  corporate: {
    title: "Corporate & Commercial",
    summary:
      "Business formation, compliance, contracts, governance, and ongoing legal advisory for growing organizations.",
    bullets: [
      "Company incorporation and post-incorporation filings",
      "Corporate governance and regulatory compliance",
      "Contract drafting, review, and negotiation",
      "General counsel-style advisory and risk management",
    ],
    docs: ["CAC documents (if existing)", "Contracts/agreements", "Company profile", "Key issues/requirements summary"],
  },
  litigation: {
    title: "Litigation & Dispute Resolution",
    summary: "Strategic dispute management, ADR, and litigation for civil and commercial matters.",
    bullets: [
      "Pre-action advisory and demand letters",
      "Debt recovery and commercial claims",
      "Injunctions and urgent court applications",
      "ADR/mediation and courtroom representation",
    ],
    docs: ["All relevant correspondence", "Evidence/documents", "Chronology of events", "Parties’ details"],
  },
} as const;

type PracticeKey = keyof typeof practice;

export default async function PracticeAreaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const key = slug as PracticeKey;
  const data = practice[key];
  if (!data) notFound();

  return (
    <MarketingShell>
      <section className="py-20 bg-[#fafafa]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/practice-areas" className="text-sm font-bold text-secondary hover:underline">
            ← Back to Practice Areas
          </Link>

          <h1 className="mt-6 text-4xl sm:text-5xl font-bold text-primary">{data.title}</h1>
          <p className="mt-5 text-lg text-gray-600 leading-relaxed">{data.summary}</p>

          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-primary mb-4">What We Handle</h2>
              <ul className="space-y-3 text-gray-700">
                {data.bullets.map((b) => (
                  <li key={b} className="flex gap-3">
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-secondary flex-shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-primary mb-4">Documents to Prepare</h2>
              <ul className="space-y-3 text-gray-700">
                {data.docs.map((d) => (
                  <li key={d} className="flex gap-3">
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href="/book-consultation"
                  className="inline-flex items-center justify-center bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary/95 transition-colors"
                >
                  Book a Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}

