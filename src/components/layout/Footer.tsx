"use client";

import Link from "next/link";
import { MessageCircle, Phone, Mail, MapPin } from "lucide-react";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_PHONE || "919999999999";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Track Orders", href: "/track" },
  { label: "About", href: "/about" },
];

export default function Footer() {
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi!%20I%20need%20industrial%20supplies.`;

  return (
    <footer className="bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Col 1: Brand */}
          <div>
            <div className="flex items-center gap-1 mb-3">
              <span className="font-serif text-xl font-bold text-white">
                IndustryNeed
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4860b] mt-0.5" />
            </div>
            <p className="text-[#d4860b] text-sm font-semibold mb-3">
              Industrial Supplies, Delivered in 2 Hours
            </p>
            <p className="text-[#6b7280] text-sm leading-relaxed">
              Order via WhatsApp or call. Get a transparent quote in 10 minutes.
              Delivered to your doorstep in 2 hours. 24-hour easy returns.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#6b7280] text-sm hover:text-[#d4860b] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+919999999999"
                  className="flex items-start gap-2.5 text-[#6b7280] text-sm hover:text-[#d4860b] transition-colors duration-200"
                >
                  <Phone size={15} className="mt-0.5 shrink-0" />
                  +91 99999 99999
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@industryneed.in"
                  className="flex items-start gap-2.5 text-[#6b7280] text-sm hover:text-[#d4860b] transition-colors duration-200"
                >
                  <Mail size={15} className="mt-0.5 shrink-0" />
                  hello@industryneed.in
                </a>
              </li>
              <li>
                <span className="flex items-start gap-2.5 text-[#6b7280] text-sm">
                  <MapPin size={15} className="mt-0.5 shrink-0" />
                  Delhi NCR, India
                </span>
              </li>
              <li className="pt-1">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] text-white text-sm font-medium hover:bg-[#1ebe5d] transition-colors duration-200"
                >
                  <MessageCircle size={15} />
                  Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[#6b7280] text-xs">
            &copy; {new Date().getFullYear()} IndustryNeed. All rights reserved.
          </p>
          <p className="text-[#6b7280] text-xs">
            Serving Delhi NCR with transparent pricing
          </p>
        </div>
      </div>
    </footer>
  );
}
