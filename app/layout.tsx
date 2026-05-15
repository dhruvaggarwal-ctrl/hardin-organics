import type { Metadata } from "next";
import "./globals.css";
import { DM_Sans, Cormorant_Garamond, Dancing_Script } from "next/font/google";

// DM Sans — primary UI font (body, nav, buttons, labels, subheadings)
// Most trusted, clean, readable font for Indian D2C e-commerce
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

// Cormorant Garamond — display only (hero h1, section h2 titles)
// Used sparingly for premium feel, not on smaller elements
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-serif",
  display: "swap",
});

// Dancing Script — founder signature only
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: "600",
  variable: "--font-dancing",
  display: "swap",
});

import { CartProvider } from "@/context/CartContext";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export const metadata: Metadata = {
  title: {
    default: "Hardin Organics — Handcrafted Organic Soaps | Activated Charcoal, Saffron, Haldi & Chandan",
    template: "%s | Hardin Organics",
  },
  description:
    "Premium handcrafted organic soaps made in India with activated charcoal, saffron, haldi & chandan. No parabens. No SLS. 100% natural. Free shipping above ₹399.",
  keywords: ["organic soap", "activated charcoal soap", "saffron soap", "haldi soap", "natural soap India", "handmade soap"],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Hardin Organics",
    title: "Hardin Organics — Handcrafted Organic Soaps",
    description: "Premium handcrafted organic soaps made in India. No parabens. No SLS. 100% natural.",
    images: [{ url: "https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=1200&q=85", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  metadataBase: new URL("https://hardinorganics.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${cormorant.variable} ${dancingScript.variable}`}>
      <body>
        <CartProvider>
          <AnnouncementBar />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
