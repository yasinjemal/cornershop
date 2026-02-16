"use client";

// ============================================
// Search bar with autocomplete dropdown
// ============================================

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

type SearchResult = {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  imageUrl: string;
  category: { name: string; slug: string } | null;
};

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    if (debounce.current) clearTimeout(debounce.current);

    if (value.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    debounce.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
        const json = await res.json();
        setResults(json.data || []);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
  }

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-light"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search products, SKUs..."
          className="w-full rounded-lg border border-border bg-surface-alt py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-light outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-secondary border-t-transparent" />
          </div>
        )}
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-lg border border-border bg-white shadow-lg overflow-hidden animate-[slide-in-up_0.15s_ease-out]">
          {results.map((item) => (
            <Link
              key={item.id}
              href={`/products/${item.id}`}
              onClick={() => {
                setOpen(false);
                setQuery("");
              }}
              className="flex items-center gap-3 px-4 py-3 transition hover:bg-surface-alt border-b border-border/50 last:border-0"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-surface-alt text-lg">
                �
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-primary truncate">
                  {item.name}
                </p>
                {item.category && (
                  <p className="text-xs text-muted">{item.category.name}</p>
                )}
              </div>
              <span className="shrink-0 text-sm font-semibold text-secondary">
                {formatCurrency(item.basePrice)}
              </span>
            </Link>
          ))}
          <Link
            href={`/products?search=${encodeURIComponent(query)}`}
            onClick={() => {
              setOpen(false);
              setQuery("");
            }}
            className="block px-4 py-2.5 text-center text-sm font-medium text-secondary hover:bg-surface-alt transition"
          >
            View all results for &quot;{query}&quot;
          </Link>
        </div>
      )}

      {open && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-lg border border-border bg-white shadow-lg p-4 text-center text-sm text-muted">
          No products found for &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}
