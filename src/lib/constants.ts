// ─── Contact Info ────────────────────────────────────────────────────────────
// Centralised so every component pulls from one place.

export const BUSINESS_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_PHONE || "919999999999";
export const BUSINESS_PHONE_DISPLAY = "+91 99999 99999";
export const BUSINESS_EMAIL = "hello@industryneed.in";

export const WHATSAPP_LINK = `https://wa.me/${BUSINESS_PHONE}?text=Hi!%20I%20need%20industrial%20supplies.`;
export const PHONE_LINK = `tel:+${BUSINESS_PHONE}`;

export function whatsappLink(message: string): string {
  return `https://wa.me/${BUSINESS_PHONE}?text=${encodeURIComponent(message)}`;
}

// ─── Status Badge Styles ─────────────────────────────────────────────────────

export const STATUS_BADGE_CLASSES: Record<string, string> = {
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  packed: "bg-purple-100 text-purple-700 border-purple-200",
  dispatched: "bg-amber-100 text-amber-700 border-amber-200",
  out_for_delivery: "bg-orange-100 text-orange-700 border-orange-200",
  delivered: "bg-green-100 text-green-700 border-green-200",
  returned: "bg-red-100 text-red-700 border-red-200",
};

export const PAYMENT_BADGE_CLASSES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  paid: "bg-green-100 text-green-700 border-green-200",
  refunded: "bg-red-100 text-red-700 border-red-200",
};

// ─── Transparent Pricing Model ───────────────────────────────────────────────
// Defines how the selling price is composed. Each value is a fraction of total.
// Must sum to 1.0. Aligned with the landing page Transparency section.

export interface PricingItem {
  key: string;
  label: string;
  percent: number;
}

export const DEFAULT_PRICING_BREAKDOWN: PricingItem[] = [
  { key: "landingPrice", label: "Cost of Goods (Landing Price)", percent: 0.42 },
  { key: "employeeCost", label: "Employee Benefit Cost", percent: 0.12 },
  { key: "rentalCost", label: "Rental & Interest Cost", percent: 0.08 },
  { key: "labourCost", label: "Labour Charges", percent: 0.10 },
  { key: "deliveryCost", label: "Delivery Charges", percent: 0.05 },
  { key: "gst", label: "GST", percent: 0.13 },
  { key: "profit", label: "Profit", percent: 0.10 },
];

// Backward compat alias
export const PRICING_BREAKDOWN = DEFAULT_PRICING_BREAKDOWN;

// Given a landing price, calculate selling price and breakdown
// Accepts optional custom breakdown (from settings or per-product override)
export function calculateTransparentPricing(
  landingPrice: number,
  breakdown: PricingItem[] = DEFAULT_PRICING_BREAKDOWN,
) {
  const cogPercent = breakdown.find((b) => b.key === "landingPrice")?.percent ?? 0.42;
  const sellingPrice = Math.round(landingPrice / cogPercent);

  return {
    sellingPrice,
    breakdown: breakdown.map((item) => ({
      ...item,
      amount: Math.round(sellingPrice * item.percent),
    })),
  };
}

// Given a selling price, calculate the breakdown amounts
export function getBreakdownFromSellingPrice(
  sellingPrice: number,
  breakdown: PricingItem[] = DEFAULT_PRICING_BREAKDOWN,
) {
  return breakdown.map((item) => ({
    ...item,
    amount: Math.round(sellingPrice * item.percent),
  }));
}

export const QUOTE_STATUS_BADGE_CLASSES: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600 border-gray-200",
  sent: "bg-blue-100 text-blue-700 border-blue-200",
  accepted: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  converted: "bg-purple-100 text-purple-700 border-purple-200",
};
