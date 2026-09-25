import Link from "next/link";
import MarketingShell from "@/components/marketing/MarketingShell";

const areas = [
  {
    slug: "real-estate",
    title: "Real Estate Law",
    description: "Due diligence, title documentation, conveyancing, tenancy, and land/property disputes.",
  },
  {
    slug: "corporate",
    title: "Corporate & Commercial",
    description: "Incorporation, compliance, contracts, governance, advisory, and regulatory support.",
  },
  {
    slug: "litigation",
    title: "Litigation & Dispute Resolution",
    description: "Civil/commercial disputes, recovery, injunctions, ADR, and courtroom advocacy.",
  },
];

export default function PracticeAreasPage() {
  return (
    <MarketingShell>
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-6">Practice Areas</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Explore our core practice areas. For each service, we outline how we work, what to prepare, and what to
            expect.
          </p>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {areas.map((a) => (
              <Link
                key={a.slug}
                href={`/practice-areas/${a.slug}`}
                className="group bg-[#fafafa] border border-gray-100 rounded-3xl p-8 hover:bg-white hover:shadow-xl transition-all"
              >
                <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-secondary transition-colors">
                  {a.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{a.description}</p>
                <p className="mt-6 text-sm font-bold text-secondary">Learn more →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}

