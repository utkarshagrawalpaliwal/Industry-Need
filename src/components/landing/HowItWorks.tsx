"use client";

import { motion } from "framer-motion";
import { MessageCircle, FileText, CheckCircle, Truck } from "lucide-react";

const steps = [
  {
    icon: MessageCircle,
    label: "WhatsApp / Call",
    sub: "Send your parts list",
    color: "#25D366",
    bgColor: "rgba(37, 211, 102, 0.1)",
  },
  {
    icon: FileText,
    label: "Quote in 10 Min",
    sub: "Transparent pricing",
    color: "#d4860b",
    bgColor: "rgba(212, 134, 11, 0.1)",
  },
  {
    icon: CheckCircle,
    label: "You Confirm",
    sub: "Happy? Say yes!",
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.1)",
  },
  {
    icon: Truck,
    label: "Delivered in 2 Hrs",
    sub: "At your doorstep",
    color: "#0a0a0a",
    bgColor: "rgba(10, 10, 10, 0.06)",
  },
];

interface HowItWorksContent {
  label?: string;
  heading?: string;
  steps?: { number: string; title: string; desc: string }[];
}

export default function HowItWorks({ content = {} as HowItWorksContent }: { content?: HowItWorksContent }) {
  // Override step labels/subs from CMS if available
  const cmsSteps = content.steps;
  if (cmsSteps && cmsSteps.length === steps.length) {
    for (let i = 0; i < steps.length; i++) {
      steps[i].label = cmsSteps[i].title;
      steps[i].sub = cmsSteps[i].desc;
    }
  }
  return (
    <section className="bg-[#f5f2ed] py-24 px-4 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm font-semibold text-[#d4860b] uppercase tracking-widest mb-4"
        >
          {content.label ?? "How It Works"}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-serif text-4xl lg:text-5xl text-[#0a0a0a] text-center mb-20"
        >
          {content.heading ?? "4 Steps. That's It."}
        </motion.h2>

        {/* Flowchart */}
        <div className="relative">
          {/* Connecting line — desktop */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-[2px] bg-gradient-to-r from-[#25D366] via-[#d4860b] via-[#3b82f6] to-[#0a0a0a] origin-left"
          />

          {/* Connecting line — mobile vertical */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            className="lg:hidden absolute top-0 bottom-0 left-8 w-[2px] bg-gradient-to-b from-[#25D366] via-[#d4860b] via-[#3b82f6] to-[#0a0a0a] origin-top"
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.2 }}
                  className="relative flex lg:flex-col items-center lg:items-center gap-5 lg:gap-0 pl-16 lg:pl-0"
                >
                  {/* Step circle */}
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative z-10 flex-shrink-0 lg:mb-6"
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg absolute lg:relative left-[-3.5rem] lg:left-auto top-0 lg:top-auto"
                      style={{ backgroundColor: step.bgColor, border: `2px solid ${step.color}` }}
                    >
                      <Icon size={26} style={{ color: step.color }} />
                    </div>
                  </motion.div>

                  {/* Text */}
                  <div className="text-left lg:text-center">
                    <span
                      className="text-xs font-bold uppercase tracking-wider block mb-1"
                      style={{ color: step.color }}
                    >
                      Step {i + 1}
                    </span>
                    <h3 className="font-sans font-bold text-[#0a0a0a] text-lg">
                      {step.label}
                    </h3>
                    <p className="font-sans text-sm text-[#6b7280] mt-1">{step.sub}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
