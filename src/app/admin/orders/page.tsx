"use client";

import { useState, useEffect } from "react";
import {
  Truck,
  ChevronDown,
  ChevronUp,
  Phone,
  MapPin,
  Calendar,
  MessageCircle,
  Search,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { ORDER_STATUSES, PAYMENT_STATUSES, OrderStatus, PaymentStatus } from "@/types";
import { STATUS_BADGE_CLASSES, PAYMENT_BADGE_CLASSES } from "@/lib/constants";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: { name: string; brand: string; sku: string };
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  company: string | null;
  address: string;
  items: OrderItem[];
  subtotal: number;
  gst: number;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}


type FilterTab = "all" | "active" | "delivered" | "returned";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrder = async (
    id: string,
    updates: { status?: OrderStatus; paymentStatus?: PaymentStatus }
  ) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      fetchOrders();
    } catch (err) {
      if (process.env.NODE_ENV !== "production") console.error("Order update error:", err);
      alert("Failed to update order");
    }
  };

  // Filter orders
  const filteredOrders = orders
    .filter((o) => {
      if (filter === "active")
        return !["delivered", "returned"].includes(o.status);
      if (filter === "delivered") return o.status === "delivered";
      if (filter === "returned") return o.status === "returned";
      return true;
    })
    .filter((o) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
      );
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const activeCount = orders.filter(
    (o) => !["delivered", "returned"].includes(o.status)
  ).length;

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
            <Truck className="w-6 h-6 text-[#d4860b]" /> Orders
          </h1>
          <p className="text-sm text-[#6b7280] mt-1">
            {orders.length} total &middot; {activeCount} active
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, order #"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#d4860b]/30 focus:border-[#d4860b] transition-colors"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(
          [
            { key: "all", label: "All" },
            { key: "active", label: "Active" },
            { key: "delivered", label: "Delivered" },
            { key: "returned", label: "Returned" },
          ] as { key: FilterTab; label: string }[]
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.key
                ? "bg-[#0a0a0a] text-white"
                : "bg-white text-[#6b7280] hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 text-[#6b7280]">
          <Truck className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>No orders match your filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm"
            >
              {/* Order row */}
              <div
                className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() =>
                  setExpandedOrder(
                    expandedOrder === order.id ? null : order.id
                  )
                }
              >
                <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-3 items-center">
                  {/* Order # + Customer */}
                  <div>
                    <p className="font-mono text-xs font-bold text-[#d4860b]">
                      {order.orderNumber}
                    </p>
                    <p className="text-sm font-medium text-[#0a0a0a] mt-0.5">
                      {order.customerName}
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="hidden md:block">
                    <p className="text-sm text-[#6b7280]">
                      {order.customerPhone}
                    </p>
                  </div>

                  {/* Total */}
                  <div>
                    <p className="text-sm font-bold text-[#0a0a0a]">
                      {formatCurrency(order.total)}
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <select
                      value={order.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateOrder(order.id, { status: e.target.value as OrderStatus });
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className={`text-xs px-2.5 py-1.5 rounded-lg font-semibold border cursor-pointer ${
                        STATUS_BADGE_CLASSES[order.status] ?? "bg-gray-100"
                      }`}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Payment + Chevron */}
                  <div className="flex items-center gap-2">
                    <select
                      value={order.paymentStatus}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateOrder(order.id, {
                          paymentStatus: e.target.value as PaymentStatus,
                        });
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className={`text-xs px-2.5 py-1.5 rounded-lg font-semibold border cursor-pointer ${
                        PAYMENT_BADGE_CLASSES[order.paymentStatus] ?? "bg-gray-100"
                      }`}
                    >
                      {PAYMENT_STATUSES.map((p) => (
                        <option key={p} value={p}>
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </option>
                      ))}
                    </select>
                    {expandedOrder === order.id ? (
                      <ChevronUp className="w-4 h-4 text-[#6b7280] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#6b7280] shrink-0" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {expandedOrder === order.id && (
                <div className="border-t border-gray-100 p-5 bg-[#f9fafb]">
                  {/* Customer details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                    <div className="flex items-start gap-2">
                      <Phone size={14} className="text-[#6b7280] mt-0.5" />
                      <div>
                        <p className="text-xs text-[#9ca3af] uppercase tracking-wider">
                          Phone
                        </p>
                        <p className="text-sm font-medium">
                          {order.customerPhone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="text-[#6b7280] mt-0.5" />
                      <div>
                        <p className="text-xs text-[#9ca3af] uppercase tracking-wider">
                          Delivery Address
                        </p>
                        <p className="text-sm">{order.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar size={14} className="text-[#6b7280] mt-0.5" />
                      <div>
                        <p className="text-xs text-[#9ca3af] uppercase tracking-wider">
                          Ordered
                        </p>
                        <p className="text-sm">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="bg-white rounded-lg border border-gray-100 overflow-hidden mb-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-[#9ca3af] uppercase tracking-wider bg-gray-50">
                          <th className="px-4 py-2.5">Product</th>
                          <th className="px-4 py-2.5">SKU</th>
                          <th className="px-4 py-2.5 text-center">Qty</th>
                          <th className="px-4 py-2.5 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {order.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-2.5">
                              <p className="font-medium text-[#0a0a0a]">
                                {item.product.name}
                              </p>
                              <p className="text-xs text-[#9ca3af]">
                                {item.product.brand}
                              </p>
                            </td>
                            <td className="px-4 py-2.5 text-[#6b7280] font-mono text-xs">
                              {item.product.sku}
                            </td>
                            <td className="px-4 py-2.5 text-center">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-2.5 text-right font-semibold">
                              {formatCurrency(item.price * item.quantity)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="border-t border-gray-200">
                        <tr className="text-xs text-[#6b7280]">
                          <td colSpan={3} className="px-4 py-1.5 text-right">
                            Subtotal
                          </td>
                          <td className="px-4 py-1.5 text-right">
                            {formatCurrency(order.subtotal)}
                          </td>
                        </tr>
                        <tr className="text-xs text-[#6b7280]">
                          <td colSpan={3} className="px-4 py-1.5 text-right">
                            GST
                          </td>
                          <td className="px-4 py-1.5 text-right">
                            {formatCurrency(order.gst)}
                          </td>
                        </tr>
                        <tr className="font-bold text-[#0a0a0a]">
                          <td colSpan={3} className="px-4 py-2 text-right">
                            Total
                          </td>
                          <td className="px-4 py-2 text-right text-[#d4860b]">
                            {formatCurrency(order.total)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Quick actions */}
                  <div className="flex gap-3">
                    <a
                      href={`https://wa.me/91${order.customerPhone}?text=Hi%20${encodeURIComponent(order.customerName)}!%20Update%20on%20your%20order%20${order.orderNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white text-xs font-semibold rounded-lg hover:bg-[#1fb858] transition-colors"
                    >
                      <MessageCircle size={14} />
                      Message Customer
                    </a>
                    <a
                      href={`tel:+91${order.customerPhone}`}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-[#2c3038] text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Phone size={14} />
                      Call
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
