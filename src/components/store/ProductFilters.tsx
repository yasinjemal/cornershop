"use client";

// ============================================
// Search + Sort bar for product catalog
// ============================================

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.push(`/products?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="flex-1">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            updateParams("search", e.target.value);
          }}
        />
      </div>
      <div className="w-full sm:w-48">
        <Select
          value={searchParams.get("sort") || "newest"}
          onChange={(e) => updateParams("sort", e.target.value)}
          options={[
            { value: "newest", label: "Newest First" },
            { value: "name", label: "Name A-Z" },
            { value: "price", label: "Price: Low → High" },
          ]}
        />
      </div>
      {isPending && (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-secondary" />
      )}
    </div>
  );
}
