"use client";

// ============================================
// Wishlist Page — view favorited products
// ============================================

import { useWishlist } from "@/lib/wishlist";
import { useEffect, useState } from "react";
import type { ProductWithTiers } from "@/types";
import ProductCard from "@/components/store/ProductCard";
import EmptyState from "@/components/ui/EmptyState";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function WishlistPage() {
  const { items: wishlistIds, count } = useWishlist();
  const [products, setProducts] = useState<ProductWithTiers[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlistIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    async function fetchProducts() {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) {
        const filtered = data.data.filter((p: ProductWithTiers) =>
          wishlistIds.includes(p.id)
        );
        setProducts(filtered);
      }
      setLoading(false);
    }
    fetchProducts();
  }, [wishlistIds]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <Breadcrumbs items={[{ label: "Wishlist" }]} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">My Wishlist</h1>
        <p className="mt-1 text-muted">
          {count} {count === 1 ? "item" : "items"} saved
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-secondary" />
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          title="Your wishlist is empty"
          description="Browse products and tap the heart icon to save your favorites."
                  />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
