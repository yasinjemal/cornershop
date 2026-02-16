// ============================================
// Shared TypeScript types
// ============================================

export type { Role } from "@/generated/prisma/client";

/** API response wrapper */
export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

/** Product with pricing tiers included */
export type ProductWithTiers = {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  imageUrl: string;
  images: string[];
  stock: number;
  sku: string;
  featured: boolean;
  categoryId: string | null;
  createdAt: string;
  pricingTiers: PricingTierData[];
  category?: CategoryData | null;
};

export type CategoryData = {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
};

export type PricingTierData = {
  id: string;
  productId: string;
  minQty: number;
  pricePerUnit: number;
};

/** Order with user and items included */
export type OrderWithDetails = {
  id: string;
  userId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  user: UserData;
  items: OrderItemWithProduct[];
};

export type OrderItemWithProduct = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  priceAtPurchase: number;
  product: ProductWithTiers;
};

export type UserData = {
  id: string;
  name: string;
  email: string;
  role: "RETAIL" | "WHOLESALE" | "ADMIN";
  createdAt: string;
};

/** Cart item (client-side only) */
export type CartItem = {
  productId: string;
  name: string;
  imageUrl: string;
  basePrice: number;
  quantity: number;
  unitPrice: number;
  pricingTiers: PricingTierData[];
};
