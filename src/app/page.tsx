import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export default async function Home() {
  const [featuredProducts, categories, productCount] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true },
      include: { category: true },
      take: 4,
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: true } } },
      take: 3,
    }),
    prisma.product.count(),
  ]);

  return (
    <div className="flex flex-col">
      {/* ===== SECTION 1: HERO — Aspiration gap in 2 seconds ===== */}
      <section className="relative overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary-light" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-24 sm:py-32 lg:py-40">
          <div className="max-w-xl">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold text-white tracking-tight leading-[1.08]">
              The Standard{" "}
              <span className="text-secondary">Has Changed.</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-gray-400 leading-relaxed max-w-md">
              Premium men&apos;s suits, formal wear, and accessories — designed in Johannesburg for every occasion that demands your best.
            </p>

            <div className="mt-10">
              <Link
                href="/products"
                className="inline-flex items-center rounded-lg bg-secondary px-8 py-4 text-sm font-semibold text-white uppercase tracking-wider transition-all duration-150 hover:bg-secondary-hover btn-press"
              >
                Shop New Season
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: EDITORIAL STRIP — Prove this is a real brand ===== */}
      {categories.length > 0 && (
        <section className="bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-3">
            {categories.slice(0, 3).map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group relative aspect-[3/4] sm:aspect-[4/5] bg-surface-alt overflow-hidden"
              >
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 z-10" />
                <div className="absolute inset-x-0 bottom-0 z-20 p-6 sm:p-8">
                  <p className="text-xs font-medium text-white/70 uppercase tracking-widest mb-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    {cat._count.products} {cat._count.products === 1 ? "piece" : "pieces"}
                  </p>
                  <h3 className="font-display text-xl sm:text-2xl font-semibold text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-75">
                    {cat.name}
                  </h3>
                </div>
                {/* Placeholder gradient — replace with real category images */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary-light/80 via-primary/60 to-primary/90" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== SECTION 3: CURATED COLLECTION — Best 4 products ===== */}
      {featuredProducts.length > 0 && (
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-[11px] font-medium text-secondary uppercase tracking-[0.15em] mb-3">Collection</p>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-primary leading-tight">Most Popular</h2>
              </div>
              <Link
                href="/products"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary transition-colors link-draw"
              >
                View Collection
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group flex flex-col"
                >
                  <div className="relative aspect-[3/4] bg-surface-alt overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover product-photo img-zoom"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-light">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    {product.category && (
                      <p className="text-[11px] font-medium text-muted-light uppercase tracking-widest mb-1">
                        {product.category.name}
                      </p>
                    )}
                    <h3 className="text-sm font-medium text-primary group-hover:text-secondary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-primary font-semibold">
                      {formatCurrency(product.basePrice)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link href="/products" className="text-sm font-medium text-primary underline underline-offset-4">
                View All
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== SECTION 4: BRAND STORY — Trust without trying ===== */}
      <section className="py-24 sm:py-32 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <div className="max-w-lg">
              <p className="text-[11px] font-medium text-secondary uppercase tracking-[0.15em] mb-3">About Blacksteel</p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-primary leading-tight">
                Premium men&apos;s fashion designed in Johannesburg, built for everywhere.
              </h2>
              <p className="mt-6 text-muted leading-relaxed">
                Every Blacksteel garment is crafted from carefully selected fabrics, designed
                for the modern man who refuses to compromise between style and value.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { text: "Nationwide delivery, free over R1,500", detail: "Fast, reliable shipping across South Africa" },
                { text: "Wholesale pricing from 10 units", detail: "Competitive rates for boutiques and retailers" },
                { text: `${productCount}+ styles in stock`, detail: "Suits, shirts, trousers, shoes, and accessories" },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-4 py-4 border-b border-border last:border-0">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary">{item.text}</p>
                    <p className="mt-0.5 text-sm text-muted">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: WHOLESALE CTA — B2B signal ===== */}
      <section className="relative overflow-hidden bg-primary py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-light to-primary" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-[11px] font-medium text-secondary uppercase tracking-[0.15em] mb-3">For Retailers & Boutiques</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white leading-tight">
              Partner With Blacksteel
            </h2>
            <p className="mt-5 text-base text-gray-400 max-w-lg mx-auto leading-relaxed">
              Stock premium men&apos;s fashion at wholesale pricing. Volume discounts for qualified businesses — the more you order, the more you save.
            </p>

            <div className="mt-10">
              <Link
                href="/products"
                className="inline-flex items-center rounded-lg bg-secondary px-8 py-4 text-sm font-semibold text-white uppercase tracking-wider transition-all duration-150 hover:bg-secondary-hover btn-press"
              >
                Apply for Wholesale Access
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 6: NEWSLETTER ===== */}
      <section className="py-24 sm:py-32 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <p className="text-[11px] font-medium text-secondary uppercase tracking-[0.15em] mb-3">Stay in the loop</p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-primary">First Access to New Drops</h2>
          <p className="mt-3 text-sm text-muted max-w-md mx-auto">New season collections, exclusive restocks, and style guidance — delivered to your inbox.</p>
          <form className="mt-8 flex flex-col sm:flex-row gap-3 max-w-sm mx-auto" action="#">
            <input
              type="email"
              placeholder="Your email — receive 10% off"
              className="flex-1 border border-border bg-white px-4 py-3.5 text-sm text-primary placeholder:text-muted-light focus:outline-none focus:ring-1 focus:ring-secondary/40 focus:border-secondary/40 transition-all rounded-lg"
            />
            <button
              type="submit"
              className="rounded-lg bg-cta px-6 py-3.5 text-sm font-semibold text-white uppercase tracking-wider hover:bg-cta-hover transition-all duration-150 btn-press"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-3 text-[11px] text-muted-light">No spam, unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
}
