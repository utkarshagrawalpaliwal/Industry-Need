"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  FileText,
  Truck,
  Settings,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Quotes", href: "/admin/quotes", icon: FileText },
  { label: "Orders", href: "/admin/orders", icon: Truck },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#6b7280]/20 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1">
            <span className="font-serif text-lg font-bold text-[#0a0a0a]">
              IndustryNeed
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4860b] mt-0.5" />
          </div>
          <p className="text-xs text-[#6b7280] mt-0.5 font-medium tracking-wide uppercase">
            Admin Panel
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#f5f2ed] text-[#6b7280] transition-colors"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative ${
                isActive
                  ? "bg-[#d4860b]/10 text-[#d4860b]"
                  : "text-[#2c3038] hover:bg-[#f5f2ed] hover:text-[#0a0a0a]"
              }`}
            >
              <Icon
                size={18}
                className={isActive ? "text-[#d4860b]" : "text-[#6b7280]"}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Back to Site */}
      <div className="px-3 py-4 border-t border-[#6b7280]/20">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-[#6b7280] hover:bg-[#f5f2ed] hover:text-[#0a0a0a] transition-colors duration-150"
        >
          <ArrowLeft size={16} />
          Back to Site
        </Link>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-white border border-[#6b7280]/20 shadow-sm text-[#2c3038] hover:bg-[#f5f2ed] transition-colors"
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen bg-white border-r border-[#6b7280]/20 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="admin-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              key="admin-drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-[#6b7280]/20 flex flex-col md:hidden"
            >
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
