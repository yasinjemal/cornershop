import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Mens Corner privacy policy — how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-primary">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted">Last updated: February 2026</p>

      <div className="mt-10 space-y-8 text-sm text-text-body leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-primary mb-3">1. Information We Collect</h2>
          <p>When you place an order or create an account, we collect your name, email address, phone number, shipping address, and payment details. We also automatically collect device information, IP address, and browsing behaviour through cookies and similar technologies.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Process and fulfil your orders</li>
            <li>Send order confirmations and shipping updates</li>
            <li>Improve our website, products, and customer service</li>
            <li>Communicate promotional offers (with your consent)</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-3">3. Data Protection (POPIA)</h2>
          <p>We comply with the Protection of Personal Information Act (POPIA) of South Africa. Your personal information is processed lawfully, stored securely, and retained only as long as necessary. You have the right to access, correct, or request deletion of your personal data at any time.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-3">4. Data Sharing</h2>
          <p>We do not sell your personal information. We may share data with trusted third-party service providers (payment processors, shipping companies) solely to fulfil your orders. All partners are contractually bound to protect your information.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-3">5. Cookies</h2>
          <p>We use essential cookies to operate the website (e.g., shopping cart, session management). Analytics cookies help us understand how visitors use our site. You can manage cookie preferences in your browser settings.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-3">6. Security</h2>
          <p>We implement industry-standard security measures including SSL/TLS encryption, secure payment processing, and regular security audits to protect your personal information.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-3">7. Your Rights</h2>
          <p>Under POPIA, you have the right to:</p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>Request access to your personal information</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
            <li>Lodge a complaint with the Information Regulator</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-3">8. Contact Us</h2>
          <p>For any privacy-related enquiries, contact us at <span className="font-medium text-primary">info@menscorner.co.za</span> or write to our offices in Johannesburg, South Africa.</p>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-border">
        <Link href="/" className="text-sm text-secondary hover:text-secondary-hover transition-colors">&larr; Back to Home</Link>
      </div>
    </div>
  );
}
