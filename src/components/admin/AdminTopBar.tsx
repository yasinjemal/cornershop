// ============================================
// AdminTopBar — Top navigation bar for admin
// Search, notifications, admin profile
// ============================================

"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/admin": { title: "Dashboard", subtitle: "Overview of your business" },
  "/admin/products": { title: "Products", subtitle: "Manage your inventory" },
  "/admin/products/new": { title: "Add Product", subtitle: "Create a new product listing" },
  "/admin/orders": { title: "Orders", subtitle: "Track and manage orders" },
  "/admin/users": { title: "Customers", subtitle: "Manage your customer base" },
};

export default function AdminTopBar() {
  const pathname = usePathname();
  const page = pageTitles[pathname] || { title: "Admin", subtitle: "" };

  // Build breadcrumbs
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((seg, i) => ({
    label: seg.charAt(0).toUpperCase() + seg.slice(1),
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200/80 flex items-center justify-between px-6 backdrop-blur-sm bg-white/95">
      {/* Left: Page title + breadcrumbs */}
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-0.5">
          {breadcrumbs.map((crumb) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              {crumb.isLast ? (
                <span className="text-gray-600 font-medium">{crumb.label}</span>
              ) : (
                <>
                  <Link href={crumb.href} className="hover:text-gray-600 transition-colors">
                    {crumb.label}
                  </Link>
                  <svg className="w-3 h-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </>
              )}
            </span>
          ))}
        </div>
        <h1 className="text-lg font-semibold text-gray-900 truncate">{page.title}</h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            className="w-56 pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all placeholder:text-gray-400"
          />
        </div>

        {/* Notification bell */}
        <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200" />

        {/* Admin profile */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white text-xs font-bold">
            A
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-gray-900 leading-tight">Admin</p>
            <p className="text-[11px] text-gray-400 leading-tight">admin@menscorner.co.za</p>
          </div>
        </div>
      </div>
    </header>
  );
}
