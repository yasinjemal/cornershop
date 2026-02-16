"use client";

// ============================================
// Admin Orders — Professional order management
// Expandable rows, detail panels, status workflow
// ============================================

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ORDER_STATUS } from "@/lib/constants";
import Badge, { statusBadgeVariant } from "@/components/ui/Badge";
import type { OrderWithDetails } from "@/types";

const statusFlow = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

export default function AdminOrdersClient({
  orders,
}: {
  orders: OrderWithDetails[];
}) {
  const router = useRouter();
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.user.name.toLowerCase().includes(q) ||
          o.user.email.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q)
      );
    }
    return result;
  }, [orders, filter, search]);

  // Count by status
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: orders.length };
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  async function handleStatusUpdate(orderId: string, status: string) {
    setUpdating(orderId);
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setUpdating(null);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this order permanently?")) return;
    await fetch(`/api/orders/${id}`, { method: "DELETE" });
    router.refresh();
  }

  const statusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-gray-100 text-gray-600",
      CONFIRMED: "bg-amber-100 text-amber-700",
      PROCESSING: "bg-blue-100 text-blue-700",
      SHIPPED: "bg-indigo-100 text-indigo-700",
      DELIVERED: "bg-green-100 text-green-700",
      CANCELLED: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="space-y-4">
      {/* Header with search */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{filtered.length} order{filtered.length !== 1 ? "s" : ""}</p>
        <div className="relative">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="w-56 pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all"
          />
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {["ALL", ...Object.values(ORDER_STATUS)].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
              filter === s
                ? "bg-[#1a1a2e] text-white shadow-sm"
                : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
            {statusCounts[s] ? (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                filter === s ? "bg-white/20" : "bg-gray-100"
              }`}>
                {statusCounts[s]}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No orders found</h3>
          <p className="text-sm text-gray-400">{search ? "Try adjusting your search" : "Orders will appear here"}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const isExpanded = expandedOrder === order.id;
            const currentStep = statusFlow.indexOf(order.status);

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm transition-all hover:shadow-md"
              >
                {/* Order row */}
                <div
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-amber-600">{order.user.name.charAt(0)}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">{order.user.name}</p>
                      <span className="text-[10px] text-gray-400 font-mono">#{order.id.slice(0, 8)}</span>
                    </div>
                    <p className="text-[11px] text-gray-400">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""} · {formatDate(order.createdAt)}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                    <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Expand arrow */}
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Expanded detail panel */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/50">
                    {/* Status workflow */}
                    {order.status !== "CANCELLED" && (
                      <div className="mb-5">
                        <p className="text-xs font-medium text-gray-500 mb-3">Order Progress</p>
                        <div className="flex items-center gap-1">
                          {statusFlow.map((step, i) => {
                            const isCompleted = i <= currentStep;
                            const isCurrent = i === currentStep;
                            return (
                              <div key={step} className="flex items-center flex-1">
                                <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[9px] font-bold transition-all ${
                                  isCurrent
                                    ? "bg-amber-500 text-white ring-4 ring-amber-100"
                                    : isCompleted
                                      ? "bg-green-500 text-white"
                                      : "bg-gray-200 text-gray-400"
                                }`}>
                                  {isCompleted && !isCurrent ? (
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : (
                                    i + 1
                                  )}
                                </div>
                                {i < statusFlow.length - 1 && (
                                  <div className={`flex-1 h-1 mx-1 rounded-full ${
                                    i < currentStep ? "bg-green-400" : "bg-gray-200"
                                  }`} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex mt-1.5">
                          {statusFlow.map((step, i) => (
                            <div key={step} className="flex-1 text-center">
                              <span className="text-[9px] text-gray-400 capitalize">{step.toLowerCase()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Order items */}
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-500 mb-2">Items</p>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-gray-100">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                              {item.product.imageUrl ? (
                                <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                              <p className="text-[11px] text-gray-400">Qty: {item.quantity} × {formatCurrency(item.priceAtPurchase)}</p>
                            </div>
                            <p className="text-sm font-semibold text-gray-900 shrink-0">
                              {formatCurrency(item.quantity * item.priceAtPurchase)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Customer info */}
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.user.name}</p>
                        <p className="text-[11px] text-gray-400">{order.user.email} · {order.user.role}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                          <>
                            {/* Next status button */}
                            {currentStep < statusFlow.length - 1 && (
                              <button
                                onClick={() => handleStatusUpdate(order.id, statusFlow[currentStep + 1])}
                                disabled={updating === order.id}
                                className="px-3 py-1.5 text-xs font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                              >
                                {updating === order.id ? (
                                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                  </svg>
                                )}
                                Move to {statusFlow[currentStep + 1].charAt(0) + statusFlow[currentStep + 1].slice(1).toLowerCase()}
                              </button>
                            )}

                            {/* Cancel button */}
                            <button
                              onClick={() => handleStatusUpdate(order.id, "CANCELLED")}
                              className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            >
                              Cancel Order
                            </button>
                          </>
                        )}
                      </div>

                      <button
                        onClick={() => handleDelete(order.id)}
                        className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
