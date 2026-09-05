import MarketingShell from "@/components/marketing/MarketingShell";

export default function AboutPage() {
  return (
    <MarketingShell>
      <section className="py-20 bg-[#fafafa]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-6">About Midlex LLP</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Midlex LLP is a Nigerian law firm headquartered in Benin City, providing
            sophisticated legal solutions across Real Estate, Corporate/Commercial, and Litigation.
          </p>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Prudence in Law",
                body: "We combine careful risk assessment with practical, business-aware legal advice.",
              },
              {
                title: "Client-Centric",
                body: "We prioritize clarity, responsiveness, and measurable progress at every stage.",
              },
              {
                title: "Results-Driven",
                body: "We focus on outcomes: prevention where possible, and strong advocacy when disputes arise.",
              },
            ].map((card) => (
              <div key={card.title} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-primary mb-3">{card.title}</h3>
                <p className="text-gray-600 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}

