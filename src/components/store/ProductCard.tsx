"use client";

// ============================================
// ProductCard — editorial product card
// Sharp corners, product-photo filter, minimal info
// ============================================

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ProductWithTiers } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useWishlist } from "@/lib/wishlist";
import AddToCartButton from "./AddToCartButton";
import QuickViewModal from "./QuickViewModal";

export default function ProductCard({
  product,
}: {
  product: ProductWithTiers;
}) {
  const { has, toggle } = useWishlist();
  const [showQuickView, setShowQuickView] = useState(false);
  const isFav = has(product.id);

  return (
    <>
      <div className="group relative flex flex-col border border-border bg-white overflow-hidden card-hover">
        {/* Wishlist heart */}
        <button
          onClick={() => toggle(product.id)}
          className="absolute right-3 top-3 z-10 rounded-full bg-white/90 backdrop-blur-sm p-2 transition-all hover:scale-110"
          aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg
            className={`h-4 w-4 transition ${isFav ? "text-primary fill-primary" : "text-muted-light hover:text-primary"}`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            fill={isFav ? "currentColor" : "none"}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>

        {/* Image */}
        <Link href={`/products/${product.id}`} className="block overflow-hidden">
          <div className="relative aspect-[3/4] bg-surface-alt flex items-center justify-center">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover img-zoom product-photo"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-light">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
              </div>
            )}
            {/* Quick view */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowQuickView(true);
              }}
              className="absolute inset-0 flex items-end justify-center bg-black/0 group-hover:bg-black/5 transition-colors"
            >
              <span className="mb-4 bg-white/95 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-primary opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                Quick View
              </span>
            </button>
          </div>
        </Link>

        {/* Info — editorial minimal */}
        <div className="flex flex-1 flex-col p-4">
          {product.category && (
            <span className="text-[11px] font-medium text-muted uppercase tracking-widest">
              {product.category.name}
            </span>
          )}
          <Link href={`/products/${product.id}`}>
            <h3 className="mt-1 font-semibold text-primary group-hover:text-secondary transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Price — immediately after name */}
          <div className="mt-auto pt-3">
            <span className="text-sm font-semibold text-primary">
              {formatCurrency(product.basePrice)}
            </span>
          </div>

          <AddToCartButton product={product} className="mt-3" />
        </div>
      </div>

      {showQuickView && (
        <QuickViewModal
          product={product}
          onClose={() => setShowQuickView(false)}
        />
      )}
    </>
  );
}
