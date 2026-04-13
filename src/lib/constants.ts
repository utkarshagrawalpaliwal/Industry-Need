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
