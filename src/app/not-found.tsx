// ============================================
// 404 — Page Not Found
// ============================================

import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-32 text-center">
      <h1 className="text-6xl font-extrabold text-primary">404</h1>
      <p className="mt-4 text-lg text-muted">Page not found</p>
      <p className="mt-1 text-sm text-muted-light">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8">
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
