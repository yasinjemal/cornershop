"use client";

// ============================================
// Quick View Modal — product preview overlay
// ============================================

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart";
import { useToast } from "@/lib/toast";
import { formatCurrency, calculateTieredPrice } from "@/lib/utils";
import type { ProductWithTiers } from "@/types";
import StockBadge from "./StockBadge";
import Button from "@/components/ui/Button";

export default function QuickViewModal({
  product,
  onClose,
}: {
  product: ProductWithTiers;
  onClose: () => void;
}) {
  const { addItem } = useCart();
  const { addToast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const unitPrice = calculateTieredPrice(
    product.basePrice,
    quantity,
    product.pricingTiers
  );

  function handleAdd() {
    if (product.stock <= 0) return;
    addItem({
      productId: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      basePrice: product.basePrice,
      quantity,
      pricingTiers: product.pricingTiers,
    });
    addToast(`${product.name} added to cart`, "success");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden animate-[slide-in-up_0.2s_ease-out]">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-white/80 p-1.5 text-muted hover:text-primary transition"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="relative flex items-center justify-center bg-surface-alt p-8 aspect-square overflow-hidden">
            {product.imageUrl ? (
              <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            ) : (
              <svg className="w-20 h-20 text-muted-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col p-6">
            {product.category && (
              <span className="text-xs font-medium text-secondary uppercase tracking-wider">
                {product.category.name}
              </span>
            )}
            <h2 className="mt-1 text-xl font-bold text-primary">
              {product.name}
            </h2>
            <p className="mt-2 text-sm text-muted line-clamp-3">
              {product.description}
            </p>

            <div className="mt-3">
              <StockBadge stock={product.stock} />
            </div>

            {product.sku && (
              <p className="mt-2 text-xs text-muted-light">
                SKU: {product.sku}
              </p>
            )}

            <div className="mt-4">
              <span className="text-2xl font-bold text-primary">
                {formatCurrency(unitPrice)}
              </span>
              <span className="ml-1 text-sm text-muted">each</span>
              {unitPrice < product.basePrice && (
                <span className="ml-2 text-sm text-emerald-600 font-medium">
                  Volume discount applied
                </span>
              )}
            </div>

            {/* Quantity */}
            <div className="mt-4 flex items-center gap-3">
              <label className="text-sm text-muted">Qty:</label>
              <div className="flex items-center rounded-lg border border-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-muted hover:text-primary transition"
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  max={product.stock > 0 ? product.stock : undefined}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-14 bg-transparent py-1 text-center text-sm outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-muted hover:text-primary transition"
                >
                  +
                </button>
              </div>
              <span className="text-sm font-semibold text-secondary">
                {formatCurrency(unitPrice * quantity)}
              </span>
            </div>

            <div className="mt-auto pt-4 space-y-2">
              <Button
                onClick={handleAdd}
                variant="primary"
                size="lg"
                className="w-full"
                disabled={product.stock <= 0}
              >
                {product.stock <= 0
                  ? "Out of Stock"
                  : `Add to Cart — ${formatCurrency(unitPrice * quantity)}`}
              </Button>
              <Link
                href={`/products/${product.id}`}
                className="block text-center text-sm text-secondary hover:underline"
                onClick={onClose}
              >
                View Full Details →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
