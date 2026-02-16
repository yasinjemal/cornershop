// ============================================
// Shared utility functions
// ============================================

/**
 * Format a number as currency (ZAR — South African Rand)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(amount);
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

/**
 * Calculate the correct price for a product based on quantity and pricing tiers
 * Falls back to basePrice if no tier matches
 */
export function calculateTieredPrice(
  basePrice: number,
  quantity: number,
  tiers: { minQty: number; pricePerUnit: number }[]
): number {
  // Sort tiers descending by minQty so we match the highest applicable tier
  const sorted = [...tiers].sort((a, b) => b.minQty - a.minQty);
  const matchedTier = sorted.find((tier) => quantity >= tier.minQty);
  return matchedTier ? matchedTier.pricePerUnit : basePrice;
}
