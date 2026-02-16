"use client";

// ============================================
// Client Providers wrapper (cart, theme, etc.)
// ============================================

import { CartProvider } from "@/lib/cart";
import { ToastProvider } from "@/lib/toast";
import { WishlistProvider } from "@/lib/wishlist";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <WishlistProvider>
        <CartProvider>{children}</CartProvider>
      </WishlistProvider>
    </ToastProvider>
  );
}
