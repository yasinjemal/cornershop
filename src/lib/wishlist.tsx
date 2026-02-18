"use client";

// ============================================
// Wishlist System — localStorage-based favorites
// ============================================

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

type WishlistContextValue = {
  items: string[]; // product IDs
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  toggle: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  has: (productId: string) => boolean;
  count: number;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}

const STORAGE_KEY = "menscorner_wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((productId: string) => {
    setItems((prev) => (prev.includes(productId) ? prev : [...prev, productId]));
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((id) => id !== productId));
  }, []);

  const toggleItem = useCallback((productId: string) => {
    setItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => items.includes(productId),
    [items]
  );

  return (
    <WishlistContext.Provider
      value={{ items, addItem, removeItem, toggleItem, toggle: toggleItem, isInWishlist, has: isInWishlist, count: items.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
