"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";

// ─── Countdown logic ──────────────────────────────────────────────────────────
const OFFER_DURATION_HOURS = 48;
const LS_KEY = "hardin_combo_end";

function getEndTime(): number {
  if (typeof window === "undefined") return Date.now() + OFFER_DURATION_HOURS * 3600 * 1000;
  const stored = localStorage.getItem(LS_KEY);
  if (stored) {
    const end = parseInt(stored, 10);
    if (end > Date.now()) return end;
  }
  const end = Date.now() + OFFER_DURATION_HOURS * 3600 * 1000;
  localStorage.setItem(LS_KEY, String(end));
  return end;
}

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ h: 47, m: 59, s: 59 });
  const endRef = useRef<number>(0);

  useEffect(() => {
    endRef.current = getEndTime();
    const tick = () => {
      const diff = Math.max(0, endRef.current - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return timeLeft;
}

const TRUST_BADGES = [
  {
    label: "Ships in 24 hrs",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M5 12h14M5 12l4-4m-4 4 4 4M13 12h6a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1"/>
        <rect x="1" y="13" width="4" height="6" rx="1"/>
      </svg>
    ),
  },
  {
    label: "COD Available",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <path d="M2 10h20"/>
      </svg>
    ),
  },
  {
    label: "100% Natural Ingredients",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    ),
  },
  {
    label: "No SLS, No Parabens",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8 12h8M12 8v8"/>
      </svg>
    ),
  },
];

export default function ComboLandingPage() {
  const { h, m, s } = useCountdown();
  const { addToCart } = useCart();
  const router = useRouter();

  const charcoal = products.find((p) => p.id === "charcoal-soap")!;
  const haldi = products.find((p) => p.id === "saffron-haldi-chandan")!;

  const COMBO_PRICE = 249;
  const ORIGINAL_PRICE = 298;
  const SAVINGS = ORIGINAL_PRICE - COMBO_PRICE;

  function handleBuyNow() {
    addToCart(charcoal, "Pack of 1", 149, 1);
    addToCart(haldi, "Pack of 1", 149, 1);
    router.push("/checkout");
  }

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="min-h-screen bg-[#F5F0E8] font-sans">

      {/* Announcement bar */}
      <div className="bg-[#2D5016] text-white py-2.5 text-center">
        <p className="text-sm font-semibold">
          Pre-applied: HARDIN10 &mdash; 10% off applied automatically
        </p>
      </div>

      {/* Logo bar */}
      <div className="bg-white border-b border-gray-100 py-3 text-center">
        <Image
          src="/images/hardin-logo.png"
          alt="Hardin Organics"
          width={140}
          height={56}
          className="h-9 w-auto object-contain inline-block"
          priority
        />
      </div>

      {/* Hero */}
      <div className="bg-[#1C1C1C] text-white text-center py-12 px-4">
        <h1
          className="text-3xl md:text-5xl font-bold leading-tight max-w-2xl mx-auto font-display"
        >
          You came back. Here&apos;s 10% off to make it easy.
        </h1>
        <p className="mt-4 text-white/70 text-base max-w-md mx-auto">
          Both soaps. One order. Discount pre-applied. No code needed.
        </p>
      </div>

      {/* Main content */}
      <div className="max-w-xl mx-auto px-4 py-8 space-y-6">

        {/* Products side by side */}
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-white rounded-2xl overflow-hidden shadow-sm border border-[#EDE6D6]">
            <div className="relative aspect-square bg-[#EDE6D6]">
              <Image
                src={charcoal.images[0]}
                alt={charcoal.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 45vw, 250px"
                priority
              />
            </div>
            <div className="p-3 text-center">
              <p className="text-xs font-semibold text-[#1C1C1C] leading-tight">{charcoal.name}</p>
              <p className="text-xs text-[#2D5016] font-bold mt-1">&#8377;{charcoal.price}</p>
            </div>
          </div>

          <div className="shrink-0 text-2xl font-bold text-[#6B6B6B]">+</div>

          <div className="flex-1 bg-white rounded-2xl overflow-hidden shadow-sm border border-[#EDE6D6]">
            <div className="relative aspect-square bg-[#EDE6D6]">
              <Image
                src={haldi.images[0]}
                alt={haldi.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 45vw, 250px"
                priority
              />
            </div>
            <div className="p-3 text-center">
              <p className="text-xs font-semibold text-[#1C1C1C] leading-tight">{haldi.name}</p>
              <p className="text-xs text-[#2D5016] font-bold mt-1">&#8377;{haldi.price}</p>
            </div>
          </div>
        </div>

        {/* Pricing card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#EDE6D6]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B6B6B]">Combo price</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-3xl font-bold text-[#2D5016]">&#8377;{COMBO_PRICE}</span>
                <span className="text-base text-gray-400 line-through">&#8377;{ORIGINAL_PRICE}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block bg-[#EEF5E8] text-[#2D5016] font-bold text-sm px-3 py-1.5 rounded-full">
                Save &#8377;{SAVINGS}
              </span>
              <p className="text-xs text-[#6B6B6B] mt-1">HARDIN10 applied</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-[#6B6B6B]">Free shipping included &middot; Both soaps packed together</p>
          </div>
        </div>

        {/* Urgency timer */}
        <div className="bg-[#8B1A1A]/10 border border-[#8B1A1A]/20 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#8B1A1A] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
              </svg>
              <span className="text-sm font-semibold text-[#8B1A1A]">This offer expires in</span>
            </div>
            <span className="font-mono bg-[#8B1A1A] text-white px-3 py-1 rounded-lg text-base font-bold tracking-widest">
              {pad(h)}:{pad(m)}:{pad(s)}
            </span>
          </div>
          <p className="text-xs text-[#8B1A1A] mt-2 font-semibold">
            Only 8 units left in this batch
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={handleBuyNow}
          className="w-full bg-[#2D5016] hover:bg-[#3A6620] text-white font-bold py-5 rounded-2xl text-lg transition-all duration-200 hover:shadow-xl flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
          Claim My Combo &mdash; Save &#8377;{SAVINGS}
        </button>

        <p className="text-center text-xs text-[#6B6B6B]">Secured checkout</p>

        {/* Trust strip */}
        <div className="grid grid-cols-2 gap-3">
          {TRUST_BADGES.map((badge) => (
            <div
              key={badge.label}
              className="bg-white rounded-xl p-3 border border-[#EDE6D6] flex items-center gap-2.5"
            >
              <span className="text-[#2D5016] shrink-0">{badge.icon}</span>
              <span className="text-xs font-semibold text-[#1C1C1C] leading-tight">{badge.label}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-[#6B6B6B] pb-4">
          &copy; {new Date().getFullYear()} Hardin Organics &middot; All rights reserved
        </p>
      </div>
    </div>
  );
}
