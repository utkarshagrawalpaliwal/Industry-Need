"use client";

import { useState, useEffect, useCallback } from "react";
import { Layout, Save, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";

// ─── Default content (fallback / factory reset values) ───────────────────────

const DEFAULTS: Record<string, Record<string, unknown>> = {
  hero: {
    badge: "Serving Delhi NCR",
    heading: "Order. Quote.",
    headingHighlight: "Delivered.",
    points: [
      { text: "WhatsApp / Call", color: "text-[#25D366]" },
      { text: "Quote in 10 min", color: "text-[#d4860b]" },
      { text: "Delivered in 2 hrs", color: "text-white" },
    ],
    ctaPrimary: "WhatsApp Us",
    ctaSecondary: "Call Now",
  },
  howItWorks: {
    label: "How It Works",
    heading: "4 Steps. That's It.",
    steps: [
      { number: "01", title: "WhatsApp / Call", desc: "Send your parts list via WhatsApp or give us a call. That's it — no app, no sign-up." },
      { number: "02", title: "Quote in 10 Min", desc: "We send a transparent quote with full cost breakdown. You see exactly where every rupee goes." },
      { number: "03", title: "You Confirm", desc: "Happy with the quote? Just say yes. We lock in the price — no hidden charges, ever." },
      { number: "04", title: "Delivered in 2 Hrs", desc: "Our delivery partner picks it up and brings it to your doorstep within 2 hours." },
    ],
  },
  promises: {
    label: "Our Promises",
    heading: "Numbers We Stand By",
    items: [
      { value: "10 min", title: "Quote Response", desc: "With full cost breakdown" },
      { value: "2 hrs", title: "Doorstep Delivery", desc: "Across Delhi NCR" },
      { value: "24 hrs", title: "Easy Returns", desc: "No questions asked" },
    ],
  },
  cta: {
    heading: "Need Parts?",
    headingHighlight: "Just Message Us.",
    subtext: "No app. No signup. No hassle.",
    ctaPrimary: "WhatsApp Us",
    ctaSecondary: "Call Now",
  },
  transparency: {
    badge: "Radical Transparency",
    heading: "We Show",
    headingHighlight: "Everything",
    subtext: "Every quote breaks down exactly where your money goes. Even our profit.",
    totalAmount: "₹1399",
  },
  about: {
    label: "Our Story",
    heading: "About IndustryNeed",
    intro: "We're building the fastest industrial supply chain in India — so no factory ever loses a shift waiting for a spare part.",
    storyHeading: "Born from a crisis on the factory floor",
    storyParagraph1: "In 2022, our founder visited a precision-parts manufacturer in Faridabad whose production line had been halted for eighteen hours — not because of a major mechanical failure, but because of a single missing bearing. That lost production time cost the factory owner over ₹8 lakh.",
    storyParagraph2: "IndustryNeed was founded with a single conviction — that industrial procurement in India deserved the same reliability and speed that consumers now expect from e-commerce. We onboarded 500+ verified local suppliers, built a real-time inventory layer across Delhi NCR, and created an express fulfillment network capable of reaching any factory or workshop within two hours.",
    founderQuote: "Every hour a production line is idle costs a factory lakhs. We built IndustryNeed so that spare parts are never the bottleneck.",
    founderName: "— Archit Paliwal, Founder",
    mission: "To ensure no factory in India stops production due to a missing spare part.",
    stats: [
      { value: "500+", label: "Verified Suppliers" },
      { value: "50,000+", label: "SKUs Available" },
      { value: "< 2 Hours", label: "Delivery Time" },
      { value: "Delhi NCR", label: "Coverage Area" },
    ],
    supplierCta: "Become a Supplier",
    supplierDesc: "Are you a distributor, manufacturer, or stockist of industrial goods in Delhi NCR? Partner with IndustryNeed to reach thousands of verified B2B buyers.",
  },
  footer: {
    tagline: "Industrial Supplies, Delivered in 2 Hours",
    description: "Order via WhatsApp or call. Get a transparent quote in 10 minutes. Delivered to your doorstep in 2 hours. 24-hour easy returns.",
    location: "Delhi NCR, India",
    bottomText: "Serving Delhi NCR with transparent pricing",
  },
};

// ─── Section Editor Component ────────────────────────────────────────────────

function SectionEditor({
  title,
  sectionKey,
  data,
  onChange,
  onSave,
  onReset,
  saving,
}: {
  title: string;
  sectionKey: string;
  data: Record<string, unknown>;
  onChange: (key: string, data: Record<string, unknown>) => void;
  onSave: (key: string) => void;
  onReset: (key: string) => void;
  saving: string | null;
}) {
  const [open, setOpen] = useState(false);

  function updateField(field: string, value: unknown) {
    onChange(sectionKey, { ...data, [field]: value });
  }

  function renderField(field: string, value: unknown, path: string = "") {
    const fullKey = path ? `${path}.${field}` : field;

    if (typeof value === "string") {
      const isLong = value.length > 100;
      return (
        <div key={fullKey} className="mb-3">
          <label className="block text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-1">
            {field}
          </label>
          {isLong ? (
            <textarea
              value={value}
              onChange={(e) => updateField(field, e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4860b]/30 focus:border-[#d4860b]"
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => updateField(field, e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4860b]/30 focus:border-[#d4860b]"
            />
          )}
        </div>
      );
    }

    if (Array.isArray(value)) {
      return (
        <div key={fullKey} className="mb-4">
          <label className="block text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
            {field} ({value.length} items)
          </label>
          <div className="space-y-2 pl-3 border-l-2 border-[#d4860b]/20">
            {value.map((item, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-3">
                <p className="text-[10px] font-bold text-[#9ca3af] uppercase mb-2">Item {idx + 1}</p>
                {typeof item === "object" && item !== null ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(item).map(([k, v]) => (
                      <div key={k}>
                        <label className="block text-[10px] text-[#9ca3af] mb-0.5">{k}</label>
                        <input
                          type="text"
                          value={String(v)}
                          onChange={(e) => {
                            const newArr = [...value];
                            newArr[idx] = { ...newArr[idx], [k]: e.target.value };
                            updateField(field, newArr);
                          }}
                          className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4860b]/30"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={String(item)}
                    onChange={(e) => {
                      const newArr = [...value];
                      newArr[idx] = e.target.value;
                      updateField(field, newArr);
                    }}
                    className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
      >
        <h3 className="text-sm font-semibold text-[#0a0a0a]">{title}</h3>
        {open ? (
          <ChevronUp className="w-4 h-4 text-[#6b7280]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#6b7280]" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-5 border-t border-gray-100 pt-4">
          {Object.entries(data).map(([field, value]) => renderField(field, value))}
          <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => onSave(sectionKey)}
              disabled={saving === sectionKey}
              className="px-4 py-2 bg-[#0a0a0a] text-white text-xs font-semibold rounded-lg hover:bg-[#2c3038] transition-colors disabled:opacity-40 flex items-center gap-2"
            >
              {saving === sectionKey ? (
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={12} />
              )}
              Save Section
            </button>
            <button
              onClick={() => onReset(sectionKey)}
              className="px-4 py-2 border border-gray-200 text-[#6b7280] text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

const SECTIONS = [
  { key: "hero", title: "Hero Section" },
  { key: "howItWorks", title: "How It Works" },
  { key: "promises", title: "Our Promises" },
  { key: "cta", title: "Call to Action" },
  { key: "transparency", title: "Transparency Section" },
  { key: "about", title: "About Page" },
  { key: "footer", title: "Footer" },
];

export default function AdminCMSPage() {
  const [content, setContent] = useState<Record<string, Record<string, unknown>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch("/api/content");
      if (res.ok) {
        const data = await res.json();
        // Merge with defaults
        const merged: Record<string, Record<string, unknown>> = {};
        for (const section of SECTIONS) {
          merged[section.key] = {
            ...(DEFAULTS[section.key] || {}),
            ...((data[section.key] as Record<string, unknown>) || {}),
          };
        }
        setContent(merged);
      }
    } catch (err) {
      if (process.env.NODE_ENV !== "production") console.error("Fetch CMS error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  function handleChange(key: string, data: Record<string, unknown>) {
    setContent((prev) => ({ ...prev, [key]: data }));
  }

  async function handleSave(key: string) {
    setSaving(key);
    setMessage(null);
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, data: content[key] }),
      });
      if (res.ok) {
        setMessage({ type: "success", text: `${key} section saved!` });
      } else {
        setMessage({ type: "error", text: `Failed to save ${key}` });
      }
    } catch {
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setSaving(null);
    }
  }

  function handleReset(key: string) {
    if (DEFAULTS[key]) {
      setContent((prev) => ({ ...prev, [key]: { ...DEFAULTS[key] } }));
    }
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
          <Layout className="w-6 h-6 text-[#d4860b]" /> Content Manager
        </h1>
        <p className="text-sm text-[#6b7280] mt-1">
          Edit all website content. Changes are saved per section and reflected on the live site.
        </p>
      </div>

      {message && (
        <div
          className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-3">
        {SECTIONS.map((section) => (
          <SectionEditor
            key={section.key}
            title={section.title}
            sectionKey={section.key}
            data={content[section.key] || DEFAULTS[section.key] || {}}
            onChange={handleChange}
            onSave={handleSave}
            onReset={handleReset}
            saving={saving}
          />
        ))}
      </div>
    </div>
  );
}
