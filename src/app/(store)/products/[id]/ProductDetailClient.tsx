"use client";

// ============================================
// Product Detail — client-side add-to-cart with quantity
// Sticky mobile CTA bar, price in button
// ============================================

import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart";
import { useToast } from "@/lib/toast";
import { useWishlist } from "@/lib/wishlist";
import { calculateTieredPrice, formatCurrency } from "@/lib/utils";
import type { ProductWithTiers } from "@/types";

export default function ProductDetailClient({
  product,
}: {
  product: ProductWithTiers;
}) {
  const { addItem } = useCart();
  const { addToast } = useToast();
  const { has, toggle } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showSticky, setShowSticky] = useState(false);

  const isFav = has(product.id);
  const outOfStock = product.stock <= 0;

  const unitPrice = calculateTieredPrice(
    product.basePrice,
    quantity,
    product.pricingTiers
  );
  const totalPrice = unitPrice * quantity;

  // Show sticky CTA when main button scrolls out of view (mobile)
  useEffect(() => {
    const main = document.getElementById("main-add-to-cart");
    if (!main) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(main);
    return () => observer.disconnect();
  }, []);

  function handleAdd() {
    if (outOfStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      basePrice: product.basePrice,
      quantity,
      pricingTiers: product.pricingTiers,
    });
    addToast(`${quantity}x ${product.name} added to cart`, "success");
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <>
      <div className="mt-6 space-y-4 border-t border-border pt-6">
        {/* Quantity selector */}
        <div className="flex items-center gap-3">
          <label className="text-sm text-muted">Quantity</label>
          <div className="flex items-center border border-border rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center text-muted hover:text-primary transition-colors"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-14 bg-transparent py-2 text-center text-primary text-sm font-medium outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 flex items-center justify-center text-muted hover:text-primary transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Dynamic price preview — only when qty > 1 */}
        {quantity > 1 && (
          <div className="rounded-lg bg-surface-alt p-4 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted">
                {quantity} × {formatCurrency(unitPrice)}
              </span>
              <span className="text-primary font-semibold">
                {formatCurrency(totalPrice)}
              </span>
            </div>
            {unitPrice < product.basePrice && (
              <p className="text-xs text-trust pt-1">
                Saving {formatCurrency((product.basePrice - unitPrice) * quantity)} with volume pricing
              </p>
            )}
          </div>
        )}

        {/* Main CTA — price in button */}
        <button
          id="main-add-to-cart"
          onClick={handleAdd}
          disabled={outOfStock}
          className={`w-full flex items-center justify-center gap-2 rounded-lg py-4 text-sm font-semibold tracking-wide transition-all duration-150 btn-press disabled:opacity-50 disabled:pointer-events-none ${
            outOfStock
              ? "bg-surface-alt text-muted border border-border"
              : added
                ? "bg-trust text-white"
                : "bg-cta text-white hover:bg-cta-hover"
          }`}
        >
          {outOfStock
            ? "Out of Stock"
            : added
              ? "Added to Cart"
              : `Add to Cart — ${formatCurrency(totalPrice)}`}
        </button>

        {/* Wishlist button */}
        <button
          onClick={() => {
            toggle(product.id);
            addToast(
              isFav ? "Removed from wishlist" : "Added to wishlist",
              isFav ? "info" : "success"
            );
          }}
          className={`w-full flex items-center justify-center gap-2 rounded-lg border py-3 text-sm font-medium transition ${
            isFav
              ? "border-primary/20 bg-surface-alt text-primary"
              : "border-border text-muted hover:border-border-hover hover:text-primary"
          }`}
        >
          <svg
            className={`h-4 w-4 ${isFav ? "fill-primary text-primary" : ""}`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            fill={isFav ? "currentColor" : "none"}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          {isFav ? "In Wishlist" : "Add to Wishlist"}
        </button>
      </div>

      {/* Sticky mobile CTA */}
      {showSticky && !outOfStock && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-border px-4 py-3 lg:hidden animate-slide-in-up">
          <div className="flex items-center gap-3 max-w-2xl mx-auto">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-primary truncate">{product.name}</p>
            </div>
            <button
              onClick={handleAdd}
              className={`shrink-0 rounded-lg px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-150 btn-press ${
                added
                  ? "bg-trust text-white"
                  : "bg-cta text-white hover:bg-cta-hover"
              }`}
            >
              {added ? "Added" : `${formatCurrency(totalPrice)} — Add`}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
