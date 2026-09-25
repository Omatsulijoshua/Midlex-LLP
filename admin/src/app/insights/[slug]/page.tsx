import Link from "next/link";
import { notFound } from "next/navigation";
import MarketingShell from "@/components/marketing/MarketingShell";

const posts = {
  "property-due-diligence-checklist": {
    title: "Property Due Diligence: A Practical Checklist",
    date: "2026-01-10",
    body: [
      "Before committing funds, confirm the true status of the property, the seller’s capacity, and the chain of title.",
      "At minimum, verify title documents, survey plan, encumbrances, and whether there are pending disputes.",
      "Where possible, get professional support for searches and documentation to reduce costly mistakes.",
    ],
  },
  "company-incorporation-in-nigeria": {
    title: "Incorporating a Company in Nigeria: What Founders Should Know",
    date: "2026-02-05",
    body: [
      "Choose the right structure early (shareholding, directors, object clause) to avoid future compliance issues.",
      "Set up proper governance and keep statutory filings up to date to protect the business and founders.",
      "Draft clear contracts (founders’ agreement, employment, vendor agreements) to reduce disputes.",
    ],
  },
  "litigation-vs-adr": {
    title: "Litigation vs ADR: Choosing the Right Dispute Strategy",
    date: "2026-03-02",
    body: [
      "ADR can be faster and more confidential, but enforcement and leverage depend on the dispute and counterparties.",
      "Litigation provides court-backed enforcement tools, but timelines and cost can be higher.",
      "A good strategy often blends negotiation, ADR, and litigation readiness based on the facts.",
    ],
  },
} as const;

type PostKey = keyof typeof posts;

export default async function InsightPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const key = slug as PostKey;
  const post = posts[key];
  if (!post) notFound();

  return (
    <MarketingShell>
      <article className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/insights" className="text-sm font-bold text-secondary hover:underline">
            ← Back to Insights
          </Link>
          <h1 className="mt-6 text-4xl font-bold text-primary">{post.title}</h1>
          <p className="mt-2 text-xs font-bold text-gray-400 uppercase tracking-widest">{post.date}</p>

          <div className="mt-10 space-y-5 text-gray-700 leading-relaxed">
            {post.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <div className="mt-14 bg-[#fafafa] border border-gray-100 rounded-3xl p-8">
            <p className="text-sm text-gray-600">
              Disclaimer: This content is for general information only and does not constitute legal advice.
            </p>
          </div>
        </div>
      </article>
    </MarketingShell>
  );
}

