// ============================================
// Store layout wrapper
// ============================================
// Wraps all public-facing store pages (products, cart, etc.)

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
