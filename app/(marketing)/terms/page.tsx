import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Kaidex",
  description: "Terms and conditions for using the Kaidex platform.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-32 lg:py-40">
        <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
          <span className="w-8 h-px bg-border" />
          Legal
        </span>
        <h1 className="text-4xl lg:text-5xl font-display mb-12">Terms of Service</h1>

        <div className="prose prose-invert max-w-none space-y-8 text-foreground/80 leading-relaxed">
          <p className="text-lg text-muted-foreground">Last updated: July 2026</p>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Kaidex platform, you agree to be bound by these Terms of
              Service. If you do not agree, you may not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-4">2. Description of Service</h2>
            <p>
              Kaidex provides an AI agent orchestration platform for distributed computing. The
              service includes agent deployment, monitoring, infrastructure management, and
              related tools accessible through our web portal and API.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-4">3. Account Responsibilities</h2>
            <p>
              You are responsible for maintaining the security of your account credentials and for
              all activities that occur under your account. You must notify us immediately of any
              unauthorized access. Multi-factor authentication is recommended for all accounts and
              required for administrative access.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-4">4. Acceptable Use</h2>
            <p>
              You agree not to use the platform for any unlawful purpose, to attempt unauthorized
              access to our systems, or to interfere with the service&apos;s operation. We reserve the
              right to suspend or terminate accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-4">5. Intellectual Property</h2>
            <p>
              You retain ownership of all data and content you upload to the platform. Kaidex
              retains ownership of the platform, its design, code, and documentation. You are
              granted a limited, non-exclusive license to use the service for its intended purpose.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-4">6. Limitation of Liability</h2>
            <p>
              Kaidex is provided &ldquo;as is&rdquo; without warranty of any kind. We shall not be liable for
              any indirect, incidental, or consequential damages arising from your use of the
              service. Our total liability shall not exceed the fees paid by you in the twelve
              months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-4">7. Contact</h2>
            <p>
              For questions about these terms, contact us at{" "}
              <a href="mailto:legal@kaidex.io" className="text-foreground underline underline-offset-4 hover:text-foreground/80 transition-colors">
                legal@kaidex.io
              </a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
