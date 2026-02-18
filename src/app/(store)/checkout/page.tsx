"use client";

// ============================================
// Checkout Page — order placement with shipping
// ============================================

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatCurrency } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import EmptyState from "@/components/ui/EmptyState";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [role, setRole] = useState<"RETAIL" | "WHOLESALE">("RETAIL");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState("");

  if (orderId) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-trust/10 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-trust">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold">Order Placed!</h1>
        <p className="mt-3 text-muted">
          Your order <span className="font-mono text-primary">{orderId}</span> has
          been received and is being processed.
        </p>
        <div className="mt-8">
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <EmptyState
          title="Nothing to checkout"
          description="Add items to your cart first."
                  />
        <div className="mt-6 text-center">
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Find or create user (secure email lookup)
      const userRes = await fetch(`/api/users?email=${encodeURIComponent(email)}`);
      const userData = await userRes.json();
      let userId: string | null = null;

      if (userData.success && userData.data) {
        userId = userData.data.id;
      }

      // Create user if not exists (simplified — no auth)
      if (!userId) {
        const createRes = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, role }),
        });
        const created = await createRes.json();
        if (!created.success) throw new Error(created.error || "Failed to create user");
        userId = created.data.id;
      }

      // 2. Place order
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: item.unitPrice,
          })),
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success)
        throw new Error(orderData.error || "Failed to place order");

      setOrderId(orderData.data.id);
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer info */}
        <div className="rounded-xl border border-border bg-white p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-semibold">Customer Information</h2>
          <Input
            label="Full Name"
            placeholder="John Doe"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+27 xx xxx xxxx"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Select
            label="Account Type"
            value={role}
            onChange={(e) => setRole(e.target.value as "RETAIL" | "WHOLESALE")}
            options={[
              { value: "RETAIL", label: "Retail Customer" },
              { value: "WHOLESALE", label: "Wholesale Buyer" },
            ]}
          />
        </div>

        {/* Shipping address */}
        <div className="rounded-xl border border-border bg-white p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-semibold">Shipping Address</h2>
          <Input
            label="Street Address"
            placeholder="123 Main Road, Apt 4"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              placeholder="Johannesburg"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <Select
              label="Province"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              options={[
                { value: "", label: "Select province" },
                { value: "GP", label: "Gauteng" },
                { value: "WC", label: "Western Cape" },
                { value: "KZN", label: "KwaZulu-Natal" },
                { value: "EC", label: "Eastern Cape" },
                { value: "FS", label: "Free State" },
                { value: "LP", label: "Limpopo" },
                { value: "MP", label: "Mpumalanga" },
                { value: "NW", label: "North West" },
                { value: "NC", label: "Northern Cape" },
              ]}
            />
          </div>
          <Input
            label="Postal Code"
            placeholder="2000"
            required
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </div>

        {/* Order summary */}
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-muted">
                  {item.name} × {item.quantity}
                </span>
                <span className="text-foreground font-medium">
                  {formatCurrency(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
            <div className="border-t border-border pt-3 flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold">
                {formatCurrency(totalPrice)}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Placing Order..." : `Place Order — ${formatCurrency(totalPrice)}`}
        </Button>
      </form>
    </div>
  );
}
