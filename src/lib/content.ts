// Server-side content fetcher for frontend pages.
// Fetches from the Content table with fallback to defaults.

import { prisma } from "@/lib/prisma";

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
    storyParagraph1: "In 2022, our founder visited a precision-parts manufacturer in Faridabad whose production line had been halted for eighteen hours — not because of a major mechanical failure, but because of a single missing bearing. That lost production time cost the factory owner over ₹8 lakh. The root cause was a fragmented supply market: dozens of distributors, none of them reachable after 6 PM, no unified catalogue, and delivery lead times measured in days rather than hours.",
    storyParagraph2: "IndustryNeed was founded with a single conviction — that industrial procurement in India deserved the same reliability and speed that consumers now expect from e-commerce. We onboarded 500+ verified local suppliers, built a real-time inventory layer across Delhi NCR, and created an express fulfillment network capable of reaching any factory or workshop within two hours of order placement.",
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

export async function getContent(key: string): Promise<Record<string, unknown>> {
  try {
    const row = await prisma.content.findUnique({ where: { id: key } });
    if (row && row.data) {
      return { ...(DEFAULTS[key] || {}), ...(row.data as Record<string, unknown>) };
    }
  } catch {
    // fallback to defaults on error
  }
  return (DEFAULTS[key] || {}) as Record<string, unknown>;
}

export async function getAllContent(): Promise<Record<string, Record<string, unknown>>> {
  try {
    const rows = await prisma.content.findMany();
    const result: Record<string, Record<string, unknown>> = {};
    for (const key of Object.keys(DEFAULTS)) {
      const row = rows.find((r) => r.id === key);
      result[key] = {
        ...(DEFAULTS[key] || {}),
        ...((row?.data as Record<string, unknown>) || {}),
      };
    }
    return result;
  } catch {
    return DEFAULTS as Record<string, Record<string, unknown>>;
  }
}
