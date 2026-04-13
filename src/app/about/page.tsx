import type { Metadata } from "next";
import Image from "next/image";
import { whatsappLink } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About IndustryNeed — Fastest Industrial Supply Chain in India",
  description:
    "Learn how IndustryNeed was born to solve factory downtime across India by delivering spare parts and industrial supplies in under 2 hours across Delhi NCR.",
  openGraph: {
    title: "About IndustryNeed",
    description:
      "We're building the fastest industrial supply chain in India. 500+ suppliers, 50,000+ SKUs, delivered in under 2 hours.",
    type: "website",
  },
};

const STATS = [
  { value: "500+", label: "Verified Suppliers" },
  { value: "50,000+", label: "SKUs Available" },
  { value: "< 2 Hours", label: "Delivery Time" },
  { value: "Delhi NCR", label: "Coverage Area" },
];

export default function AboutPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="text-center mb-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#d4860b] mb-4">
          Our Story
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0a0a0a] leading-tight mb-6">
          About IndustryNeed
        </h1>
        <p className="text-xl sm:text-2xl text-[#2c3038] font-light max-w-3xl mx-auto leading-relaxed">
          We&apos;re building the fastest industrial supply chain in India — so
          no factory ever loses a shift waiting for a spare part.
        </p>
      </section>

      {/* Story */}
      <section className="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#0a0a0a] mb-4">
              Born from a crisis on the factory floor
            </h2>
            <p className="text-[#2c3038] leading-relaxed mb-5">
              In 2022, our founder visited a precision-parts manufacturer in
              Faridabad whose production line had been halted for eighteen
              hours — not because of a major mechanical failure, but because of
              a single missing bearing. That lost production time cost the
              factory owner over ₹8 lakh. The root cause was a fragmented
              supply market: dozens of distributors, none of them reachable
              after 6 PM, no unified catalogue, and delivery lead times
              measured in days rather than hours.
            </p>
            <p className="text-[#2c3038] leading-relaxed">
              IndustryNeed was founded with a single conviction — that
              industrial procurement in India deserved the same reliability and
              speed that consumers now expect from e-commerce. We onboarded
              500+ verified local suppliers, built a real-time inventory layer
              across Delhi NCR, and created an express fulfillment network
              capable of reaching any factory or workshop within two hours of
              order placement.
            </p>
          </div>
          <div className="flex flex-col gap-0">
            {/* Founder photo */}
            <div className="w-full rounded-t-2xl overflow-hidden">
              <Image
                src="/founder.png"
                alt="Archit Paliwal - Founder of IndustryNeed"
                width={500}
                height={600}
                className="w-full h-auto object-contain"
              />
            </div>
            {/* Quote */}
            <div className="bg-[#f5f2ed] rounded-b-2xl p-8 flex flex-col gap-4">
              <div className="h-2 bg-[#d4860b] rounded-full w-16 mb-2" />
              <blockquote className="font-serif text-xl text-[#0a0a0a] italic leading-relaxed">
                &ldquo;Every hour a production line is idle costs a factory
                lakhs. We built IndustryNeed so that spare parts are never the
                bottleneck.&rdquo;
              </blockquote>
              <p className="text-sm text-[#6b7280] font-semibold">
                — Archit Paliwal, Founder
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mb-20 bg-[#2c3038] rounded-2xl px-8 py-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#f0c96e] mb-4">
          Our Mission
        </p>
        <p className="font-serif text-2xl sm:text-3xl font-bold text-white leading-snug max-w-2xl mx-auto">
          To ensure no factory in India stops production due to a missing spare
          part.
        </p>
      </section>

      {/* Stats */}
      <section className="mb-20">
        <h2 className="font-serif text-2xl font-bold text-[#0a0a0a] text-center mb-10">
          IndustryNeed by the numbers
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-[#f5f2ed] rounded-xl p-6 text-center"
            >
              <p className="font-serif text-3xl sm:text-4xl font-bold text-[#d4860b] mb-2">
                {stat.value}
              </p>
              <p className="text-sm font-semibold text-[#2c3038] uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Supplier CTA */}
      <section className="bg-[#f5f2ed] border border-[#f0c96e] rounded-2xl px-8 py-12 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#0a0a0a] mb-3">
          Become a Supplier
        </h2>
        <p className="text-[#2c3038] max-w-xl mx-auto mb-8 leading-relaxed">
          Are you a distributor, manufacturer, or stockist of industrial goods
          in Delhi NCR? Partner with IndustryNeed to reach thousands of
          verified B2B buyers.
        </p>
        <a
          href={whatsappLink("Hi, I want to become a supplier on IndustryNeed")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-7 py-3 bg-[#25D366] text-white rounded-lg font-semibold text-sm hover:bg-[#1ebe5a] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Chat with us on WhatsApp
        </a>
      </section>
    </main>
  );
}
