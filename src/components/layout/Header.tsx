"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_PHONE || "919999999999";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Track", href: "/track" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi!%20I%20need%20industrial%20supplies.`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-[#f5f2ed]/80 transition-shadow duration-300 ${
          scrolled ? "shadow-md" : "shadow-none"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1">
              <span className="font-serif text-xl font-bold text-[#0a0a0a]">
                IndustryNeed
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4860b] mt-0.5" />
            </Link>

            {/* Center Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative text-sm font-medium transition-colors duration-200 pb-0.5 ${
                      isActive
                        ? "text-[#d4860b]"
                        : "text-[#2c3038] hover:text-[#d4860b]"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d4860b] rounded-full"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* WhatsApp Button */}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#25D366] text-white text-sm font-medium hover:bg-[#1ebe5d] transition-colors duration-200"
              >
                <MessageCircle size={15} />
                WhatsApp Us
              </a>

              {/* Hamburger */}
              <button
                className="md:hidden p-2 rounded-full hover:bg-[#f5f2ed] text-[#2c3038] transition-colors duration-200"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/40"
              onClick={() => setDrawerOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-[#f5f2ed] shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-5 h-16 border-b border-[#2c3038]/10">
                <span className="font-serif text-lg font-bold text-[#0a0a0a]">
                  IndustryNeed
                </span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-full hover:bg-white/60 text-[#2c3038] transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex flex-col px-4 py-6 gap-1 flex-1">
                {navLinks.map((link) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setDrawerOpen(false)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? "bg-[#d4860b]/10 text-[#d4860b]"
                          : "text-[#2c3038] hover:bg-white/60 hover:text-[#d4860b]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="px-5 py-5 border-t border-[#2c3038]/10">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-[#25D366] text-white text-sm font-medium hover:bg-[#1ebe5d] transition-colors duration-200"
                >
                  <MessageCircle size={16} />
                  WhatsApp Us
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
