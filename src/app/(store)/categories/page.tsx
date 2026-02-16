// ============================================
// Categories Page — browse by product category
// ============================================

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <Breadcrumbs items={[{ label: "Categories" }]} />

      <div className="mb-10">
        <p className="text-xs font-semibold text-secondary uppercase tracking-widest mb-2">Browse</p>
        <h1 className="text-3xl font-bold text-primary">Shop by Style</h1>
        <p className="mt-1.5 text-muted">
          Browse our complete range of premium men&apos;s fashion.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="group relative overflow-hidden rounded-xl border border-border bg-white p-6 card-hover"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-surface-alt flex items-center justify-center mb-3 group-hover:bg-secondary-muted transition-colors">
                  <svg className="w-5 h-5 text-muted group-hover:text-secondary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-primary group-hover:text-secondary transition-colors">
                  {cat.name}
                </h2>
                <p className="mt-1 text-sm text-muted line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-light bg-surface-alt px-2.5 py-1 rounded-full">
                {cat._count.products} {cat._count.products === 1 ? "product" : "products"}
              </span>
              <span className="text-xs font-medium text-cta opacity-0 group-hover:opacity-100 transition-opacity">
                Browse →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
