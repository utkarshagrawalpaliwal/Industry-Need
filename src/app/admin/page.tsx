"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Truck, IndianRupee, Clock, CheckCircle, Package } from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";

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
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
}

const STATUS_BADGE: Record<string, string> = {
  confirmed: "bg-blue-100 text-blue-700",
  packed: "bg-purple-100 text-purple-700",
  dispatched: "bg-amber-100 text-amber-700",
  out_for_delivery: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  returned: "bg-red-100 text-red-700",
};

const PAYMENT_BADGE: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  refunded: "bg-red-100 text-red-700",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : data.orders ?? []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const today = new Date().toDateString();
  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === today
  );
  const pendingOrders = orders.filter(
    (o) => !["delivered", "returned"].includes(o.status)
  );
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + (o.total ?? 0), 0);
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 8);

  async function handleSeed() {
    setSeeding(true);
    setSeedMsg("");
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      setSeedMsg(data.message ?? "Seeded!");
      // Refresh data
      const ordersRes = await fetch("/api/orders");
      const ordersData = await ordersRes.json();
      setOrders(Array.isArray(ordersData) ? ordersData : ordersData.orders ?? []);
    } catch {
      setSeedMsg("Seed failed.");
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0a0a0a]">Dashboard</h1>
          <p className="text-sm text-[#6b7280] mt-1">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {seedMsg && (
            <span className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
              {seedMsg}
            </span>
          )}
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#2c3038] hover:bg-[#0a0a0a] transition-colors disabled:opacity-50"
          >
            {seeding ? "Seeding..." : "Seed Database"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Today's Orders"
          value={loading ? "..." : todayOrders.length}
          icon={<Package size={20} />}
        />
        <StatsCard
          title="Pending Delivery"
          value={loading ? "..." : pendingOrders.length}
          icon={<Clock size={20} />}
        />
        <StatsCard
          title="Total Delivered"
          value={loading ? "..." : deliveredCount}
          icon={<CheckCircle size={20} />}
        />
        <StatsCard
          title="Revenue (Paid)"
          value={loading ? "..." : formatCurrency(totalRevenue)}
          icon={<IndianRupee size={20} />}
        />
      </div>

      {/* Pending orders alert */}
      {!loading && pendingOrders.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Truck size={20} className="text-amber-600" />
            <p className="text-sm font-medium text-amber-800">
              {pendingOrders.length} order{pendingOrders.length !== 1 ? "s" : ""} pending delivery
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-sm font-semibold text-amber-700 hover:text-amber-900 transition-colors"
          >
            Manage &rarr;
          </Link>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-[#6b7280]/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#0a0a0a]">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm font-medium text-[#d4860b] hover:text-[#b8720a] transition-colors"
          >
            View All &rarr;
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Order #
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#d4860b] mx-auto" />
                  </td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    No orders yet. Seed the database or wait for WhatsApp orders.
                  </td>
                </tr>
              ) : (
                recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-[#0a0a0a]">
                      {o.orderNumber}
                    </td>
                    <td className="px-4 py-3 font-medium text-[#0a0a0a]">
                      {o.customerName}
                    </td>
                    <td className="px-4 py-3 text-[#6b7280]">
                      {o.customerPhone}
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#0a0a0a]">
                      {formatCurrency(o.total)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                          STATUS_BADGE[o.status] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {o.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                          PAYMENT_BADGE[o.paymentStatus] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(o.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
