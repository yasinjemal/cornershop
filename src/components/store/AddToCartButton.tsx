"use client";

// ============================================
// AddToCartButton — adds product to cart
// ============================================

import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { ProductWithTiers } from "@/types";

export default function AddToCartButton({
  product,
  quantity: defaultQty,
  className = "",
}: {
  product: ProductWithTiers;
  quantity?: number;
  className?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const outOfStock = product.stock !== undefined && product.stock !== null && product.stock <= 0;

  function handleAdd() {
    if (outOfStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      basePrice: product.basePrice,
      quantity: defaultQty || 1,
      pricingTiers: product.pricingTiers,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleAdd}
      disabled={outOfStock}
      className={`w-full inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold tracking-wide py-3 transition-all duration-150 btn-press disabled:opacity-50 disabled:pointer-events-none ${
        outOfStock
          ? "bg-surface-alt text-muted border border-border"
          : added
            ? "bg-trust text-white"
            : "bg-cta text-white hover:bg-cta-hover"
      } ${className}`}
    >
      {outOfStock ? "Out of Stock" : added ? "✓ Added" : "Add to Cart"}
    </button>
  );
}
