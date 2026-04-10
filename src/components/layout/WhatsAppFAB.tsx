"use client";

import { motion } from "framer-motion";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_PHONE || "919999999999";

function WhatsAppIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="white"
      aria-hidden="true"
    >
      <path d="M16.003 2.667C8.639 2.667 2.667 8.638 2.667 16c0 2.338.634 4.623 1.838 6.624L2.667 29.333l6.907-1.812A13.267 13.267 0 0 0 16.003 29.333C23.364 29.333 29.333 23.362 29.333 16S23.364 2.667 16.003 2.667zm0 24.267a11.01 11.01 0 0 1-5.617-1.54l-.403-.24-4.097 1.074 1.093-3.987-.263-.41A11.013 11.013 0 0 1 5.003 16c0-6.065 4.935-11 11-11s11 4.935 11 11-4.935 11-11 11zm6.04-8.2c-.33-.165-1.952-.963-2.255-1.073-.303-.11-.524-.165-.744.165-.22.33-.854 1.073-1.047 1.293-.193.22-.385.248-.715.083-.33-.165-1.393-.514-2.653-1.636-.98-.874-1.643-1.952-1.835-2.282-.193-.33-.021-.508.144-.672.15-.148.33-.385.495-.578.165-.193.22-.33.33-.55.11-.22.055-.413-.028-.578-.083-.165-.744-1.792-1.02-2.453-.268-.644-.54-.557-.744-.567l-.633-.011c-.22 0-.578.082-.88.413-.303.33-1.155 1.129-1.155 2.755s1.183 3.196 1.348 3.416c.165.22 2.326 3.553 5.636 4.984.788.34 1.403.544 1.882.696.79.252 1.51.217 2.079.132.634-.096 1.952-.799 2.228-1.571.275-.77.275-1.43.193-1.57-.082-.14-.303-.22-.633-.385z" />
    </svg>
  );
}

export default function WhatsAppFAB() {
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi!%20I%20need%20industrial%20supplies.`;

  return (
    <div className="fixed right-6 bottom-6 z-50 flex items-center justify-center">
      {/* Pulse ring */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-30 animate-ping" />

      {/* FAB button */}
      <motion.a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
        whileHover={{
          scale: 1.12,
          boxShadow: "0 8px 32px 0 rgba(37,211,102,0.55)",
        }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 350, damping: 20 }}
      >
        <WhatsAppIcon size={28} />
      </motion.a>
    </div>
  );
}
