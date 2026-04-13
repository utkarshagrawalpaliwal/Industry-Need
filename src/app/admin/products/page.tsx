"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Package,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  IndianRupee,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { calculateTransparentPricing, PRICING_BREAKDOWN, DEFAULT_PRICING_BREAKDOWN, PricingItem } from "@/lib/constants";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  sku: string;
  description: string;
  landingPrice: number;
  mrp: number;
  sellingPrice: number;
  pricingOverride: PricingItem[] | null;
  categoryId: string;
  category: Category;
  specifications: string | null;
  inStock: boolean;
  imageUrl: string | null;
}

// ─── Product Form ────────────────────────────────────────────────────────────

function ProductForm({
  product,
  categories,
  onSave,
  onCancel,
}: {
  product: Product | null;
  categories: Category[];
  onSave: () => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(product?.name ?? "");
  const [brand, setBrand] = useState(product?.brand ?? "");
  const [sku, setSku] = useState(product?.sku ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [landingPrice, setLandingPrice] = useState(product?.landingPrice ?? 0);
  const [mrp, setMrp] = useState(product?.mrp ?? 0);
  const [sellingPrice, setSellingPrice] = useState(product?.sellingPrice ?? 0);
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const [useOverride, setUseOverride] = useState(!!product?.pricingOverride);
  const [overrideBreakdown, setOverrideBreakdown] = useState<PricingItem[]>(
    product?.pricingOverride
      ? product.pricingOverride
      : DEFAULT_PRICING_BREAKDOWN.map((b) => ({ ...b }))
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const activeBreakdown = useOverride ? overrideBreakdown : DEFAULT_PRICING_BREAKDOWN;

  // Auto-calculate selling price from landing price
  function handleLandingPriceChange(val: number) {
    setLandingPrice(val);
    if (val > 0) {
      const { sellingPrice: suggested } = calculateTransparentPricing(val, activeBreakdown);
      setSellingPrice(suggested);
    }
  }

  function updateOverridePercent(index: number, value: number) {
    setOverrideBreakdown((prev) =>
      prev.map((item, i) => (i === index ? { ...item, percent: value } : item))
    );
  }

  // Recalculate selling price when override changes
  function applyOverride() {
    if (landingPrice > 0) {
      const { sellingPrice: suggested } = calculateTransparentPricing(landingPrice, overrideBreakdown);
      setSellingPrice(suggested);
    }
  }

  // Show live breakdown
  const breakdown = sellingPrice > 0
    ? activeBreakdown.map((item) => ({
        ...item,
        amount: Math.round(sellingPrice * item.percent),
      }))
    : [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !brand || !sku || !description || !categoryId || sellingPrice <= 0) {
      setError("Please fill all required fields.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const url = product ? `/api/products/${product.id}` : "/api/products";
      const method = product ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          brand,
          sku,
          description,
          landingPrice,
          mrp: mrp || sellingPrice,
          sellingPrice,
          pricingOverride: useOverride ? overrideBreakdown : null,
          categoryId,
          inStock,
        }),
      });

      if (res.ok) {
        onSave();
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? `Failed (${res.status})`);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#0a0a0a]">
          {product ? "Edit Product" : "Add New Product"}
        </h2>
        <button onClick={onCancel} className="p-1.5 text-[#6b7280] hover:text-[#0a0a0a] transition-colors">
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg text-sm font-medium bg-red-50 text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-1.5">
              Product Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4860b]/30 focus:border-[#d4860b]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-1.5">
              Brand *
            </label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4860b]/30 focus:border-[#d4860b]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-1.5">
              SKU *
            </label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4860b]/30 focus:border-[#d4860b]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-1.5">
              Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4860b]/30 focus:border-[#d4860b]"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-1.5">
              Description *
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4860b]/30 focus:border-[#d4860b]"
            />
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-[#f9fafb] rounded-xl p-5 mb-6">
          <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-4">
            Transparent Pricing
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-[#6b7280] mb-1.5">
                Landing Price (Our Cost) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] text-sm">₹</span>
                <input
                  type="number"
                  value={landingPrice || ""}
                  onChange={(e) => handleLandingPriceChange(parseFloat(e.target.value) || 0)}
                  min={0}
                  className="w-full pl-7 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4860b]/30 focus:border-[#d4860b]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6b7280] mb-1.5">
                MRP (Market Rate)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] text-sm">₹</span>
                <input
                  type="number"
                  value={mrp || ""}
                  onChange={(e) => setMrp(parseFloat(e.target.value) || 0)}
                  min={0}
                  className="w-full pl-7 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4860b]/30 focus:border-[#d4860b]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6b7280] mb-1.5">
                Selling Price (Auto-calculated) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] text-sm">₹</span>
                <input
                  type="number"
                  value={sellingPrice || ""}
                  onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                  min={0}
                  className="w-full pl-7 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 font-semibold text-green-700"
                />
              </div>
            </div>
          </div>

          {/* Override toggle */}
          <div className="flex items-center gap-3 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useOverride}
                onChange={(e) => setUseOverride(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#d4860b] focus:ring-[#d4860b]"
              />
              <span className="text-sm font-medium text-[#374151]">
                Override default percentages for this product
              </span>
            </label>
          </div>

          {/* Editable override percentages */}
          {useOverride && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-3">
                Custom Percentages
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {overrideBreakdown.map((item, idx) => (
                  <div key={item.key}>
                    <label className="block text-[10px] text-[#6b7280] font-medium mb-1 truncate" title={item.label}>
                      {item.label}
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={Math.round(item.percent * 100)}
                        onChange={(e) => updateOverridePercent(idx, (parseInt(e.target.value) || 0) / 100)}
                        min={0}
                        max={100}
                        className="w-full px-2 py-1.5 text-xs text-right border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 font-semibold"
                      />
                      <span className="text-xs text-[#6b7280]">%</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className={`text-xs font-semibold ${
                  Math.abs(overrideBreakdown.reduce((s, b) => s + b.percent, 0) - 1) < 0.01
                    ? "text-green-600" : "text-red-600"
                }`}>
                  Total: {Math.round(overrideBreakdown.reduce((s, b) => s + b.percent, 0) * 100)}%
                </span>
                <button
                  type="button"
                  onClick={applyOverride}
                  className="text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors"
                >
                  Recalculate Price →
                </button>
              </div>
            </div>
          )}

          {/* Live Breakdown Preview */}
          {sellingPrice > 0 && (
            <div className="bg-white rounded-lg border border-gray-100 p-4">
              <p className="text-[10px] font-bold text-[#d4860b] uppercase tracking-widest mb-3">
                Price Breakdown Preview {useOverride && <span className="text-amber-600">(Custom)</span>}
              </p>
              <div className="space-y-2">
                {breakdown.map((item) => (
                  <div key={item.key} className="flex items-center justify-between text-sm">
                    <span className="text-[#374151]">
                      {item.label}{" "}
                      <span className="text-[#9ca3af]">({Math.round(item.percent * 100)}%)</span>
                    </span>
                    <span className={`font-semibold ${item.key === "profit" ? "text-green-600" : "text-[#0a0a0a]"}`}>
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-bold text-[#d4860b]">
                  <span>Total Selling Price</span>
                  <span>{formatCurrency(sellingPrice)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stock toggle */}
        <div className="flex items-center gap-3 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#d4860b] focus:ring-[#d4860b]"
            />
            <span className="text-sm font-medium text-[#374151]">In Stock</span>
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-[#0a0a0a] text-white text-sm font-semibold rounded-xl hover:bg-[#2c3038] transition-colors disabled:opacity-40 flex items-center gap-2"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Package size={16} />
            )}
            {saving ? "Saving..." : product ? "Update Product" : "Add Product"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-200 text-[#6b7280] text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
      ]);
      if (prodRes.ok) setProducts(await prodRes.json());
      if (catRes.ok) setCategories(await catRes.json());
    } catch (err) {
      if (process.env.NODE_ENV !== "production") console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      fetchData();
    } catch {
      alert("Failed to delete product");
    } finally {
      setDeleting(null);
    }
  }

  const filtered = products.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.category.name.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4860b]" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0a0a0a] flex items-center gap-2">
            <Package className="w-6 h-6 text-[#d4860b]" /> Products
          </h1>
          <p className="text-sm text-[#6b7280] mt-1">
            {products.length} products &middot; {products.filter((p) => p.inStock).length} in stock
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#d4860b]/30 focus:border-[#d4860b] transition-colors"
            />
          </div>
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
            className="px-4 py-2.5 bg-[#0a0a0a] text-white text-sm font-semibold rounded-xl hover:bg-[#2c3038] transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          onSave={() => {
            setShowForm(false);
            setEditingProduct(null);
            fetchData();
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {/* Product List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[#6b7280]">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">{search ? "No products match your search" : "No products yet. Add your first product."}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((product) => (
              <div key={product.id}>
                <div
                  className="px-6 py-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                  onClick={() => setExpandedId(expandedId === product.id ? null : product.id)}
                >
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-6 gap-3 items-center">
                    {/* Name + Brand */}
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-[#0a0a0a]">{product.name}</p>
                      <p className="text-xs text-[#6b7280]">
                        {product.brand} &middot; {product.sku}
                      </p>
                    </div>
                    {/* Category */}
                    <div className="hidden md:block">
                      <span className="text-xs px-2 py-1 rounded-full bg-[#f5f2ed] text-[#2c3038] font-medium">
                        {product.category.name}
                      </span>
                    </div>
                    {/* Landing Price */}
                    <div className="hidden md:block">
                      <p className="text-[10px] text-[#9ca3af] uppercase">Landing</p>
                      <p className="text-sm font-medium text-[#6b7280]">
                        {product.landingPrice ? formatCurrency(product.landingPrice) : "—"}
                      </p>
                    </div>
                    {/* Selling Price */}
                    <div>
                      <p className="text-[10px] text-[#9ca3af] uppercase">Selling</p>
                      <p className="text-sm font-bold text-green-700">{formatCurrency(product.sellingPrice)}</p>
                    </div>
                    {/* Stock + Actions */}
                    <div className="flex items-center gap-3 justify-end">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          product.inStock
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.inStock ? "In Stock" : "Out"}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProduct(product);
                          setShowForm(true);
                        }}
                        className="p-1.5 text-[#6b7280] hover:text-[#d4860b] transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(product.id);
                        }}
                        disabled={deleting === product.id}
                        className="p-1.5 text-[#6b7280] hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                      </button>
                      {expandedId === product.id ? (
                        <ChevronUp className="w-4 h-4 text-[#6b7280]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#6b7280]" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded — Transparent Pricing Breakdown */}
                {expandedId === product.id && (
                  <div className="border-t border-gray-100 px-6 py-5 bg-[#f9fafb]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Info */}
                      <div>
                        <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                          Details
                        </p>
                        <p className="text-sm text-[#374151] mb-2">{product.description}</p>
                        <div className="flex gap-4 text-xs text-[#6b7280]">
                          <span>MRP: {formatCurrency(product.mrp)}</span>
                          {product.mrp > product.sellingPrice && (
                            <span className="text-green-600 font-semibold">
                              {Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)}% below MRP
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Pricing Breakdown */}
                      <div className="bg-white rounded-lg border border-gray-100 p-4">
                        <p className="text-[10px] font-bold text-[#d4860b] uppercase tracking-widest mb-3">
                          Transparent Pricing Breakdown
                        </p>
                        <div className="space-y-2">
                          {PRICING_BREAKDOWN.map((item) => {
                            const amount = Math.round(product.sellingPrice * item.percent);
                            return (
                              <div key={item.key} className="flex justify-between text-sm">
                                <span className="text-[#374151]">
                                  {item.label}{" "}
                                  <span className="text-[#9ca3af]">({Math.round(item.percent * 100)}%)</span>
                                </span>
                                <span
                                  className={`font-semibold ${
                                    item.key === "profit" ? "text-green-600" : "text-[#0a0a0a]"
                                  }`}
                                >
                                  {formatCurrency(amount)}
                                </span>
                              </div>
                            );
                          })}
                          <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-[#d4860b]">
                            <span>Selling Price</span>
                            <span>{formatCurrency(product.sellingPrice)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
