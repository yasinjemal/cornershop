import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Returns & Refunds",
  description: "Mens Corner returns and refunds policy — hassle-free returns within 14 days.",
};

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-primary">Returns & Refunds</h1>
      <p className="mt-2 text-sm text-muted">Last updated: February 2026</p>

      <div className="mt-10 space-y-8 text-sm text-text-body leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-primary mb-3">1. Return Policy</h2>
          <p>We want you to be completely satisfied with your purchase. If you are not happy with your order, you may return eligible items within <strong>14 days</strong> of delivery for a full refund or exchange, in accordance with the Consumer Protection Act (CPA) of South Africa.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-3">2. Eligibility</h2>
          <p>To be eligible for a return, items must be:</p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>Unworn, unwashed, and in their original condition</li>
            <li>With all original tags and packaging attached</li>
            <li>Returned within 14 days of receiving your order</li>
          </ul>
          <p className="mt-3">The following items cannot be returned:</p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>Items purchased on final sale or clearance</li>
            <li>Intimates, socks, and undergarments (for hygiene reasons)</li>
            <li>Items that have been altered or tailored</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-3">3. How to Initiate a Return</h2>
          <ol className="list-decimal pl-5 space-y-1.5">
            <li>Email us at <span className="font-medium text-primary">info@menscorner.co.za</span> with your order number and reason for return</li>
            <li>We will provide a return authorisation and shipping instructions</li>
            <li>Package the item securely and send it to the provided address</li>
            <li>Once received and inspected, we will process your refund</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-3">4. Refunds</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Refunds are processed within 7–10 business days of receiving the returned item</li>
            <li>Refunds are credited to the original payment method</li>
            <li>Shipping costs are non-refundable unless the return is due to our error</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-3">5. Exchanges</h2>
          <p>We offer exchanges for a different size or colour, subject to availability. To request an exchange, follow the same process as returns. If the replacement item is a different price, we will adjust the balance accordingly.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-3">6. Damaged or Defective Items</h2>
          <p>If you receive a damaged or defective item, please contact us within 48 hours of delivery with photos of the issue. We will arrange a free return and send a replacement or issue a full refund at no additional cost.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-3">7. Contact</h2>
          <p>For any return or refund enquiries, email <span className="font-medium text-primary">info@menscorner.co.za</span> or call us during business hours.</p>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-border">
        <Link href="/" className="text-sm text-secondary hover:text-secondary-hover transition-colors">&larr; Back to Home</Link>
      </div>
    </div>
  );
}
