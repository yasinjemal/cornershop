"use client";

// ============================================
// Order Tracking Page — look up order by ID
// ============================================

import { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Badge, { statusBadgeVariant } from "@/components/ui/Badge";
import type { OrderWithDetails } from "@/types";

const StepIcons: Record<string, React.ReactNode> = {
  PENDING: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
    </svg>
  ),
  CONFIRMED: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  PROCESSING: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m-2.01 17.334-.364-1.43M13.87 3.52l-.364-1.43M8.413 18.876l-.94-1.115m9.056-11.522-.94-1.115" />
    </svg>
  ),
  SHIPPED: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-1.5l-1.842-4.606A1.125 1.125 0 0 0 16.313 9H14.25m0 0V5.625c0-.621-.504-1.125-1.125-1.125H5.25c-.621 0-1.125.504-1.125 1.125v12.001" />
    </svg>
  ),
  DELIVERED: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
    </svg>
  ),
};

const TRACK_STEPS = [
  { key: "PENDING", label: "Order Placed" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "PROCESSING", label: "Processing" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
];

const STATUS_INDEX: Record<string, number> = {
  PENDING: 0,
  CONFIRMED: 1,
  PROCESSING: 2,
  SHIPPED: 3,
  DELIVERED: 4,
  CANCELLED: -1,
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/${orderId.trim()}`);
      const json = await res.json();

      if (!json.success) {
        setError("Order not found. Please check the order ID and try again.");
        return;
      }

      setOrder(json.data);
    } catch {
      setError("Failed to look up order. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const currentStep = order ? STATUS_INDEX[order.status] ?? -1 : -1;
  const isCancelled = order?.status === "CANCELLED";

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
      <Breadcrumbs items={[{ label: "Track Order" }]} />

      <div className="mt-6">
        <h1 className="text-3xl font-bold text-primary">Track Your Order</h1>
        <p className="mt-1 text-muted">
          Enter your order ID to check the current status and delivery progress.
        </p>
      </div>

      {/* Search form */}
      <form onSubmit={handleTrack} className="mt-6 flex gap-3">
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="e.g. cmlixvvw..."
          className="flex-1 rounded-lg border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
        />
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Searching..." : "Track"}
        </Button>
      </form>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Order result */}
      {order && (
        <div className="mt-8 space-y-6 animate-[slide-in-up_0.3s_ease-out]">
          {/* Order header */}
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs text-muted-light uppercase tracking-wider">
                  Order ID
                </p>
                <p className="mt-0.5 text-sm font-mono text-primary">
                  {order.id}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-light uppercase tracking-wider">
                  Date
                </p>
                <p className="mt-0.5 text-sm text-primary">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-light uppercase tracking-wider">
                  Total
                </p>
                <p className="mt-0.5 text-sm font-semibold text-primary">
                  {formatCurrency(order.totalAmount)}
                </p>
              </div>
              <Badge variant={statusBadgeVariant(order.status)}>
                {order.status}
              </Badge>
            </div>
          </div>

          {/* Progress tracker */}
          {!isCancelled && (
            <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-primary mb-6">
                Order Progress
              </h3>
              <div className="relative">
                {/* Progress line */}
                <div className="absolute top-5 left-5 right-5 h-0.5 bg-border" />
                <div
                  className="absolute top-5 left-5 h-0.5 bg-secondary transition-all duration-500"
                  style={{
                    width: `${Math.max(0, (currentStep / (TRACK_STEPS.length - 1)) * 100)}%`,
                    maxWidth: "calc(100% - 40px)",
                  }}
                />

                <div className="relative flex justify-between">
                  {TRACK_STEPS.map((step, i) => {
                    const isCompleted = i <= currentStep;
                    const isCurrent = i === currentStep;
                    return (
                      <div
                        key={step.key}
                        className="flex flex-col items-center text-center"
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                            isCurrent
                              ? "bg-secondary text-white ring-4 ring-secondary/20 scale-110"
                              : isCompleted
                                ? "bg-secondary text-white"
                                : "bg-surface-alt text-muted-light border border-border"
                          }`}
                        >
                          {StepIcons[step.key]}
                        </div>
                        <p
                          className={`mt-2 text-xs font-medium ${isCurrent ? "text-secondary" : isCompleted ? "text-primary" : "text-muted-light"}`}
                        >
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {isCancelled && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-red-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="mt-2 text-sm font-medium text-red-700">
                This order has been cancelled.
              </p>
            </div>
          )}

          {/* Order items */}
          <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-primary">
                Items ({order.items.length})
              </h3>
            </div>
            <div className="divide-y divide-border">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 px-6 py-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-alt">
                    {item.product.imageUrl ? (
                      <img src={item.product.imageUrl} alt={item.product.name} className="h-12 w-12 rounded-lg object-cover" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-muted-light">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-primary truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-muted">
                      Qty: {item.quantity} × {formatCurrency(item.priceAtPurchase)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-primary">
                    {formatCurrency(item.quantity * item.priceAtPurchase)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between px-6 py-4 bg-surface-alt border-t border-border">
              <span className="text-sm font-medium text-muted">Total</span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
