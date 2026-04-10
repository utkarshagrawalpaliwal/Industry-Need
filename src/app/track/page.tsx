"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Phone,
  Package,
  CheckCircle,
  Clock,
  Truck,
  ArrowRight,
  FileText,
  RotateCcw,
  Download,
  MessageCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { OrderStatus, PaymentStatus } from "@/types";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    sku: string;
    brand: string;
  };
};

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  company: string | null;
  address: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  gst: number;
  total: number;
  createdAt: string;
  items: OrderItem[];
};

const STATUS_CONFIG: Record<
  string,
  { label: string; icon: typeof Clock; color: string; bg: string }
> = {
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  packed: {
    label: "Packed",
    icon: Package,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  dispatched: {
    label: "Dispatched",
    icon: Truck,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    icon: Truck,
    color: "text-[#d4860b]",
    bg: "bg-amber-50",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50",
  },
};

const STATUS_STEPS = ["confirmed", "packed", "dispatched", "out_for_delivery", "delivered"];

const PAYMENT_BADGE: Record<string, { label: string; className: string }> = {
  pending: { label: "Payment Pending", className: "bg-yellow-100 text-yellow-800" },
  paid: { label: "Paid", className: "bg-green-100 text-green-800" },
  refunded: { label: "Refunded", className: "bg-gray-100 text-gray-700" },
};

function generateInvoiceHTML(order: Order) {
  const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const itemsRows = order.items
    .map(
      (item, i) => `
      <tr>
        <td style="padding:10px 8px;border-bottom:1px solid #eee;font-size:13px;">${i + 1}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #eee;font-size:13px;">
          ${item.product?.name ?? "Product"}<br/>
          <span style="color:#888;font-size:11px;">${item.product?.brand ?? ""} | SKU: ${item.product?.sku ?? ""}</span>
        </td>
        <td style="padding:10px 8px;border-bottom:1px solid #eee;font-size:13px;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #eee;font-size:13px;text-align:right;">₹${item.price.toFixed(2)}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #eee;font-size:13px;text-align:right;">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head><title>Invoice ${order.orderNumber}</title></head>
<body style="font-family:'Segoe UI',sans-serif;max-width:700px;margin:0 auto;padding:40px 20px;color:#222;">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:30px;">
    <div>
      <h1 style="margin:0;font-size:24px;color:#0a0a0a;">IndustryNeed</h1>
      <p style="margin:4px 0 0;color:#d4860b;font-size:13px;font-weight:600;">Industrial Supplies, Delivered in 2 Hours</p>
    </div>
    <div style="text-align:right;">
      <h2 style="margin:0;font-size:20px;color:#0a0a0a;">INVOICE</h2>
      <p style="margin:4px 0 0;font-size:13px;color:#666;">${order.orderNumber}</p>
      <p style="margin:2px 0 0;font-size:13px;color:#666;">${date}</p>
    </div>
  </div>

  <hr style="border:none;border-top:2px solid #d4860b;margin:0 0 25px;"/>

  <div style="display:flex;justify-content:space-between;margin-bottom:30px;">
    <div>
      <p style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">Bill To</p>
      <p style="margin:0;font-weight:600;">${order.customerName}</p>
      <p style="margin:2px 0;color:#555;font-size:13px;">${order.customerPhone}</p>
      ${order.company ? `<p style="margin:2px 0;color:#555;font-size:13px;">${order.company}</p>` : ""}
      <p style="margin:2px 0;color:#555;font-size:13px;">${order.address}</p>
    </div>
    <div style="text-align:right;">
      <p style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">Status</p>
      <p style="margin:0;font-weight:600;color:#16a34a;">${order.paymentStatus === "paid" ? "PAID" : order.paymentStatus.toUpperCase()}</p>
    </div>
  </div>

  <table style="width:100%;border-collapse:collapse;margin-bottom:25px;">
    <thead>
      <tr style="background:#f5f2ed;">
        <th style="padding:10px 8px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#666;">#</th>
        <th style="padding:10px 8px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#666;">Item</th>
        <th style="padding:10px 8px;text-align:center;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#666;">Qty</th>
        <th style="padding:10px 8px;text-align:right;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#666;">Price</th>
        <th style="padding:10px 8px;text-align:right;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#666;">Total</th>
      </tr>
    </thead>
    <tbody>${itemsRows}</tbody>
  </table>

  <div style="display:flex;justify-content:flex-end;">
    <div style="width:250px;">
      <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;color:#555;">
        <span>Subtotal</span><span>₹${order.subtotal.toFixed(2)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;color:#555;">
        <span>GST</span><span>₹${order.gst.toFixed(2)}</span>
      </div>
      <hr style="border:none;border-top:1px solid #ddd;margin:6px 0;"/>
      <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:16px;font-weight:700;color:#d4860b;">
        <span>Total</span><span>₹${order.total.toFixed(2)}</span>
      </div>
    </div>
  </div>

  <hr style="border:none;border-top:1px solid #eee;margin:30px 0 15px;"/>
  <p style="text-align:center;font-size:11px;color:#999;">Thank you for your business! — IndustryNeed, Delhi NCR</p>
</body>
</html>`;
}

function downloadInvoice(order: Order) {
  const html = generateInvoiceHTML(order);
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  }
}

function OrderCard({ order, index }: { order: Order; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const statusConfig = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.confirmed;
  const StatusIcon = statusConfig.icon;
  const badge = PAYMENT_BADGE[order.paymentStatus] ?? PAYMENT_BADGE.pending;
  const currentStepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Compact header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-5 flex items-center gap-4 text-left"
      >
        {/* Status icon */}
        <div className={`w-11 h-11 rounded-xl ${statusConfig.bg} flex items-center justify-center shrink-0`}>
          <StatusIcon size={20} className={statusConfig.color} />
        </div>

        {/* Order info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[#0a0a0a] text-sm">{order.orderNumber}</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${badge.className}`}>
              {badge.label}
            </span>
          </div>
          <p className="text-xs text-[#6b7280] mt-0.5">
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}{" "}
            &middot; {order.items.length} item{order.items.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Total + chevron */}
        <div className="text-right shrink-0 flex items-center gap-3">
          <span className="font-bold text-[#d4860b] text-lg">{formatCurrency(order.total)}</span>
          <motion.div
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowRight size={16} className="text-[#6b7280]" />
          </motion.div>
        </div>
      </button>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 border-t border-gray-100">
              {/* Status timeline — horizontal */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-4">
                  Tracking Status
                </p>
                <div className="flex items-center">
                  {STATUS_STEPS.map((step, i) => {
                    const isCompleted = i <= currentStepIndex;
                    const isCurrent = i === currentStepIndex;
                    const config = STATUS_CONFIG[step];
                    return (
                      <div key={step} className="flex items-center flex-1 last:flex-none">
                        {/* Dot */}
                        <div className="flex flex-col items-center">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                              isCompleted
                                ? "bg-green-500 border-green-500"
                                : "bg-white border-gray-200"
                            } ${isCurrent ? "ring-4 ring-green-100" : ""}`}
                          >
                            {isCompleted && (
                              <CheckCircle size={14} className="text-white" />
                            )}
                          </motion.div>
                          <span className={`text-[10px] mt-1.5 whitespace-nowrap ${
                            isCompleted ? "text-green-600 font-semibold" : "text-[#9ca3af]"
                          }`}>
                            {config.label}
                          </span>
                        </div>
                        {/* Connector line */}
                        {i < STATUS_STEPS.length - 1 && (
                          <div className="flex-1 h-0.5 mx-1 mt-[-18px]">
                            <motion.div
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ delay: i * 0.1, duration: 0.3 }}
                              className={`h-full origin-left ${
                                i < currentStepIndex ? "bg-green-500" : "bg-gray-200"
                              }`}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items table */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-3">
                  Order Items
                </p>
                <div className="bg-[#f9fafb] rounded-xl overflow-hidden">
                  {order.items.map((item, i) => (
                    <div
                      key={item.id}
                      className={`flex justify-between items-center px-4 py-3 ${
                        i < order.items.length - 1 ? "border-b border-gray-100" : ""
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium text-[#0a0a0a]">
                          {item.product?.name ?? "Product"}
                        </p>
                        <p className="text-xs text-[#6b7280]">
                          {item.product?.brand} &middot; SKU: {item.product?.sku} &middot; Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-[#2c3038] whitespace-nowrap ml-4">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="flex justify-end mb-5">
                <div className="w-56 space-y-1.5">
                  <div className="flex justify-between text-sm text-[#6b7280]">
                    <span>Subtotal</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#6b7280]">
                    <span>GST</span>
                    <span>{formatCurrency(order.gst)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-1.5 flex justify-between text-base font-bold text-[#d4860b]">
                    <span>Total</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => downloadInvoice(order)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0a0a0a] text-white text-sm font-semibold rounded-xl hover:bg-[#2c3038] transition-colors"
                >
                  <Download size={15} />
                  Download Invoice
                </button>
                <a
                  href={`https://wa.me/919999999999?text=Hi!%20I%20have%20a%20query%20about%20order%20${order.orderNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-[#2c3038] text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw size={15} />
                  Request Return
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function TrackPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = phone.trim();
    if (!q || q.length < 10) return;

    setLoading(true);
    setSearched(false);
    setOrders(null);

    try {
      const res = await fetch(`/api/orders/track?phone=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (res.ok) {
        setOrders(Array.isArray(data) ? data : data ? [data] : []);
      } else {
        setOrders([]);
      }
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f2ed]">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-[#0a0a0a] mb-3">
            Track Your Orders
          </h1>
          <p className="text-[#6b7280] text-lg">
            Enter your registered mobile number to view all orders
          </p>
        </motion.div>

        {/* Phone input */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSearch}
          className="mb-10"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 flex items-center gap-2">
            <div className="flex items-center gap-2 pl-4 text-[#6b7280]">
              <Phone size={18} />
              <span className="text-sm font-medium">+91</span>
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                setPhone(val);
              }}
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
              className="flex-1 py-3 px-2 text-[#0a0a0a] text-base placeholder-[#9ca3af] focus:outline-none bg-transparent"
            />
            <button
              type="submit"
              disabled={loading || phone.length < 10}
              className="px-6 py-3 bg-[#d4860b] text-white rounded-xl font-semibold text-sm hover:bg-[#b8720a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search size={16} />
              )}
              {loading ? "Searching..." : "Find Orders"}
            </button>
          </div>
        </motion.form>

        {/* Loading state */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center py-16 text-[#6b7280]"
          >
            <div className="w-10 h-10 border-4 border-[#f0c96e] border-t-[#d4860b] rounded-full animate-spin mb-4" />
            <p className="text-sm">Looking up your orders...</p>
          </motion.div>
        )}

        {/* Results */}
        {!loading && searched && orders !== null && (
          <>
            {orders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center py-12 text-center"
              >
                {/* Animated illustration */}
                <div className="relative mb-8">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 w-32 h-32 rounded-full bg-[#d4860b]/20 blur-xl"
                  />
                  <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#d4860b]/10 to-[#f0c96e]/10 border border-[#d4860b]/20 flex items-center justify-center">
                    <Package size={48} className="text-[#d4860b]" />
                  </div>
                </div>

                <h2 className="font-serif text-2xl font-bold text-[#0a0a0a] mb-2">
                  No orders yet!
                </h2>
                <p className="text-[#6b7280] text-base max-w-sm mb-8">
                  Looks like you haven&apos;t placed any orders with this number.
                  Getting started is as easy as sending a message.
                </p>

                {/* How to order — mini flowchart */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 w-full max-w-md mb-8">
                  <p className="text-xs font-bold text-[#d4860b] uppercase tracking-widest mb-5">
                    How to place your first order
                  </p>
                  <div className="flex flex-col gap-4">
                    {[
                      { step: "1", text: "Send your parts list on WhatsApp", icon: "💬" },
                      { step: "2", text: "Get a transparent quote in 10 min", icon: "📋" },
                      { step: "3", text: "Confirm & get it delivered in 2 hrs", icon: "🚀" },
                    ].map((item, i) => (
                      <motion.div
                        key={item.step}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.15 }}
                        className="flex items-center gap-4"
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <div className="flex-1 text-left">
                          <span className="text-sm text-[#0a0a0a] font-medium">{item.text}</span>
                        </div>
                        {i < 2 && (
                          <ArrowRight size={14} className="text-[#d4860b]/40 rotate-90 sm:rotate-0" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://wa.me/919999999999?text=Hi!%20I%20need%20industrial%20supplies."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#1fb858] transition-colors"
                  >
                    <MessageCircle size={18} />
                    WhatsApp Us Now
                  </a>
                  <a
                    href="tel:+919999999999"
                    className="inline-flex items-center justify-center gap-2 border-2 border-[#0a0a0a] text-[#0a0a0a] font-semibold px-6 py-3 rounded-xl hover:bg-[#0a0a0a] hover:text-white transition-colors"
                  >
                    <Phone size={18} />
                    Call to Order
                  </a>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-[#6b7280] font-medium"
                >
                  Found {orders.length} order{orders.length !== 1 ? "s" : ""} for +91 {phone}
                </motion.p>
                {orders.map((order, i) => (
                  <OrderCard key={order.id} order={order} index={i} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Initial empty state */}
        {!loading && !searched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center py-16 text-center text-[#6b7280]"
          >
            <div className="w-16 h-16 rounded-full bg-[#d4860b]/10 flex items-center justify-center mb-4">
              <FileText size={28} className="text-[#d4860b]" />
            </div>
            <p className="text-sm max-w-xs">
              Enter your phone number above to view your orders, track deliveries, and download invoices.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
