// ============================================
// Admin Dashboard — Professional overview
// Modern KPIs, revenue chart, activity feed
// ============================================

import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import Badge, { statusBadgeVariant } from "@/components/ui/Badge";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [productCount, userCount, orders, recentProducts] = await Promise.all([
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.findMany({
      include: { user: true, items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { category: true },
    }),
  ]);

  const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
  const deliveredOrders = orders.filter((o) => o.status === "DELIVERED").length;
  const recentOrders = orders.slice(0, 6);

  // Revenue by month (last 6 months)
  const monthlyRevenue: { month: string; amount: number }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = d.toLocaleDateString("en-ZA", { month: "short" });
    const amount = orders
      .filter((o) => {
        const od = new Date(o.createdAt);
        return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
      })
      .reduce((s, o) => s + o.totalAmount, 0);
    monthlyRevenue.push({ month: monthStr, amount });
  }
  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.amount), 1);

  // Order status breakdown
  const statusCounts = {
    PENDING: orders.filter((o) => o.status === "PENDING").length,
    CONFIRMED: orders.filter((o) => o.status === "CONFIRMED").length,
    PROCESSING: orders.filter((o) => o.status === "PROCESSING").length,
    SHIPPED: orders.filter((o) => o.status === "SHIPPED").length,
    DELIVERED: orders.filter((o) => o.status === "DELIVERED").length,
    CANCELLED: orders.filter((o) => o.status === "CANCELLED").length,
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              Live
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
          <p className="text-xs text-gray-400 mt-1">Total Revenue</p>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            {pendingOrders > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600">
                {pendingOrders} pending
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
          <p className="text-xs text-gray-400 mt-1">Total Orders</p>
        </div>

        {/* Products */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <Link href="/admin/products/new" className="text-xs text-amber-600 hover:text-amber-700 font-medium">
              + Add
            </Link>
          </div>
          <p className="text-2xl font-bold text-gray-900">{productCount}</p>
          <p className="text-xs text-gray-400 mt-1">Active Products</p>
        </div>

        {/* Customers */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{userCount}</p>
          <p className="text-xs text-gray-400 mt-1">Customers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Revenue Overview</h2>
              <p className="text-xs text-gray-400">Last 6 months</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs text-gray-400">Revenue</span>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end gap-3 h-44">
            {monthlyRevenue.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-medium text-gray-500">
                  {m.amount > 0 ? formatCurrency(m.amount).replace("ZAR", "R") : ""}
                </span>
                <div
                  className="w-full bg-gradient-to-t from-amber-500 to-amber-400 rounded-t-lg transition-all duration-500 min-h-[4px]"
                  style={{ height: `${Math.max((m.amount / maxRevenue) * 100, 3)}%` }}
                />
                <span className="text-[11px] text-gray-400">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Order Status</h2>
          <div className="space-y-3">
            {Object.entries(statusCounts).map(([status, count]) => {
              const colors: Record<string, string> = {
                PENDING: "bg-gray-200",
                CONFIRMED: "bg-amber-400",
                PROCESSING: "bg-blue-400",
                SHIPPED: "bg-indigo-400",
                DELIVERED: "bg-green-400",
                CANCELLED: "bg-red-400",
              };
              const pct = orders.length > 0 ? (count / orders.length) * 100 : 0;
              return (
                <div key={status} className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${colors[status] || "bg-gray-300"}`} />
                  <span className="text-xs text-gray-600 flex-1 capitalize">{status.toLowerCase()}</span>
                  <span className="text-xs font-semibold text-gray-900">{count}</span>
                  <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${colors[status] || "bg-gray-300"}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Completion rate */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">Fulfillment Rate</span>
              <span className="text-xs font-bold text-green-600">
                {orders.length > 0 ? ((deliveredOrders / orders.length) * 100).toFixed(0) : 0}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all"
                style={{ width: `${orders.length > 0 ? (deliveredOrders / orders.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-amber-600 hover:text-amber-700 font-medium">
              View All →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto rounded-xl bg-gray-50 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-sm text-gray-400">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-amber-600">
                      {order.user.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{order.user.name}</p>
                    <p className="text-[11px] text-gray-400">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""} · #{order.id.slice(0, 8)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                    <Badge variant={statusBadgeVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recently Added Products */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-900">Recent Products</h2>
            <Link href="/admin/products/new" className="text-xs text-amber-600 hover:text-amber-700 font-medium">
              + Add New
            </Link>
          </div>

          {recentProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400">No products yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-[11px] text-gray-400">
                      {product.category?.name || "Uncategorized"} · {product.stock} in stock
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 shrink-0">
                    {formatCurrency(product.basePrice)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/admin/products/new"
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-600">Add Product</span>
          </Link>

          <Link
            href="/admin/orders"
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-600">View Orders</span>
          </Link>

          <Link
            href="/admin/users"
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-600">Customers</span>
          </Link>

          <Link
            href="/"
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-600">View Store</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
