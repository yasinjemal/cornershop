// ============================================
// ProductFormClient — Pro product creation form
// Shopify-inspired: Sectioned layout, media upload,
// auto-slug, category picker, pricing tiers, variants
// ============================================

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MediaUploader, { type MediaFile } from "@/components/admin/MediaUploader";

type Category = { id: string; name: string; slug: string };
type PricingTier = { minQty: number; pricePerUnit: number };

type ProductFormData = {
  name: string;
  slug: string;
  description: string;
  basePrice: string;
  stock: string;
  sku: string;
  featured: boolean;
  categoryId: string;
  pricingTiers: PricingTier[];
};

type Props = {
  categories: Category[];
  initialData?: ProductFormData & { id: string; media: MediaFile[] };
};

export default function ProductFormClient({ categories, initialData }: Props) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [form, setForm] = useState<ProductFormData>(
    initialData || {
      name: "",
      slug: "",
      description: "",
      basePrice: "",
      stock: "100",
      sku: "",
      featured: false,
      categoryId: "",
      pricingTiers: [],
    }
  );

  const [media, setMedia] = useState<MediaFile[]>(initialData?.media || []);
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!isEditing);
  const [activeSection, setActiveSection] = useState("general");

  // Auto-generate slug from name
  useEffect(() => {
    if (autoSlug && form.name) {
      setForm((prev) => ({
        ...prev,
        slug: form.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      }));
    }
  }, [form.name, autoSlug]);

  // Auto-generate SKU
  useEffect(() => {
    if (!isEditing && form.name && !form.sku) {
      const prefix = "BS";
      const code = form.name
        .split(" ")
        .map((w) => w.charAt(0))
        .join("")
        .toUpperCase()
        .substring(0, 3);
      setForm((prev) => ({
        ...prev,
        sku: `${prefix}-${code}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      }));
    }
  }, [form.name, isEditing]);

  const updateField = <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addPricingTier = () => {
    const lastTier = form.pricingTiers[form.pricingTiers.length - 1];
    updateField("pricingTiers", [
      ...form.pricingTiers,
      {
        minQty: lastTier ? lastTier.minQty + 10 : 10,
        pricePerUnit: form.basePrice ? parseFloat(form.basePrice) * 0.9 : 0,
      },
    ]);
  };

  const updateTier = (index: number, field: "minQty" | "pricePerUnit", value: number) => {
    const updated = [...form.pricingTiers];
    updated[index] = { ...updated[index], [field]: value };
    updateField("pricingTiers", updated);
  };

  const removeTier = (index: number) => {
    updateField(
      "pricingTiers",
      form.pricingTiers.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async () => {
    if (!form.name || !form.basePrice) return;

    setSaving(true);
    try {
      const imageUrl = media.length > 0 ? media[0].url : "/placeholder.jpg";
      const images = media.map((m) => m.url);

      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        basePrice: parseFloat(form.basePrice),
        imageUrl,
        images,
        stock: parseInt(form.stock) || 0,
        sku: form.sku,
        featured: form.featured,
        categoryId: form.categoryId || null,
        pricingTiers: form.pricingTiers.filter((t) => t.minQty > 0 && t.pricePerUnit > 0),
      };

      const url = isEditing ? `/api/products/${initialData.id}` : "/api/products";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      }
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: "general", label: "General", icon: "info" },
    { id: "media", label: "Media", icon: "image" },
    { id: "pricing", label: "Pricing", icon: "tag" },
    { id: "inventory", label: "Inventory", icon: "box" },
    { id: "wholesale", label: "Wholesale", icon: "layers" },
  ];

  const sectionIcons: Record<string, React.ReactNode> = {
    info: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    image: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    tag: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    box: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    layers: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/products")}
            className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {isEditing ? "Edit Product" : "Add Product"}
            </h1>
            <p className="text-sm text-gray-400">
              {isEditing ? "Update product details" : "Fill in the details to create a new product"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/admin/products")}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Discard
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !form.name || !form.basePrice}
            className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all shadow-sm shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {isEditing ? "Update" : "Publish"}
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Section Navigation */}
        <div className="w-48 shrink-0 hidden lg:block">
          <div className="sticky top-24 space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  document.getElementById(`section-${section.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl transition-all ${
                  activeSection === section.id
                    ? "bg-amber-50 text-amber-700 font-medium"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className={activeSection === section.id ? "text-amber-600" : "text-gray-400"}>
                  {sectionIcons[section.icon]}
                </span>
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Sections */}
        <div className="flex-1 space-y-5">
          {/* General Information */}
          <section id="section-general" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                {sectionIcons.info}
              </div>
              <h2 className="text-base font-semibold text-gray-900">General Information</h2>
            </div>

            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="e.g. Classic Black Three-Piece Suit"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all placeholder:text-gray-300"
                />
              </div>

              {/* Slug */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-gray-700">URL Slug</label>
                  <button
                    type="button"
                    onClick={() => setAutoSlug(!autoSlug)}
                    className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                      autoSlug ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {autoSlug ? "Auto" : "Manual"}
                  </button>
                </div>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 text-sm bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-gray-400">
                    /products/
                  </span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => {
                      setAutoSlug(false);
                      updateField("slug", e.target.value);
                    }}
                    className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <div className="relative">
                  <select
                    value={form.categoryId}
                    onChange={(e) => updateField("categoryId", e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all pr-10"
                  >
                    <option value="">Select category...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Describe the product in detail — materials, fit, occasion..."
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all placeholder:text-gray-300"
                />
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center justify-between py-2 px-4 bg-amber-50/50 rounded-xl border border-amber-100">
                <div>
                  <p className="text-sm font-medium text-gray-700">Featured Product</p>
                  <p className="text-xs text-gray-400">Show on homepage & recommended sections</p>
                </div>
                <button
                  type="button"
                  onClick={() => updateField("featured", !form.featured)}
                  className={`relative w-11 h-6 rounded-full transition-all duration-200 ${
                    form.featured ? "bg-amber-500" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                      form.featured ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Media Section */}
          <section id="section-media" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                {sectionIcons.image}
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Media</h2>
                <p className="text-xs text-gray-400">Upload product images and videos</p>
              </div>
            </div>
            <MediaUploader value={media} onChange={setMedia} maxFiles={10} />
          </section>

          {/* Pricing Section */}
          <section id="section-pricing" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                {sectionIcons.tag}
              </div>
              <h2 className="text-base font-semibold text-gray-900">Pricing</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Base Price (ZAR) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">R</span>
                    <input
                      type="number"
                      value={form.basePrice}
                      onChange={(e) => updateField("basePrice", e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Price preview */}
              {form.basePrice && (
                <div className="flex items-center gap-3 p-3 bg-green-50/50 rounded-xl border border-green-100">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-700">
                      R {parseFloat(form.basePrice).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-green-500">Retail price per unit</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Inventory Section */}
          <section id="section-inventory" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                {sectionIcons.box}
              </div>
              <h2 className="text-base font-semibold text-gray-900">Inventory</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">SKU</label>
                <input
                  type="text"
                  value={form.sku}
                  onChange={(e) => updateField("sku", e.target.value)}
                  placeholder="Auto-generated"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock Quantity</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => updateField("stock", e.target.value)}
                  min="0"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all"
                />
              </div>
            </div>

            {/* Stock status indicator */}
            {form.stock && (
              <div className={`mt-4 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium ${
                parseInt(form.stock) > 20
                  ? "bg-green-50 text-green-600"
                  : parseInt(form.stock) > 0
                    ? "bg-amber-50 text-amber-600"
                    : "bg-red-50 text-red-600"
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  parseInt(form.stock) > 20 ? "bg-green-500" : parseInt(form.stock) > 0 ? "bg-amber-500" : "bg-red-500"
                }`} />
                {parseInt(form.stock) > 20
                  ? "In Stock"
                  : parseInt(form.stock) > 0
                    ? "Low Stock"
                    : "Out of Stock"}
                {" — "}{form.stock} units
              </div>
            )}
          </section>

          {/* Wholesale Pricing Tiers */}
          <section id="section-wholesale" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  {sectionIcons.layers}
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Wholesale Pricing</h2>
                  <p className="text-xs text-gray-400">Bulk discount tiers for resellers</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addPricingTier}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Tier
              </button>
            </div>

            {form.pricingTiers.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
                <div className="w-12 h-12 mx-auto rounded-xl bg-gray-50 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="text-sm text-gray-400">No wholesale tiers yet</p>
                <p className="text-xs text-gray-300 mt-1">Add pricing tiers for bulk/wholesale buyers</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Header */}
                <div className="grid grid-cols-[1fr_1fr_auto] gap-3 px-1">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Min. Quantity</p>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Price per Unit (ZAR)</p>
                  <div className="w-8" />
                </div>

                {form.pricingTiers.map((tier, index) => (
                  <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-center">
                    <div className="relative">
                      <input
                        type="number"
                        value={tier.minQty}
                        onChange={(e) => updateTier(index, "minQty", parseInt(e.target.value) || 0)}
                        min="1"
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-300">units</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">R</span>
                      <input
                        type="number"
                        value={tier.pricePerUnit}
                        onChange={(e) => updateTier(index, "pricePerUnit", parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTier(index)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}

                {/* Discount preview */}
                {form.basePrice && form.pricingTiers.length > 0 && (
                  <div className="mt-2 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                    <p className="text-xs font-medium text-indigo-600 mb-2">Discount Preview</p>
                    <div className="flex flex-wrap gap-2">
                      {form.pricingTiers
                        .filter((t) => t.pricePerUnit > 0)
                        .map((tier, i) => {
                          const discount = ((1 - tier.pricePerUnit / parseFloat(form.basePrice)) * 100).toFixed(0);
                          return (
                            <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs border border-indigo-100">
                              <span className="font-medium text-indigo-700">{tier.minQty}+</span>
                              <span className="text-indigo-400">→</span>
                              <span className="font-semibold text-green-600">-{discount}%</span>
                            </span>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Bottom Save Bar */}
          <div className="flex items-center justify-end gap-3 pb-6">
            <button
              onClick={() => router.push("/admin/products")}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving || !form.name || !form.basePrice}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all shadow-sm shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {isEditing ? "Update Product" : "Publish Product"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
