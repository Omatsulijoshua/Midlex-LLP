import MarketingShell from "@/components/marketing/MarketingShell";

export default function TermsPage() {
  return (
    <MarketingShell>
      <article className="py-20 bg-[#fafafa]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-primary">Terms of Use</h1>
          <p className="mt-4 text-gray-600">
            By using this website, you agree to these Terms of Use. If you do not agree, please do not use the site.
          </p>

          <div className="mt-10 space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-primary mb-2">No Legal Advice</h2>
              <p>
                Information on this website is provided for general informational purposes only and does not constitute
                legal advice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-2">No Solicitor-Client Relationship</h2>
              <p>
                Contacting us or submitting a form does not create a solicitor-client relationship unless and until a
                formal engagement is confirmed.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-2">Acceptable Use</h2>
              <p>You agree not to misuse the website, attempt unauthorized access, or disrupt services.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-2">Intellectual Property</h2>
              <p>
                Website content is owned by Midlex LLP or its licensors and may not be reproduced without permission,
                except where allowed by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-2">Changes</h2>
              <p>We may update these terms from time to time by posting an updated version on this page.</p>
            </section>

            <p className="text-xs text-gray-500">Last updated: May 13, 2026</p>
          </div>
        </div>
      </article>
    </MarketingShell>
  );
}

