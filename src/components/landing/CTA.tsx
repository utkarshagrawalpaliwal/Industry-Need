"use client";

import { motion } from "framer-motion";
import { MessageCircle, Phone } from "lucide-react";
import { WHATSAPP_LINK, PHONE_LINK } from "@/lib/constants";

interface CTAContent {
  heading?: string;
  headingHighlight?: string;
  subtext?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
}

export default function CTA({ content = {} as CTAContent }: { content?: CTAContent }) {
  return (
    <section className="relative bg-[#0a0a0a] py-28 px-4 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#d4860b]/5 blur-3xl" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[#d4860b]/10"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-2xl mx-auto text-center"
      >
        <h2 className="font-serif text-4xl lg:text-6xl text-white leading-tight mb-6">
          {content.heading ?? "Need Parts?"}
          <br />
          <span className="text-[#d4860b]">{content.headingHighlight ?? "Just Message Us."}</span>
        </h2>

        <p className="text-white/40 text-lg mb-10">
          {content.subtext ?? "No app. No signup. No hassle."}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-3 bg-[#25D366] text-white font-semibold px-10 py-5 rounded-2xl text-lg hover:bg-[#1fb858] transition-colors duration-200 shadow-[0_0_40px_rgba(37,211,102,0.2)]"
          >
            <MessageCircle size={24} />
            {content.ctaPrimary ?? "WhatsApp Us"}
          </motion.a>
          <motion.a
            href={PHONE_LINK}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-3 border-2 border-white/20 text-white font-semibold px-10 py-5 rounded-2xl text-lg hover:border-white/40 hover:bg-white/5 transition-all duration-200"
          >
            <Phone size={24} />
            {content.ctaSecondary ?? "Call Now"}
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
