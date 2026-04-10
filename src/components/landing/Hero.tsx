"use client";

import { motion } from "framer-motion";
import { MessageCircle, Phone, ArrowDown } from "lucide-react";

const WHATSAPP_LINK = "https://wa.me/919999999999?text=Hi!%20I%20need%20industrial%20supplies.";
const PHONE_LINK = "tel:+919999999999";

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Animated background rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-[#d4860b]/10"
            style={{
              width: `${i * 250}px`,
              height: `${i * 250}px`,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: i * 0.2, ease: "easeOut" }}
          />
        ))}
        {/* Pulsing center glow */}
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-[#d4860b]/20 blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl">
        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-5 py-2 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
          <span className="text-sm font-medium text-white/80">Serving Delhi NCR</span>
        </motion.div>

        {/* Main heading — minimal */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-5xl sm:text-6xl lg:text-8xl text-white leading-[1.05] mb-6"
        >
          Order. Quote.{" "}
          <span className="text-[#d4860b]">Delivered.</span>
        </motion.h1>

        {/* Animated sub-points instead of paragraph */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mb-10"
        >
          {[
            { text: "WhatsApp / Call", color: "text-[#25D366]" },
            { text: "Quote in 10 min", color: "text-[#d4860b]" },
            { text: "Delivered in 2 hrs", color: "text-white" },
          ].map((item, i) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + i * 0.15 }}
              className="flex items-center gap-2"
            >
              {i > 0 && (
                <span className="w-1 h-1 rounded-full bg-white/30 hidden sm:block" />
              )}
              <span className={`text-base sm:text-lg font-semibold ${item.color}`}>
                {item.text}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-3 bg-[#25D366] text-white font-semibold px-8 py-4 rounded-2xl text-lg hover:bg-[#1fb858] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(37,211,102,0.3)]"
          >
            <MessageCircle size={22} />
            WhatsApp Us
          </a>
          <a
            href={PHONE_LINK}
            className="inline-flex items-center justify-center gap-3 border-2 border-white/20 text-white font-semibold px-8 py-4 rounded-2xl text-lg hover:border-white/50 hover:bg-white/5 transition-all duration-300"
          >
            <Phone size={22} />
            Call Now
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={20} className="text-white/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}
