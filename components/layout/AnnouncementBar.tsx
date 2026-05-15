"use client";

import { useState } from "react";

const messages = [
  "Free Shipping on Orders Above ₹399",
  "100% Natural Ingredients — No Parabens, No SLS",
  "4.8★ Rated by 2,000+ Customers",
  "Proudly Made in India · Handcrafted with Love",
  "Eco-Friendly Packaging — Good for You & the Planet",
  "Order 2+ soaps & save ₹50 automatically",
];

const tickerText = messages.join("   •   ") + "   •   " + messages.join("   •   ");

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="relative bg-[#2D5016] text-white text-sm py-2.5 overflow-hidden">
      <div className="animate-ticker">{tickerText}</div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-lg leading-none"
        aria-label="Close announcement"
      >
        ×
      </button>
    </div>
  );
}
