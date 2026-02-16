"use client";

// ============================================
// Global Error Boundary
// ============================================

import Button from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-32 text-center">
      <h1 className="text-4xl font-bold text-red-600">Something went wrong</h1>
      <p className="mt-3 text-muted max-w-md">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <div className="mt-8">
        <Button onClick={reset}>Try Again</Button>
      </div>
    </div>
  );
}
