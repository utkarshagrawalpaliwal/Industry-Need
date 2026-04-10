import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFAB from "@/components/layout/WhatsAppFAB";
import { ToastProvider } from "@/components/ui/Toast";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title: "IndustryNeed — Industrial Supplies, Delivered in 2 Hours",
  description:
    "India's fastest B2B industrial supplies platform. Order via WhatsApp or call, get a transparent quote in 10 minutes, delivered to your doorstep in 2 hours. Serving Delhi NCR.",
  keywords: [
    "industrial supplies",
    "spare parts delivery",
    "B2B commerce",
    "factory supplies",
    "bearings",
    "fasteners",
    "Delhi NCR",
    "quick commerce",
  ],
  openGraph: {
    title: "IndustryNeed — Industrial Supplies, Delivered in 2 Hours",
    description:
      "Order via WhatsApp. Transparent quote in 10 min. Delivered in 2 hours. 24-hour returns.",
    url: "https://industryneed.in",
    siteName: "IndustryNeed",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IndustryNeed — Industrial Supplies, Delivered in 2 Hours",
    description:
      "Order via WhatsApp. Transparent quote in 10 min. Delivered in 2 hours.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${instrumentSerif.variable}`}>
      <body className="font-sans">
        <ToastProvider>
          <div className="noise-overlay" />
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <WhatsAppFAB />
        </ToastProvider>
      </body>
    </html>
  );
}
