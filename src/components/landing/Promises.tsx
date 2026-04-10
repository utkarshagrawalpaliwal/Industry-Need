"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Clock, Truck, RotateCcw } from "lucide-react";

function AnimatedNumber({
  target,
  suffix = "",
  active,
}: {
  target: number;
  suffix?: string;
  active: boolean;
}) {
  const [count, setCount] = useState(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const duration = 1500;
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
      }
    };
    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [active, target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

const promises = [
  {
    icon: Clock,
    number: 10,
    suffix: " min",
    title: "Quote Response",
    sub: "With full cost breakdown",
    gradient: "from-[#d4860b] to-[#f0c96e]",
    borderColor: "border-[#d4860b]/20",
    iconBg: "bg-[#d4860b]/10",
    iconColor: "text-[#d4860b]",
  },
  {
    icon: Truck,
    number: 2,
    suffix: " hrs",
    title: "Doorstep Delivery",
    sub: "Across Delhi NCR",
    gradient: "from-[#3b82f6] to-[#60a5fa]",
    borderColor: "border-[#3b82f6]/20",
    iconBg: "bg-[#3b82f6]/10",
    iconColor: "text-[#3b82f6]",
  },
  {
    icon: RotateCcw,
    number: 24,
    suffix: " hrs",
    title: "Easy Returns",
    sub: "No questions asked",
    gradient: "from-[#10b981] to-[#34d399]",
    borderColor: "border-[#10b981]/20",
    iconBg: "bg-[#10b981]/10",
    iconColor: "text-[#10b981]",
  },
];

export default function Promises() {
  return (
    <section className="bg-[#f5f2ed] py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm font-semibold text-[#d4860b] uppercase tracking-widest mb-4"
        >
          Our Promises
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-serif text-4xl lg:text-5xl text-[#0a0a0a] text-center mb-16"
        >
          Numbers We Stand By
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promises.map((p, i) => {
            const Icon = p.icon;
            return <PromiseCard key={p.title} promise={p} Icon={Icon} index={i} />;
          })}
        </div>
      </div>
    </section>
  );
}

function PromiseCard({
  promise: p,
  Icon,
  index,
}: {
  promise: (typeof promises)[number];
  Icon: typeof Clock;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className={`relative bg-white rounded-3xl p-8 border ${p.borderColor} shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center overflow-hidden`}
    >
      {/* Background gradient blob */}
      <div
        className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${p.gradient} opacity-10 blur-2xl pointer-events-none`}
      />

      {/* Icon */}
      <div className={`w-14 h-14 rounded-2xl ${p.iconBg} flex items-center justify-center mb-6 relative z-10`}>
        <Icon size={28} className={p.iconColor} />
      </div>

      {/* Animated number */}
      <div className={`font-serif text-5xl lg:text-6xl font-bold bg-gradient-to-r ${p.gradient} bg-clip-text text-transparent mb-2 relative z-10`}>
        <AnimatedNumber target={p.number} suffix={p.suffix} active={inView} />
      </div>

      {/* Title */}
      <h3 className="font-sans font-bold text-[#0a0a0a] text-lg mb-1 relative z-10">
        {p.title}
      </h3>
      <p className="font-sans text-sm text-[#6b7280] relative z-10">{p.sub}</p>
    </motion.div>
  );
}
