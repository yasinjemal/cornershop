"use client";

// ============================================
// Cart Page — view / edit cart items
// ============================================

import { useCart } from "@/lib/cart";
import { formatCurrency, calculateTieredPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <EmptyState
          title="Your cart is empty"
          description="Browse products and add items to get started."
        />
        <div className="mt-6 text-center">
          <Link href="/products">
            <Button variant="primary">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <Button variant="ghost" size="sm" onClick={clearCart}>
          Clear Cart
        </Button>
      </div>

      {/* Cart items */}
      <div className="space-y-4">
        {items.map((item) => {
          const unitPrice = calculateTieredPrice(
            item.basePrice,
            item.quantity,
            item.pricingTiers
          );
          return (
            <div
              key={item.productId}
              className="flex items-center gap-4 rounded-xl border border-border bg-white p-4 shadow-sm"
            >
              {/* Icon */}
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-surface-alt shrink-0 overflow-hidden">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-6 h-6 text-muted-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                  </svg>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.productId}`}
                  className="font-semibold text-primary hover:text-secondary transition-colors"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-muted">
                  {formatCurrency(unitPrice)} / unit
                  {unitPrice < item.basePrice && (
                    <span className="ml-2 text-emerald-600">
                      (volume discount)
                    </span>
                  )}
                </p>
              </div>

              {/* Quantity */}
              <div className="flex items-center rounded-lg border border-border">
                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity - 1)
                  }
                  className="px-2.5 py-1 text-muted hover:text-primary transition-colors"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm text-foreground">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity + 1)
                  }
                  className="px-2.5 py-1 text-muted hover:text-primary transition-colors"
                >
                  +
                </button>
              </div>

              {/* Line total */}
              <p className="w-24 text-right font-semibold text-primary">
                {formatCurrency(unitPrice * item.quantity)}
              </p>

              {/* Remove */}
              <button
                onClick={() => removeItem(item.productId)}
                className="text-muted-light hover:text-red-500 transition-colors text-lg"
                title="Remove"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-8 rounded-xl border border-border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-muted">Subtotal</span>
          <span className="text-2xl font-bold text-primary">
            {formatCurrency(totalPrice)}
          </span>
        </div>
        <Link href="/checkout">
          <Button size="lg" className="w-full">
            Proceed to Checkout
          </Button>
        </Link>
      </div>
    </div>
  );
}
