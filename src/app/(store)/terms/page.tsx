import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Mens Corner terms and conditions of use, purchase, and service.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-primary">Terms & Conditions</h1>
      <p className="mt-2 text-sm text-muted">Last updated: February 2026</p>

      <div className="mt-10 space-y-8 text-sm text-text-body leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-primary mb-3">1. General</h2>
          <p>These terms and conditions govern your use of the Mens Corner website and your purchase of products from us. By using our website or placing an order, you agree to be bound by these terms. Mens Corner is a South African registered business operating from Johannesburg.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-3">2. Products & Pricing</h2>
          <p>All prices are displayed in South African Rand (ZAR) and include VAT where applicable. We reserve the right to change prices without prior notice. Wholesale pricing is available for qualifying business accounts with minimum order quantities as displayed on product pages.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-3">3. Orders & Payment</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Orders are confirmed once payment is successfully processed</li>
            <li>We accept major credit/debit cards and EFT payments</li>
            <li>We reserve the right to refuse or cancel any order at our discretion</li>
            <li>Stock availability is not guaranteed until payment is confirmed</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-3">4. Shipping & Delivery</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Free delivery on orders over R1,500 within South Africa</li>
            <li>Standard delivery takes 3–7 business days depending on location</li>
            <li>Express delivery options may be available at checkout</li>
            <li>Risk of loss passes to you upon delivery</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-3">5. Intellectual Property</h2>
          <p>All content on this website — including text, images, logos, and design — is the property of Mens Corner and is protected by South African copyright law. You may not reproduce, distribute, or use any content without our written permission.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-3">6. Limitation of Liability</h2>
          <p>To the fullest extent permitted by law, Mens Corner shall not be liable for any indirect, incidental, or consequential damages arising from your use of our website or products. Our total liability shall not exceed the amount paid for the relevant order.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-3">7. Governing Law</h2>
          <p>These terms are governed by the laws of the Republic of South Africa. Any disputes shall be subject to the exclusive jurisdiction of the South African courts.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-3">8. Contact</h2>
          <p>For questions regarding these terms, contact us at <span className="font-medium text-primary">info@menscorner.co.za</span>.</p>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-border">
        <Link href="/" className="text-sm text-secondary hover:text-secondary-hover transition-colors">&larr; Back to Home</Link>
      </div>
    </div>
  );
}
