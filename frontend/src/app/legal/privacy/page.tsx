import MarketingShell from "@/components/marketing/MarketingShell";

export default function PrivacyPolicyPage() {
  return (
    <MarketingShell>
      <article className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-primary">Privacy Policy</h1>
          <p className="mt-4 text-gray-600">
            This Privacy Policy explains how Midlex LLP collects, uses, and protects your information when you use this
            website and related services.
          </p>

          <div className="mt-10 space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-primary mb-2">Information We Collect</h2>
              <p>
                We may collect personal information you provide (e.g., name, email, phone number, message content) when
                you submit forms or contact us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-2">How We Use Information</h2>
              <p>
                We use your information to respond to inquiries, provide services, manage your client portal, and improve
                the website experience.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-2">Confidentiality</h2>
              <p>
                Communications may be treated as confidential in line with professional obligations. However, submitting a
                form does not automatically create a solicitor-client relationship.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-2">Data Security</h2>
              <p>
                We take reasonable steps to protect your data. No method of transmission or storage is 100% secure, so we
                cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-2">Contact</h2>
              <p>If you have questions about this policy, please contact Midlex LLP via the Contact page.</p>
            </section>

            <p className="text-xs text-gray-500">Last updated: May 13, 2026</p>
          </div>
        </div>
      </article>
    </MarketingShell>
  );
}

