import Link from "next/link";
import MarketingShell from "@/components/marketing/MarketingShell";

const posts = [
  {
    slug: "property-due-diligence-checklist",
    title: "Property Due Diligence: A Practical Checklist",
    date: "2026-01-10",
    excerpt: "Key documents and steps to reduce risk before you buy, lease, or invest in property.",
  },
  {
    slug: "company-incorporation-in-nigeria",
    title: "Incorporating a Company in Nigeria: What Founders Should Know",
    date: "2026-02-05",
    excerpt: "From share structure to compliance basics—how to get set up properly and stay compliant.",
  },
  {
    slug: "litigation-vs-adr",
    title: "Litigation vs ADR: Choosing the Right Dispute Strategy",
    date: "2026-03-02",
    excerpt: "A clear comparison of timelines, costs, confidentiality, and enforcement realities.",
  },
];

export default function InsightsPage() {
  return (
    <MarketingShell>
      <section className="py-20 bg-[#fafafa]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-6">Insights</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Practical legal insights to help individuals and businesses make better decisions. (This can later be
            connected to a CMS.)
          </p>

          <div className="mt-12 space-y-6">
            {posts.map((p) => (
              <Link
                key={p.slug}
                href={`/insights/${p.slug}`}
                className="block bg-white border border-gray-100 rounded-3xl p-8 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-xl font-bold text-primary">{p.title}</h2>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{p.date}</span>
                </div>
                <p className="mt-4 text-gray-600 leading-relaxed">{p.excerpt}</p>
                <p className="mt-6 text-sm font-bold text-secondary">Read more →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}

