"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import { reviews } from "@/data/reviews";

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

export default function GlowLandingPage() {
  const { addToCart } = useCart();
  const router = useRouter();

  const haldi = products.find((p) => p.id === "saffron-haldi-chandan")!;
  const glowReviews = reviews
    .filter((r) => r.productSlug === "saffron-haldi-chandan-soap")
    .slice(0, 3);

  function handleBuyNow() {
    addToCart(haldi, "Pack of 1", 149, 1);
    router.push("/checkout");
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] font-sans">

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
      <div className="bg-[#2D5016] text-white text-center py-12 px-4">
        <h1
          className="text-3xl md:text-5xl font-bold leading-tight max-w-2xl mx-auto font-display"
        >
          The glow everyone keeps asking you about? It starts with what you wash with.
        </h1>
        <p className="mt-4 text-white/70 text-base max-w-md mx-auto">
          Ancient Ayurvedic ingredients. Modern results. Visible in 4&ndash;6 weeks.
        </p>
      </div>

      {/* Main content */}
      <div className="max-w-xl mx-auto px-4 py-8 space-y-6">

        {/* Product card */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#EDE6D6]">
          <div className="relative aspect-square bg-[#EDE6D6]">
            <Image
              src={haldi.images[0]}
              alt={haldi.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 576px"
              priority
            />
            <div className="absolute top-3 right-3 bg-[#2D5016] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Top Rated
            </div>
          </div>
          <div className="p-5">
            <h2 className="text-lg font-bold text-[#1C1C1C]">{haldi.name}</h2>
            <p className="text-sm text-[#6B6B6B] mt-1">{haldi.tagline}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-2xl font-bold text-[#2D5016]">&#8377;{haldi.price}</span>
              <span className="text-sm text-gray-400 line-through">&#8377;{haldi.originalPrice}</span>
              <span className="text-xs bg-[#EEF5E8] text-[#2D5016] font-semibold px-2 py-0.5 rounded-full">Free Shipping</span>
            </div>
          </div>
        </div>

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

        {/* CTA */}
        <button
          onClick={handleBuyNow}
          className="w-full bg-[#2D5016] hover:bg-[#3A6620] text-white font-bold py-5 rounded-2xl text-lg transition-all duration-200 hover:shadow-xl flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
          Try Hardin Saffron Soap &mdash; Free Shipping
        </button>

        <p className="text-center text-xs text-[#6B6B6B]">
          Secured checkout
        </p>

        {/* Reviews */}
        <div>
          <p className="text-center text-xs uppercase tracking-widest text-[#6B6B6B] font-semibold mb-4">
            What customers are saying
          </p>
          <div className="space-y-3">
            {glowReviews.map((r) => (
              <div key={r.id} className="bg-white rounded-xl p-4 border border-[#EDE6D6]">
                <div className="flex items-center gap-0.5 mb-2">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 text-[#D4A017]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-xs font-semibold text-[#1C1C1C] mb-1">{r.title}</p>
                <p className="text-sm text-[#1C1C1C] leading-relaxed mb-1">&ldquo;{r.text}&rdquo;</p>
                <p className="text-xs text-[#6B6B6B]">{r.name} &middot; {r.city}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ingredient highlights */}
        <div>
          <p className="text-center text-xs uppercase tracking-widest text-[#6B6B6B] font-semibold mb-4">
            Key Ingredients
          </p>
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-white rounded-xl p-4 border border-[#EDE6D6] flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-[#D4A017] shrink-0 flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1C1C1C] mb-1">Saffron (Kesar)</h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">
                  The world&apos;s most prized brightening ingredient. Reduces dark spots and gives skin a warm, natural radiance.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#EDE6D6] flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-[#C4A02A] shrink-0 flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="8"/>
                  <path d="M12 8v8M8 12h8"/>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1C1C1C] mb-1">Haldi (Turmeric)</h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">
                  Anti-inflammatory and antibacterial. Curcumin fights pigmentation and keeps breakouts at bay.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#EDE6D6] flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-[#8B6914] shrink-0 flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M12 2C6 7 4 12 4 16a8 8 0 0 0 16 0c0-4-2-9-8-14z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1C1C1C] mb-1">Chandan (Sandalwood)</h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">
                  Cools and soothes the skin while adding a natural, healthy glow. A centuries-old secret for luminous skin.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <button
          onClick={handleBuyNow}
          className="w-full bg-[#2D5016] hover:bg-[#3A6620] text-white font-bold py-5 rounded-2xl text-lg transition-all duration-200 hover:shadow-xl"
        >
          Try Hardin Saffron Soap — Free Shipping
        </button>

        <p className="text-center text-xs text-[#6B6B6B]">Secured checkout</p>

        <p className="text-center text-xs text-[#6B6B6B] pb-4">
          &copy; {new Date().getFullYear()} Hardin Organics &middot; All rights reserved
        </p>
      </div>
    </div>
  );
}
