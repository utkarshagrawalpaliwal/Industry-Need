"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  FileText,
  Plus,
  Trash2,
  Search,
  Send,
  Download,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Phone,
  ArrowRight,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { QUOTE_STATUSES, QuoteStatus } from "@/types";
import { QUOTE_STATUS_BADGE_CLASSES, BUSINESS_PHONE } from "@/lib/constants";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ProductResult {
  id: string;
  name: string;
  brand: string;
  sku: string;
  mrp: number;
  sellingPrice: number;
}

interface QuoteItemRow {
  key: string;
  productId: string;
  productName: string;
  brand: string;
  sku: string;
  mrp: number;
  sellingPrice: number;
  quantity: number;
}

interface QuoteItem {
  id: string;
  productId: string;
  productName: string;
  brand: string;
  sku: string;
  mrp: number;
  sellingPrice: number;
  quantity: number;
}

interface Quote {
  id: string;
  quoteNumber: string;
  name: string;
  phone: string;
  company: string | null;
  address: string | null;
  items: QuoteItem[];
  subtotal: number;
  gst: number;
  total: number;
  status: QuoteStatus;
  notes: string | null;
  createdAt: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function emptyRow(): QuoteItemRow {
  return {
    key: crypto.randomUUID(),
    productId: "",
    productName: "",
    brand: "",
    sku: "",
    mrp: 0,
    sellingPrice: 0,
    quantity: 1,
  };
}

function computeTotals(items: QuoteItemRow[]) {
  const subtotal = items.reduce((s, i) => s + i.sellingPrice * i.quantity, 0);
  const gst = parseFloat((subtotal * 0.18).toFixed(2));
  const total = parseFloat((subtotal + gst).toFixed(2));
  const totalSavings = items.reduce((s, i) => s + (i.mrp - i.sellingPrice) * i.quantity, 0);
  return { subtotal, gst, total, totalSavings };
}

function generateQuoteHTML(quote: Quote) {
  const date = new Date(quote.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const rows = quote.items
    .map(
      (item, i) => `
      <tr>
        <td style="padding:10px 8px;border-bottom:1px solid #eee;font-size:13px;">${i + 1}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #eee;font-size:13px;">
          ${item.productName}<br/>
          <span style="color:#888;font-size:11px;">${item.brand} | SKU: ${item.sku}</span>
        </td>
        <td style="padding:10px 8px;border-bottom:1px solid #eee;font-size:13px;text-align:right;">₹${item.mrp.toFixed(2)}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #eee;font-size:13px;text-align:right;color:#16a34a;font-weight:600;">₹${item.sellingPrice.toFixed(2)}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #eee;font-size:13px;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #eee;font-size:13px;text-align:right;">₹${(item.sellingPrice * item.quantity).toFixed(2)}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #eee;font-size:12px;text-align:right;color:#16a34a;">${Math.round(((item.mrp - item.sellingPrice) / item.mrp) * 100)}% off</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head><title>Quote ${quote.quoteNumber}</title></head>
<body style="font-family:'Segoe UI',sans-serif;max-width:750px;margin:0 auto;padding:40px 20px;color:#222;">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:30px;">
    <div>
      <h1 style="margin:0;font-size:24px;color:#0a0a0a;">IndustryNeed</h1>
      <p style="margin:4px 0 0;color:#d4860b;font-size:13px;font-weight:600;">Industrial Supplies, Delivered in 2 Hours</p>
    </div>
    <div style="text-align:right;">
      <h2 style="margin:0;font-size:20px;color:#0a0a0a;">QUOTATION</h2>
      <p style="margin:4px 0 0;font-size:13px;color:#666;">${quote.quoteNumber}</p>
      <p style="margin:2px 0 0;font-size:13px;color:#666;">${date}</p>
    </div>
  </div>

  <hr style="border:none;border-top:2px solid #d4860b;margin:0 0 25px;"/>

  <div style="margin-bottom:30px;">
    <p style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">Prepared For</p>
    <p style="margin:0;font-weight:600;">${quote.name}</p>
    <p style="margin:2px 0;color:#555;font-size:13px;">${quote.phone}</p>
    ${quote.company ? `<p style="margin:2px 0;color:#555;font-size:13px;">${quote.company}</p>` : ""}
    ${quote.address ? `<p style="margin:2px 0;color:#555;font-size:13px;">${quote.address}</p>` : ""}
  </div>

  <table style="width:100%;border-collapse:collapse;margin-bottom:25px;">
    <thead>
      <tr style="background:#f5f2ed;">
        <th style="padding:10px 8px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#666;">#</th>
        <th style="padding:10px 8px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#666;">Item</th>
        <th style="padding:10px 8px;text-align:right;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#666;">MRP</th>
        <th style="padding:10px 8px;text-align:right;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#666;">Our Price</th>
        <th style="padding:10px 8px;text-align:center;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#666;">Qty</th>
        <th style="padding:10px 8px;text-align:right;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#666;">Total</th>
        <th style="padding:10px 8px;text-align:right;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#666;">Savings</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div style="display:flex;justify-content:flex-end;">
    <div style="width:280px;">
      <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;color:#555;">
        <span>Subtotal</span><span>₹${quote.subtotal.toFixed(2)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;color:#555;">
        <span>GST (18%)</span><span>₹${quote.gst.toFixed(2)}</span>
      </div>
      <hr style="border:none;border-top:1px solid #ddd;margin:6px 0;"/>
      <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:16px;font-weight:700;color:#d4860b;">
        <span>Grand Total</span><span>₹${quote.total.toFixed(2)}</span>
      </div>
    </div>
  </div>

  <hr style="border:none;border-top:1px solid #eee;margin:30px 0 15px;"/>
  <p style="font-size:12px;color:#888;">This quotation is valid for <strong>7 days</strong> from the date of issue.</p>
  <p style="text-align:center;font-size:11px;color:#999;margin-top:20px;">IndustryNeed — Delhi NCR | WhatsApp: +91 ${BUSINESS_PHONE.slice(-10, -5)} ${BUSINESS_PHONE.slice(-5)}</p>
</body>
</html>`;
}

function downloadQuotePDF(quote: Quote) {
  const html = generateQuoteHTML(quote);
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  }
}

function buildWhatsAppLink(quote: Quote): string {
  const itemLines = quote.items
    .map(
      (item, i) =>
        `${i + 1}. ${item.productName} (${item.brand}) x${item.quantity} — ${formatCurrency(item.sellingPrice * item.quantity)}`
    )
    .join("\n");

  const message = `Hi ${quote.name}! Here's your quote from *IndustryNeed*:\n\n📋 Quote #: ${quote.quoteNumber}\n\n${itemLines}\n\nSubtotal: ${formatCurrency(quote.subtotal)}\nGST (18%): ${formatCurrency(quote.gst)}\n*Total: ${formatCurrency(quote.total)}*\n\n✅ This quote is valid for 7 days.\nReply *YES* to confirm your order!`;

  return `https://wa.me/91${quote.phone}?text=${encodeURIComponent(message)}`;
}

// ─── Product Search Input ────────────────────────────────────────────────────

function ProductSearchInput({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (product: ProductResult) => void;
}) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<ProductResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleChange(val: string) {
    setQuery(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (val.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(val.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setShowDropdown(data.length > 0);
        }
      } catch {
        // ignore
      }
    }, 300);
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => results.length > 0 && setShowDropdown(true)}
        placeholder="Search product..."
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4860b]/30 focus:border-[#d4860b] transition-colors"
      />
      {showDropdown && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => {
                onSelect(product);
                setQuery(product.name);
                setShowDropdown(false);
              }}
              className="w-full text-left px-3 py-2.5 hover:bg-[#f5f2ed] transition-colors border-b border-gray-50 last:border-0"
            >
              <p className="text-sm font-medium text-[#0a0a0a]">{product.name}</p>
              <p className="text-xs text-[#6b7280]">
                {product.brand} &middot; SKU: {product.sku} &middot; MRP: {formatCurrency(product.mrp)} &middot;{" "}
                <span className="text-green-600 font-semibold">{formatCurrency(product.sellingPrice)}</span>
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Quote Form ──────────────────────────────────────────────────────────────

function QuoteForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<QuoteItemRow[]>([emptyRow()]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { subtotal, gst, total, totalSavings } = computeTotals(
    items.filter((i) => i.productId)
  );

  function handleProductSelect(index: number, product: ProductResult) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              productId: product.id,
              productName: product.name,
              brand: product.brand,
              sku: product.sku,
              mrp: product.mrp,
              sellingPrice: product.sellingPrice,
            }
          : item
      )
    );
  }

  function updateQuantity(index: number, qty: number) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity: Math.max(1, qty) } : item))
    );
  }

  function updateSellingPrice(index: number, price: number) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, sellingPrice: Math.max(0, price) } : item))
    );
  }

  function removeRow(index: number) {
    setItems((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  }

  function resetForm() {
    setName("");
    setPhone("");
    setCompany("");
    setAddress("");
    setNotes("");
    setItems([emptyRow()]);
  }

  async function handleSave() {
    const validItems = items.filter((i) => i.productId);
    if (!name.trim() || !phone.trim() || validItems.length === 0) {
      setMessage({ type: "error", text: "Please fill customer name, phone, and add at least one product." });
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          company: company.trim() || undefined,
          address: address.trim() || undefined,
          notes: notes.trim() || undefined,
          items: validItems.map((i) => ({
            productId: i.productId,
            productName: i.productName,
            brand: i.brand,
            sku: i.sku,
            mrp: i.mrp,
            sellingPrice: i.sellingPrice,
            quantity: i.quantity,
          })),
        }),
      });
      if (res.ok) {
        resetForm();
        setMessage({ type: "success", text: "Quote created successfully!" });
        onCreated();
      } else {
        const data = await res.json().catch(() => null);
        setMessage({ type: "error", text: data?.error ?? `Failed to save quote (${res.status})` });
      }
    } catch (err) {
      if (process.env.NODE_ENV !== "production") console.error("Save quote error:", err);
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  const canSave = name.trim().length > 0 && phone.trim().length >= 10 && items.some((i) => i.productId && i.sellingPrice > 0);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
        <FileText size={18} className="text-[#d4860b]" />
        <h2 className="text-base font-semibold text-[#0a0a0a]">Create New Quote</h2>
      </div>

      <div className="p-6">
        {/* Customer Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-1.5">
              Customer Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4860b]/30 focus:border-[#d4860b]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-1.5">
              Phone *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="10-digit number"
              maxLength={10}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4860b]/30 focus:border-[#d4860b]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-1.5">
              Company
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Optional"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4860b]/30 focus:border-[#d4860b]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-1.5">
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Delivery address"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4860b]/30 focus:border-[#d4860b]"
            />
          </div>
        </div>

        {/* Product Rows */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
              Products
            </p>
            <button
              type="button"
              onClick={() => setItems((prev) => [...prev, emptyRow()])}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#d4860b] hover:text-[#b8720a] transition-colors"
            >
              <Plus size={14} /> Add Row
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={item.key}
                className="grid grid-cols-12 gap-2 items-start bg-[#f9fafb] rounded-lg p-3"
              >
                {/* Product search */}
                <div className="col-span-12 sm:col-span-4">
                  <ProductSearchInput
                    value={item.productName}
                    onSelect={(p) => handleProductSelect(index, p)}
                  />
                </div>
                {/* Brand + SKU (read-only) */}
                <div className="col-span-6 sm:col-span-2">
                  <input
                    type="text"
                    value={item.brand}
                    readOnly
                    placeholder="Brand"
                    className="w-full px-2 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50 text-[#6b7280]"
                  />
                </div>
                {/* MRP (read-only) */}
                <div className="col-span-3 sm:col-span-1">
                  <input
                    type="text"
                    value={item.mrp ? `₹${item.mrp}` : ""}
                    readOnly
                    placeholder="MRP"
                    className="w-full px-2 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50 text-[#6b7280] line-through"
                  />
                </div>
                {/* Selling Price (editable) */}
                <div className="col-span-3 sm:col-span-2">
                  <input
                    type="number"
                    value={item.sellingPrice || ""}
                    onChange={(e) => updateSellingPrice(index, parseFloat(e.target.value) || 0)}
                    placeholder="Price"
                    min={0}
                    className="w-full px-2 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4860b]/30 font-semibold text-green-700"
                  />
                </div>
                {/* Quantity */}
                <div className="col-span-4 sm:col-span-1">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
                    min={1}
                    className="w-full px-2 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4860b]/30 text-center"
                  />
                </div>
                {/* Line total + savings */}
                <div className="col-span-6 sm:col-span-1 flex flex-col items-end justify-center">
                  {item.productId && (
                    <>
                      <span className="text-xs font-bold text-[#0a0a0a]">
                        {formatCurrency(item.sellingPrice * item.quantity)}
                      </span>
                      {item.mrp > item.sellingPrice && (
                        <span className="text-[10px] text-green-600 font-semibold">
                          Save {Math.round(((item.mrp - item.sellingPrice) / item.mrp) * 100)}%
                        </span>
                      )}
                    </>
                  )}
                </div>
                {/* Remove */}
                <div className="col-span-2 sm:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    className="p-1.5 text-[#6b7280] hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-1.5">
            Internal Notes
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes (not shown to customer)"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4860b]/30 focus:border-[#d4860b]"
          />
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Pricing Summary + Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pt-4 border-t border-gray-100">
          {/* Totals */}
          <div className="w-full sm:w-64 space-y-1.5">
            <div className="flex justify-between text-sm text-[#6b7280]">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {totalSavings > 0 && (
              <div className="flex justify-between text-sm text-green-600 font-medium">
                <span>Total Savings</span>
                <span>-{formatCurrency(totalSavings)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-[#6b7280]">
              <span>GST (18%)</span>
              <span>{formatCurrency(gst)}</span>
            </div>
            <div className="border-t border-gray-200 pt-1.5 flex justify-between text-lg font-bold text-[#d4860b]">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave || saving}
            className="px-6 py-2.5 bg-[#0a0a0a] text-white text-sm font-semibold rounded-xl hover:bg-[#2c3038] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FileText size={16} />
            )}
            {saving ? "Saving..." : "Save Quote"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Quote List ──────────────────────────────────────────────────────────────

type FilterTab = "all" | "draft" | "sent" | "accepted" | "converted";

function QuoteList({
  quotes,
  onRefresh,
}: {
  quotes: Quote[];
  onRefresh: () => void;
}) {
  const [filter, setFilter] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [converting, setConverting] = useState<string | null>(null);

  const filtered = quotes
    .filter((q) => {
      if (filter === "all") return true;
      return q.status === filter;
    })
    .filter((q) => {
      if (!search.trim()) return true;
      const s = search.toLowerCase();
      return (
        q.quoteNumber.toLowerCase().includes(s) ||
        q.name.toLowerCase().includes(s) ||
        q.phone.includes(s)
      );
    });

  const updateStatus = useCallback(
    async (id: string, status: QuoteStatus) => {
      try {
        await fetch(`/api/quotes/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
        onRefresh();
      } catch (err) {
        if (process.env.NODE_ENV !== "production") console.error("Status update error:", err);
      }
    },
    [onRefresh]
  );

  async function handleConvert(id: string) {
    setConverting(id);
    try {
      const res = await fetch(`/api/quotes/${id}/convert`, { method: "POST" });
      if (res.ok) {
        onRefresh();
      } else {
        const data = await res.json();
        alert(data.error ?? "Conversion failed");
      }
    } catch (err) {
      if (process.env.NODE_ENV !== "production") console.error("Convert error:", err);
      alert("Failed to convert quote");
    } finally {
      setConverting(null);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-[#0a0a0a]">All Quotes</h2>
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, quote #"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#d4860b]/30 focus:border-[#d4860b] transition-colors"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-3 border-b border-gray-50 flex gap-2 overflow-x-auto">
        {(
          [
            { key: "all", label: "All" },
            { key: "draft", label: "Draft" },
            { key: "sent", label: "Sent" },
            { key: "accepted", label: "Accepted" },
            { key: "converted", label: "Converted" },
          ] as { key: FilterTab; label: string }[]
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              filter === tab.key
                ? "bg-[#0a0a0a] text-white"
                : "bg-white text-[#6b7280] hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-[#6b7280]">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No quotes match your filters</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {filtered.map((quote) => (
            <div key={quote.id}>
              {/* Row */}
              <div
                className="px-6 py-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => setExpandedId(expandedId === quote.id ? null : quote.id)}
              >
                <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-3 items-center">
                  <div>
                    <p className="font-mono text-xs font-bold text-[#d4860b]">
                      {quote.quoteNumber}
                    </p>
                    <p className="text-sm font-medium text-[#0a0a0a] mt-0.5">{quote.name}</p>
                  </div>
                  <div className="hidden md:block text-sm text-[#6b7280]">{quote.phone}</div>
                  <div className="text-sm font-bold text-[#0a0a0a]">
                    {formatCurrency(quote.total)}
                  </div>
                  <div>
                    <select
                      value={quote.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateStatus(quote.id, e.target.value as QuoteStatus);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      disabled={quote.status === "converted"}
                      className={`text-xs px-2.5 py-1.5 rounded-lg font-semibold border cursor-pointer disabled:cursor-not-allowed ${
                        QUOTE_STATUS_BADGE_CLASSES[quote.status] ?? "bg-gray-100"
                      }`}
                    >
                      {QUOTE_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#6b7280]">
                      {new Date(quote.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                    {expandedId === quote.id ? (
                      <ChevronUp className="w-4 h-4 text-[#6b7280] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#6b7280] shrink-0" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded */}
              {expandedId === quote.id && (
                <div className="border-t border-gray-100 px-6 py-5 bg-[#f9fafb]">
                  {/* Customer info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                    <div className="flex items-start gap-2">
                      <Phone size={14} className="text-[#6b7280] mt-0.5" />
                      <div>
                        <p className="text-xs text-[#9ca3af] uppercase tracking-wider">Phone</p>
                        <p className="text-sm font-medium">{quote.phone}</p>
                      </div>
                    </div>
                    {quote.company && (
                      <div>
                        <p className="text-xs text-[#9ca3af] uppercase tracking-wider">Company</p>
                        <p className="text-sm">{quote.company}</p>
                      </div>
                    )}
                    {quote.address && (
                      <div>
                        <p className="text-xs text-[#9ca3af] uppercase tracking-wider">Address</p>
                        <p className="text-sm">{quote.address}</p>
                      </div>
                    )}
                  </div>

                  {/* Items table */}
                  <div className="bg-white rounded-lg border border-gray-100 overflow-hidden mb-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-[#9ca3af] uppercase tracking-wider bg-gray-50">
                          <th className="px-4 py-2.5">Product</th>
                          <th className="px-4 py-2.5 text-right">MRP</th>
                          <th className="px-4 py-2.5 text-right">Our Price</th>
                          <th className="px-4 py-2.5 text-center">Qty</th>
                          <th className="px-4 py-2.5 text-right">Total</th>
                          <th className="px-4 py-2.5 text-right">Savings</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {quote.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-2.5">
                              <p className="font-medium text-[#0a0a0a]">{item.productName}</p>
                              <p className="text-xs text-[#9ca3af]">
                                {item.brand} &middot; SKU: {item.sku}
                              </p>
                            </td>
                            <td className="px-4 py-2.5 text-right text-[#6b7280] line-through text-xs">
                              {formatCurrency(item.mrp)}
                            </td>
                            <td className="px-4 py-2.5 text-right font-semibold text-green-700">
                              {formatCurrency(item.sellingPrice)}
                            </td>
                            <td className="px-4 py-2.5 text-center">{item.quantity}</td>
                            <td className="px-4 py-2.5 text-right font-semibold">
                              {formatCurrency(item.sellingPrice * item.quantity)}
                            </td>
                            <td className="px-4 py-2.5 text-right text-green-600 text-xs font-semibold">
                              {item.mrp > item.sellingPrice
                                ? `${Math.round(((item.mrp - item.sellingPrice) / item.mrp) * 100)}% off`
                                : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="border-t border-gray-200">
                        <tr className="text-xs text-[#6b7280]">
                          <td colSpan={4} className="px-4 py-1.5 text-right">Subtotal</td>
                          <td className="px-4 py-1.5 text-right">{formatCurrency(quote.subtotal)}</td>
                          <td />
                        </tr>
                        <tr className="text-xs text-[#6b7280]">
                          <td colSpan={4} className="px-4 py-1.5 text-right">GST (18%)</td>
                          <td className="px-4 py-1.5 text-right">{formatCurrency(quote.gst)}</td>
                          <td />
                        </tr>
                        <tr className="font-bold text-[#0a0a0a]">
                          <td colSpan={4} className="px-4 py-2 text-right">Total</td>
                          <td className="px-4 py-2 text-right text-[#d4860b]">
                            {formatCurrency(quote.total)}
                          </td>
                          <td />
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => downloadQuotePDF(quote)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] text-white text-xs font-semibold rounded-lg hover:bg-[#2c3038] transition-colors"
                    >
                      <Download size={14} />
                      Download PDF
                    </button>
                    <a
                      href={buildWhatsAppLink(quote)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        if (quote.status === "draft") updateStatus(quote.id, "sent");
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white text-xs font-semibold rounded-lg hover:bg-[#1fb858] transition-colors"
                    >
                      <MessageCircle size={14} />
                      Send via WhatsApp
                    </a>
                    {quote.status === "sent" && (
                      <>
                        <button
                          onClick={() => updateStatus(quote.id, "accepted")}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle size={14} />
                          Mark Accepted
                        </button>
                        <button
                          onClick={() => updateStatus(quote.id, "rejected")}
                          className="inline-flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <XCircle size={14} />
                          Mark Rejected
                        </button>
                      </>
                    )}
                    {quote.status === "accepted" && (
                      <button
                        onClick={() => handleConvert(quote.id)}
                        disabled={converting === quote.id}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-xs font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                      >
                        {converting === quote.id ? (
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <ArrowRight size={14} />
                        )}
                        Mark as Paid & Convert to Order
                      </button>
                    )}
                  </div>

                  {quote.notes && (
                    <p className="mt-3 text-xs text-[#9ca3af] italic">Note: {quote.notes}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuotes = useCallback(async () => {
    try {
      const res = await fetch("/api/quotes");
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      setQuotes(data);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") console.error("Fetch quotes error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4860b]" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0a0a0a] flex items-center gap-2">
          <FileText className="w-6 h-6 text-[#d4860b]" /> Quote Maker
        </h1>
        <p className="text-sm text-[#6b7280] mt-1">
          Create transparent quotes, generate PDF, and send to customers via WhatsApp
        </p>
      </div>

      <QuoteForm onCreated={fetchQuotes} />
      <QuoteList quotes={quotes} onRefresh={fetchQuotes} />
    </div>
  );
}
