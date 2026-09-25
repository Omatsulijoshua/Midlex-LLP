import MarketingShell from "@/components/marketing/MarketingShell";

export default function DisclaimerPage() {
  return (
    <MarketingShell>
      <article className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-primary">Legal Disclaimer</h1>
          <p className="mt-4 text-gray-600">
            This website provides general information and does not constitute legal advice. Outcomes depend on the facts
            and applicable law, and past results do not guarantee future results.
          </p>

          <div className="mt-10 space-y-6 text-gray-700 leading-relaxed">
            <p>
              Do not send confidential information until a solicitor-client relationship has been confirmed. If you need
              legal assistance, please book a consultation or contact us directly.
            </p>
            <p className="text-xs text-gray-500">Last updated: May 13, 2026</p>
          </div>
        </div>
      </article>
    </MarketingShell>
  );
}

