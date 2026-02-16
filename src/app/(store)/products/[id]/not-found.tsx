// ============================================
// Product Not Found
// ============================================

import Link from "next/link";
import Button from "@/components/ui/Button";

export default function ProductNotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-32 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-alt flex items-center justify-center">
        <svg className="w-8 h-8 text-muted-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
      <h1 className="mt-4 text-2xl font-bold text-primary">
        Product Not Found
      </h1>
      <p className="mt-2 text-sm text-muted">
        This product may have been removed or doesn&apos;t exist.
      </p>
      <div className="mt-8">
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    </div>
  );
}
