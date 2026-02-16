"use client";

// ============================================
// Related Products — grid of similar products
// ============================================

import type { ProductWithTiers } from "@/types";
import ProductCard from "./ProductCard";

export default function RelatedProducts({
  products,
}: {
  products: ProductWithTiers[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border pt-12">
      <h2 className="text-2xl font-bold text-primary mb-6">
        Related Products
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
