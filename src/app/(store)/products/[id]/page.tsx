// ============================================
// Product Detail Page — server-rendered
// SEO: generateMetadata + JSON-LD structured data
// ============================================

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import type { ProductWithTiers } from "@/types";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ProductDetailClient from "./ProductDetailClient";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import RelatedProducts from "@/components/store/RelatedProducts";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    select: { name: true, description: true, imageUrl: true, basePrice: true },
  });

  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.description?.slice(0, 160) || `Shop ${product.name} at Mens Corner.`,
    openGraph: {
      title: product.name,
      description: product.description?.slice(0, 160),
      images: product.imageUrl ? [{ url: product.imageUrl, width: 800, height: 800, alt: product.name }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description?.slice(0, 160),
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      pricingTiers: { orderBy: { minQty: "asc" } },
      category: true,
    },
  });

  if (!product) return notFound();

  // Fetch related products (same category, different product)
  const relatedRaw = product.categoryId
    ? await prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          id: { not: product.id },
        },
        include: {
          pricingTiers: { orderBy: { minQty: "asc" } },
          category: true,
        },
        take: 4,
      })
    : [];

  const serialized: ProductWithTiers = {
    ...product,
    category: product.category
      ? { ...product.category }
      : undefined,
    createdAt: product.createdAt.toISOString(),
    pricingTiers: product.pricingTiers.map((t) => ({ ...t })),
  };

  const related: ProductWithTiers[] = relatedRaw.map((p) => ({
    ...p,
    category: p.category ? { ...p.category } : undefined,
    createdAt: p.createdAt.toISOString(),
    pricingTiers: p.pricingTiers.map((t) => ({ ...t })),
  }));

  const breadcrumbs = [
    { label: "Products", href: "/products" },
    ...(product.category
      ? [{ label: product.category.name, href: `/categories/${product.category.slug}` }]
      : []),
    { label: product.name },
  ];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://menscorner.co.za";

  // JSON-LD structured data for rich search results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.imageUrl || undefined,
    url: `${siteUrl}/products/${product.id}`,
    brand: { "@type": "Brand", name: "Mens Corner" },
    offers: {
      "@type": "Offer",
      price: product.basePrice,
      priceCurrency: "ZAR",
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Mens Corner" },
    },
    ...(product.category && { category: product.category.name }),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs items={breadcrumbs} />

      <div className="grid gap-10 lg:grid-cols-[1fr,0.8fr] mt-6">
        {/* Image Gallery */}
        <div className="space-y-3">
          <div className="relative flex items-center justify-center border border-border bg-surface-alt aspect-square overflow-hidden">
            {product.imageUrl ? (
              <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover product-photo" priority />
            ) : (
              <svg className="w-20 h-20 text-muted-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
            )}
          </div>
          {/* Thumbnail strip */}
          <div className="flex gap-2">
            {(product.images && product.images.length > 0
              ? [product.imageUrl, ...product.images].filter(Boolean)
              : [null, null, null, null]
            ).slice(0, 4).map((img, i) => (
              <div
                key={i}
                className={`relative flex items-center justify-center border bg-surface-alt w-16 h-16 cursor-pointer transition overflow-hidden hover:border-secondary ${i === 0 ? "border-primary" : "border-border"}`}
              >
                {img ? (
                  <Image src={img} alt="" fill sizes="64px" className="object-cover product-photo" />
                ) : (
                  <svg className="w-5 h-5 text-muted-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Info — price immediately after name */}
        <div className="flex flex-col">
          {product.category && (
            <Link
              href={`/categories/${product.category.slug}`}
              className="text-[11px] font-medium text-muted-light uppercase tracking-[0.15em] hover:text-secondary transition-colors link-draw w-fit"
            >
              {product.category.name}
            </Link>
          )}
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-semibold text-primary leading-tight">{product.name}</h1>

          {/* Price — immediately after name (eye path rule) */}
          <p className="mt-3 text-2xl font-semibold text-primary">
            {formatCurrency(product.basePrice)}
          </p>

          <div className="mt-4 h-px bg-border" />

          <p className="mt-4 text-sm text-muted leading-relaxed max-w-lg">
            {product.description}
          </p>

          {/* Add to cart with quantity selector */}
          <ProductDetailClient product={serialized} />

          {/* Delivery & trust — below CTA */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm text-muted">
              <svg className="w-4 h-4 text-muted-light shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              Free delivery over R1,500
            </div>
            <div className="flex items-center gap-3 text-sm text-muted">
              <svg className="w-4 h-4 text-muted-light shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Usually ships in 2–3 business days
            </div>
          </div>

          {/* Stock — typographic, not a colored badge */}
          <div className="mt-4">
            {product.stock <= 0 ? (
              <p className="text-sm text-danger font-medium">Out of stock</p>
            ) : product.stock <= 10 ? (
              <p className="text-sm text-muted">Low stock — {product.stock} remaining</p>
            ) : null}
          </div>

          {/* Wholesale tiers — collapsed by default */}
          {product.pricingTiers.length > 0 && (
            <details className="mt-6 border-t border-border pt-4 group">
              <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-muted hover:text-primary transition-colors">
                <span>Buying in bulk? View wholesale pricing</span>
                <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </summary>
              <div className="mt-4 border border-border overflow-hidden rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-surface-alt">
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-muted uppercase tracking-wider">Quantity</th>
                      <th className="px-4 py-2.5 text-right text-xs font-medium text-muted uppercase tracking-wider">Price/Unit</th>
                      <th className="px-4 py-2.5 text-right text-xs font-medium text-muted uppercase tracking-wider">Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.pricingTiers.map((tier) => {
                      const savings = Math.round(
                        ((product.basePrice - tier.pricePerUnit) / product.basePrice) * 100
                      );
                      return (
                        <tr key={tier.id} className="border-b border-border/50">
                          <td className="px-4 py-2.5 text-primary">{tier.minQty}+ units</td>
                          <td className="px-4 py-2.5 text-right text-primary font-medium">{formatCurrency(tier.pricePerUnit)}</td>
                          <td className="px-4 py-2.5 text-right text-trust font-medium">{savings}% off</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </details>
          )}
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts products={related} />
    </div>
  );
}
