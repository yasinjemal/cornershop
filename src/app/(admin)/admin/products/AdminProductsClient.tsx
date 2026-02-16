"use client";

// ============================================
// Admin Products — Professional product list
// Grid/list view, search, filters, bulk actions
// ============================================

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  imageUrl: string;
  images: string[];
  stock: number;
  sku: string;
  featured: boolean;
  categoryId: string | null;
  categoryName: string | null;
  createdAt: string;
  pricingTiers: { id: string; productId: string; minQty: number; pricePerUnit: number }[];
  _count: { orderItems: number };
};

export default function AdminProductsClient({
  products,
}: {
  products: ProductRow[];
}) {
  const router = useRouter();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!search) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.categoryName?.toLowerCase().includes(q)
    );
  }, [products, search]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((p) => p.id)));
  };

  async function handleDelete(id: string) {
    setDeleting(id);
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setDeleting(null);
    router.refresh();
  }

  async function handleBulkDelete() {
    if (!confirm(`Delete ${selected.size} product(s)?`)) return;
    await Promise.all(
      Array.from(selected).map((id) =>
        fetch(`/api/products/${id}`, { method: "DELETE" })
      )
    );
    setSelected(new Set());
    router.refresh();
  }

  const stockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of stock", color: "bg-red-100 text-red-700" };
    if (stock <= 10) return { label: "Low stock", color: "bg-amber-100 text-amber-700" };
    return { label: "In stock", color: "bg-green-100 text-green-700" };
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{filtered.length} product{filtered.length !== 1 ? "s" : ""}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-56 pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all"
            />
          </div>

          {/* View toggle */}
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setView("grid")}
              className={`p-2 transition-colors ${view === "grid" ? "bg-amber-50 text-amber-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 transition-colors ${view === "list" ? "bg-amber-50 text-amber-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Add Product */}
          <Link
            href="/admin/products/new"
            className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all shadow-sm shadow-amber-500/25 flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </Link>
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl">
          <span className="text-sm font-medium text-amber-700">{selected.size} selected</span>
          <button
            onClick={handleBulkDelete}
            className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            Delete Selected
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="text-xs text-amber-600 hover:text-amber-700 ml-auto"
          >
            Clear
          </button>
        </div>
      )}

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {search ? "No matching products" : "No products yet"}
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            {search ? "Try adjusting your search" : "Add your first product to get started"}
          </p>
          {!search && (
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-xl hover:bg-amber-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </Link>
          )}
        </div>
      ) : view === "grid" ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => {
            const status = stockStatus(p.stock);
            return (
              <div
                key={p.id}
                className={`group bg-white rounded-2xl border overflow-hidden transition-all hover:shadow-md ${
                  selected.has(p.id) ? "border-amber-400 ring-2 ring-amber-100" : "border-gray-100"
                }`}
              >
                {/* Image */}
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  {/* Select checkbox */}
                  <button
                    onClick={() => toggleSelect(p.id)}
                    className={`absolute top-3 left-3 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                      selected.has(p.id)
                        ? "bg-amber-500 border-amber-500 text-white"
                        : "bg-white/80 border-gray-300 opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {selected.has(p.id) && (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  {/* Featured badge */}
                  {p.featured && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold uppercase rounded-md">
                      Featured
                    </div>
                  )}

                  {/* Hover actions */}
                  <div className="absolute bottom-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="w-8 h-8 rounded-lg bg-white/90 hover:bg-white flex items-center justify-center text-gray-700 shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deleting === p.id}
                      className="w-8 h-8 rounded-lg bg-red-500/90 hover:bg-red-600 flex items-center justify-center text-white shadow-sm disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{p.name}</h3>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{p.categoryName || "Uncategorized"}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(p.basePrice)}</span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  {p.pricingTiers.length > 0 && (
                    <p className="text-[10px] text-gray-400 mt-1.5">
                      {p.pricingTiers.length} wholesale tier{p.pricingTiers.length !== 1 ? "s" : ""} · {p._count.orderItems} sold
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          {/* Table header */}
          <div className="grid grid-cols-[auto_1fr_120px_100px_100px_80px_auto] gap-4 items-center px-5 py-3 border-b border-gray-100 text-xs font-medium text-gray-400 uppercase tracking-wider">
            <div>
              <button
                onClick={selectAll}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  selected.size === filtered.length && filtered.length > 0
                    ? "bg-amber-500 border-amber-500 text-white"
                    : "border-gray-300"
                }`}
              >
                {selected.size === filtered.length && filtered.length > 0 && (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            </div>
            <div>Product</div>
            <div>Price</div>
            <div>Stock</div>
            <div>Category</div>
            <div>Sold</div>
            <div>Actions</div>
          </div>

          {/* Rows */}
          {filtered.map((p) => {
            const status = stockStatus(p.stock);
            return (
              <div
                key={p.id}
                className={`grid grid-cols-[auto_1fr_120px_100px_100px_80px_auto] gap-4 items-center px-5 py-3 border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${
                  selected.has(p.id) ? "bg-amber-50/50" : ""
                }`}
              >
                <div>
                  <button
                    onClick={() => toggleSelect(p.id)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      selected.has(p.id) ? "bg-amber-500 border-amber-500 text-white" : "border-gray-300"
                    }`}
                  >
                    {selected.has(p.id) && (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                    <p className="text-[11px] text-gray-400 font-mono">{p.sku}</p>
                  </div>
                  {p.featured && (
                    <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-bold uppercase rounded shrink-0">
                      Featured
                    </span>
                  )}
                </div>

                <div className="text-sm font-semibold text-gray-900">{formatCurrency(p.basePrice)}</div>

                <div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.color}`}>
                    {p.stock}
                  </span>
                </div>

                <div className="text-xs text-gray-500 truncate">{p.categoryName || "—"}</div>

                <div className="text-xs text-gray-500">{p._count.orderItems}</div>

                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deleting === p.id}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
