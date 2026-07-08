import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Kaidex",
  description: "How Kaidex collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-32 lg:py-40">
        <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
          <span className="w-8 h-px bg-border" />
          Legal
        </span>
        <h1 className="text-4xl lg:text-5xl font-display mb-12">Privacy Policy</h1>

        <div className="prose prose-invert max-w-none space-y-8 text-foreground/80 leading-relaxed">
          <p className="text-lg text-muted-foreground">Last updated: July 2026</p>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-4">1. Information We Collect</h2>
            <p>
              We collect information you provide directly, such as your name, email address, and
              company details when you create an account or contact us. We also collect usage data
              including pages visited, features used, and performance metrics to improve our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-4">2. How We Use Your Information</h2>
            <p>
              Your information is used to provide and maintain the Kaidex platform, authenticate
              your identity, process transactions, send service-related communications, and improve
              our products. We never sell your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-4">3. Data Security</h2>
            <p>
              We implement industry-standard security measures including encryption at rest and in
              transit, role-based access controls, and regular security audits. All data is stored
              in SOC 2 compliant infrastructure with automated encrypted backups.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-4">4. Data Retention</h2>
            <p>
              We retain your data for as long as your account is active or as needed to provide
              services. You may request deletion of your data at any time by contacting our
              support team.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-4">5. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal information. You may
              also request a portable copy of your data or opt out of non-essential communications.
              Contact us at privacy@kaidex.io to exercise these rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-4">6. Contact</h2>
            <p>
              For privacy-related inquiries, reach us at{" "}
              <a href="mailto:privacy@kaidex.io" className="text-foreground underline underline-offset-4 hover:text-foreground/80 transition-colors">
                privacy@kaidex.io
              </a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
