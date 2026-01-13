export default function TermsPage() {
  return (
    <div className="py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-foreground-muted mb-8">
          Last updated: January 2025
        </p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-foreground-muted leading-relaxed">
              By accessing or using Videon (&quot;the Service&quot;), you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use the Service. We reserve the right to
              update these terms at any time, and your continued use of the Service constitutes acceptance
              of any changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-foreground-muted leading-relaxed">
              Videon provides an AI-powered platform for creating marketing videos. The Service allows users
              to generate, edit, and export video content through our web application. Features may vary
              depending on your subscription plan.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. User Accounts</h2>
            <p className="text-foreground-muted leading-relaxed">
              You must create an account to use most features of the Service. You are responsible for
              maintaining the confidentiality of your account credentials and for all activities that
              occur under your account. You must provide accurate and complete information when creating
              your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. Acceptable Use</h2>
            <p className="text-foreground-muted leading-relaxed mb-4">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc list-inside text-foreground-muted space-y-2">
              <li>Create content that violates any applicable law or regulation</li>
              <li>Generate misleading, fraudulent, or deceptive content</li>
              <li>Infringe on intellectual property rights of others</li>
              <li>Distribute malware or other harmful content</li>
              <li>Attempt to gain unauthorized access to the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. Intellectual Property</h2>
            <p className="text-foreground-muted leading-relaxed">
              You retain ownership of content you create using the Service. However, you grant Videon a
              license to use, store, and process your content as necessary to provide the Service. The
              Videon platform, including its design, features, and technology, remains the property of
              Videon.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">6. Payment and Billing</h2>
            <p className="text-foreground-muted leading-relaxed">
              Paid subscriptions are billed in advance on a monthly or annual basis. You authorize us to
              charge your payment method for all fees incurred. Refunds are provided in accordance with
              our refund policy. Prices may change with 30 days notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">7. Termination</h2>
            <p className="text-foreground-muted leading-relaxed">
              You may cancel your account at any time. We may suspend or terminate your account if you
              violate these terms. Upon termination, your right to use the Service will immediately cease,
              but provisions that should survive termination will remain in effect.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p className="text-foreground-muted leading-relaxed">
              The Service is provided &quot;as is&quot; without warranties of any kind. Videon shall not be liable
              for any indirect, incidental, special, or consequential damages arising from your use of
              the Service. Our total liability shall not exceed the amount you paid for the Service in
              the past 12 months.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">9. Contact Information</h2>
            <p className="text-foreground-muted leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at
              legal@videon.ai.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
