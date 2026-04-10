"use client";

import { motion } from "framer-motion";
import { CheckCircle, Eye, ChevronRight } from "lucide-react";

const lineItems = [
  { label: "GST", percent: "5%", amount: "₹67" },
  { label: "Raw Materials", percent: "35%", amount: "₹495" },
  { label: "Manufacturing", percent: "13%", amount: "₹175" },
  { label: "Testing & Analysis", percent: "2%", amount: "₹28" },
  { label: "Warehousing", percent: "12%", amount: "₹170" },
  { label: "Payment Gateway", percent: "1%", amount: "₹10" },
  { label: "Fixed Costs", percent: "21%", amount: "₹298" },
];

const profit = { label: "Profit", percent: "11%", amount: "₹156" };

export default function Transparency() {
  return (
    <section className="bg-[#0a0a0a] py-24 px-4 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#16a34a]/10 border border-[#16a34a]/20 rounded-full px-4 py-2 mb-6">
            <Eye size={16} className="text-[#16a34a]" />
            <span className="text-sm font-semibold text-[#16a34a]">Radical Transparency</span>
          </div>
          <h2 className="font-serif text-4xl lg:text-5xl text-white mb-4">
            We Show <span className="text-[#16a34a]">Everything</span>
          </h2>
          <p className="text-white/50 text-lg max-w-lg mx-auto">
            Every quote breaks down exactly where your money goes. Even our profit.
          </p>
        </motion.div>

        {/* Phone mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="relative w-full max-w-[380px]">
            {/* Glow behind phone */}
            <div className="absolute inset-0 bg-[#16a34a]/10 blur-3xl rounded-full scale-110 pointer-events-none" />

            {/* Phone frame */}
            <div className="relative bg-white rounded-[2.5rem] shadow-2xl shadow-black/50 p-2 border border-white/20">
              {/* Inner screen */}
              <div className="bg-[#f0fdf4] rounded-[2rem] overflow-hidden">
                {/* Status bar / header */}
                <div className="bg-white px-6 pt-6 pb-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#16a34a] flex items-center justify-center">
                    <ChevronRight size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#16a34a] uppercase tracking-wider">IndustryNeed</p>
                    <p className="text-xs text-[#6b7280]">New Quote</p>
                  </div>
                </div>

                {/* Quote body */}
                <div className="px-6 pt-5 pb-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <h3 className="font-serif text-2xl font-bold text-[#0a0a0a] italic">Your Quote</h3>
                    <p className="text-[10px] text-[#16a34a] font-semibold uppercase tracking-wider mt-1 mb-5">
                      Generated 1 min ago
                    </p>
                  </motion.div>

                  {/* Line items */}
                  <div className="space-y-3">
                    {lineItems.map((item, i) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -15 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: 0.6 + i * 0.08 }}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-[#374151]">
                          {item.label}{" "}
                          <span className="text-[#9ca3af]">({item.percent})</span>
                        </span>
                        <span className="text-sm font-semibold text-[#0a0a0a]">{item.amount}</span>
                      </motion.div>
                    ))}

                    {/* Divider */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 1.2 }}
                      className="border-t border-dashed border-[#d1d5db] origin-left"
                    />

                    {/* Profit line — highlighted */}
                    <motion.div
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: 1.3 }}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-semibold text-[#16a34a]">
                        {profit.label}{" "}
                        <span className="text-[#16a34a]/60">({profit.percent})</span>
                      </span>
                      <span className="text-sm font-bold text-[#16a34a]">{profit.amount}</span>
                    </motion.div>
                  </div>

                  {/* Total price card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 1.5, type: "spring" }}
                    className="mt-6 bg-gradient-to-r from-[#15803d] to-[#16a34a] rounded-2xl p-5 text-center shadow-lg shadow-[#16a34a]/20"
                  >
                    <p className="text-[10px] text-white/70 uppercase tracking-widest font-semibold mb-1">
                      Total Selling Price
                    </p>
                    <p className="text-4xl font-bold text-white">₹1399</p>
                  </motion.div>

                  {/* Transparent guarantee badge */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 1.8 }}
                    className="flex justify-center mt-4"
                  >
                    <div className="inline-flex items-center gap-1.5 bg-[#16a34a]/10 rounded-full px-3 py-1.5">
                      <CheckCircle size={12} className="text-[#16a34a]" />
                      <span className="text-[10px] font-bold text-[#16a34a] uppercase tracking-wider">
                        Transparent Guarantee
                      </span>
                    </div>
                  </motion.div>

                  {/* Confirm button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 2 }}
                    className="mt-5 space-y-3"
                  >
                    <button className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold py-3.5 rounded-full flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#16a34a]/20">
                      <CheckCircle size={18} />
                      Confirm Order
                    </button>
                    <button className="w-full text-[#6b7280] hover:text-[#374151] text-sm font-medium py-2 transition-colors">
                      Request Edit
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Phone notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
