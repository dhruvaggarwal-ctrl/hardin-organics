import type { Metadata, Viewport } from "next";
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

import Script from "next/script";
import { CartProvider } from "@/context/CartContext";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Hardin Organics — Handcrafted Organic Soaps | Activated Charcoal, Saffron, Haldi & Chandan",
    template: "%s | Hardin Organics",
  },
  description: "Premium handcrafted organic soaps made in India with activated charcoal, saffron, haldi & chandan. No parabens. No SLS. 100% natural. Free shipping above ₹399.",
  keywords: ["organic soap", "activated charcoal soap", "saffron soap", "haldi soap", "chandan soap", "natural soap India", "handmade soap India", "ayurvedic soap", "anti acne soap", "glowing skin soap", "organic soap India buy online", "charcoal soap for acne", "turmeric soap", "sandalwood soap"],
  metadataBase: new URL("https://hardinorganics.com"),
  alternates: { canonical: "https://hardinorganics.com" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Hardin Organics",
    title: "Hardin Organics — Handcrafted Organic Soaps",
    description: "Premium handcrafted organic soaps made in India. No parabens. No SLS. 100% natural.",
    images: [{ url: "https://hardinorganics.com/images/charcoal-cover.png", width: 1200, height: 630, alt: "Hardin Organics organic soaps" }],
  },
  twitter: { card: "summary_large_image", title: "Hardin Organics", description: "Handcrafted organic soaps — No parabens. No SLS. 100% natural." },
  icons: { icon: '/icon.png', apple: '/apple-icon.png' },
  verification: {},
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${cormorant.variable} ${dancingScript.variable}`}>
      <body>
        {/* Meta Pixel — strategy="afterInteractive" works fine in body */}
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1879222279409281');
          fbq('track', 'PageView');
        `}</Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1879222279409281&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
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
