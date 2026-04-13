"use client";

import { useState, useEffect, useCallback } from "react";
import { Settings, Save, RotateCcw } from "lucide-react";
import { DEFAULT_PRICING_BREAKDOWN, PricingItem } from "@/lib/constants";

export default function AdminSettingsPage() {
  const [breakdown, setBreakdown] = useState<PricingItem[]>(
    DEFAULT_PRICING_BREAKDOWN.map((b) => ({ ...b }))
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.pricingBreakdown) {
          setBreakdown(data.pricingBreakdown);
        }
      }
    } catch (err) {
      if (process.env.NODE_ENV !== "production") console.error("Fetch settings error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  function updatePercent(index: number, value: number) {
    setBreakdown((prev) =>
      prev.map((item, i) => (i === index ? { ...item, percent: value } : item))
    );
  }

  const totalPercent = breakdown.reduce((s, b) => s + b.percent, 0);
  const isValid = Math.abs(totalPercent - 1.0) < 0.01;

  async function handleSave() {
    if (!isValid) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pricingBreakdown: breakdown }),
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Pricing defaults saved successfully!" });
      } else {
        const data = await res.json().catch(() => null);
        setMessage({ type: "error", text: data?.error ?? "Failed to save" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setBreakdown(DEFAULT_PRICING_BREAKDOWN.map((b) => ({ ...b })));
    setMessage(null);
  }

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
          <Settings className="w-6 h-6 text-[#d4860b]" /> Settings
        </h1>
        <p className="text-sm text-[#6b7280] mt-1">
          Configure default pricing breakdown percentages for the transparent pricing model
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden max-w-2xl">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-[#0a0a0a]">Default Pricing Breakdown</h2>
          <p className="text-xs text-[#6b7280] mt-1">
            These percentages define how the selling price is composed. They must total 100%.
            Individual products and quote items can override these defaults.
          </p>
        </div>

        <div className="p-6">
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

          <div className="space-y-4">
            {breakdown.map((item, index) => (
              <div key={item.key} className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#0a0a0a]">{item.label}</p>
                  <p className="text-xs text-[#9ca3af]">{item.key}</p>
                </div>
                <div className="flex items-center gap-2 w-36">
                  <input
                    type="number"
                    value={Math.round(item.percent * 100)}
                    onChange={(e) => updatePercent(index, (parseInt(e.target.value) || 0) / 100)}
                    min={0}
                    max={100}
                    className="w-20 px-3 py-2 text-sm text-right border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4860b]/30 focus:border-[#d4860b] font-semibold"
                  />
                  <span className="text-sm text-[#6b7280] font-medium">%</span>
                </div>
                {/* Visual bar */}
                <div className="hidden sm:block w-24">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        item.key === "profit" ? "bg-green-500" : "bg-[#d4860b]"
                      }`}
                      style={{ width: `${Math.min(item.percent * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#0a0a0a]">Total</span>
              <span
                className={`text-lg font-bold ${
                  isValid ? "text-green-600" : "text-red-600"
                }`}
              >
                {Math.round(totalPercent * 100)}%
              </span>
            </div>
            {!isValid && (
              <p className="text-xs text-red-600 mt-1">
                Percentages must total exactly 100%. Currently {Math.round(totalPercent * 100)}%.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={!isValid || saving}
              className="px-6 py-2.5 bg-[#0a0a0a] text-white text-sm font-semibold rounded-xl hover:bg-[#2c3038] transition-colors disabled:opacity-40 flex items-center gap-2"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {saving ? "Saving..." : "Save Defaults"}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 border border-gray-200 text-[#6b7280] text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Reset to Factory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
