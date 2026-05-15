"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const INTERVAL = 2000;

// ─── Direction-aware slide variants ─────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 1 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 1 }),
};

const transition = { duration: 0.52, ease: [0.25, 0.46, 0.45, 0.94] as const };

// ─── Slide 1 — Classic two-column (cream) ────────────────────────────────────
function Slide1() {
  const trustBadges = ["Paraben Free", "Cruelty Free", "Made in India", "Eco Packaging"];
  return (
    <div className="max-w-7xl mx-auto px-4 w-full grid md:grid-cols-2 gap-12 items-center py-16 md:py-24">
      {/* Text */}
      <div className="order-2 md:order-1">
        <div className="inline-flex items-center gap-2 bg-[#E8F0E0] text-[#2D5016] text-sm font-semibold px-4 py-2 rounded-full mb-6">
          Handcrafted in Small Batches
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1C1C1C] leading-tight mb-6 font-display">
          Your Skin Deserves Ingredients You Can{" "}
          <span className="text-[#2D5016]">Pronounce.</span>
        </h1>
        <p className="text-lg text-[#6B6B6B] leading-relaxed mb-8">
          Handcrafted organic soaps made with activated charcoal, saffron, haldi &amp; chandan.{" "}
          <strong className="text-[#1C1C1C]">No parabens. No SLS. No compromise.</strong>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 bg-[#C4622D] text-white font-bold px-8 py-4 rounded-full text-lg hover:bg-[#D4734A] transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            Shop Now — Free Shipping
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/#skin-quiz"
            className="inline-flex items-center justify-center gap-2 text-[#2D5016] font-semibold px-6 py-4 rounded-full text-lg border-2 border-[#2D5016] hover:bg-[#2D5016] hover:text-white transition-all duration-300"
          >
            Take Skin Quiz →
          </Link>
        </div>
        <div className="flex flex-wrap gap-3">
          {trustBadges.map((b) => (
            <div key={b} className="flex items-center gap-1.5 bg-white rounded-full px-4 py-2 text-sm font-medium text-[#1C1C1C] shadow-sm">
              <svg className="w-3.5 h-3.5 text-[#2D5016]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {b}
            </div>
          ))}
        </div>
      </div>
      {/* Image */}
      <div className="order-1 md:order-2 flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-[#2D5016]/10 rounded-full scale-110 -z-10" />
          <div className="animate-float relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[480px] lg:h-[480px] rounded-full overflow-hidden shadow-2xl bg-[#EDE6D6]">
            <Image src="/images/haldi-4.png" alt="Saffron Haldi Chandan soap" fill className="object-contain" priority sizes="(max-width: 640px) 288px, (max-width: 1024px) 384px, 480px" />
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl px-4 py-3 text-center">
            <div className="text-2xl font-bold text-[#2D5016]">10K+</div>
            <div className="text-xs text-[#6B6B6B] font-medium">Happy Customers</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="absolute -top-2 -right-4 bg-[#2D5016] text-white rounded-2xl shadow-xl px-4 py-3 text-center">
            <div className="text-2xl font-bold">4.8★</div>
            <div className="text-xs font-medium opacity-80">2000+ Reviews</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 2 — BOGO (dark, centered, loud) ───────────────────────────────────
function Slide2() {
  return (
    <div className="max-w-7xl mx-auto px-4 w-full flex flex-col items-center justify-center text-center py-16 md:py-24 gap-6">
      {/* Urgency badge */}
      <div className="inline-flex items-center gap-2 bg-[#C4622D] text-white text-sm font-bold px-5 py-2 rounded-full uppercase tracking-widest animate-pulse-green">
        ⚡ Limited Time · Tonight Only
      </div>

      {/* Big headline */}
      <div>
        <p className="text-2xl md:text-3xl font-bold text-white/70 uppercase tracking-[0.2em] mb-1">Buy 1 Get 1</p>
        <h1 className="text-5xl sm:text-7xl md:text-9xl font-black text-[#C4622D] leading-none font-display">FREE</h1>
      </div>

      {/* Two products */}
      <div className="flex items-center justify-center gap-6 md:gap-12 mt-2">
        <div className="flex flex-col items-center gap-2">
          <div className="w-28 h-28 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-[#2A2A2A] shadow-xl ring-2 ring-white/20">
            <Image src="/images/charcoal-cover.png" alt="Charcoal Soap" width={160} height={160} className="w-full h-full object-contain" />
          </div>
          <span className="text-white/60 text-xs font-medium uppercase tracking-wider">Charcoal</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-[#C4622D] flex items-center justify-center">
            <span className="text-white font-black text-xl">+</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="w-28 h-28 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-[#3A2A10] shadow-xl ring-2 ring-white/20">
            <Image src="/images/haldi-1.png" alt="Haldi Chandan Soap" width={160} height={160} className="w-full h-full object-contain" />
          </div>
          <span className="text-white/60 text-xs font-medium uppercase tracking-wider">Haldi Chandan</span>
        </div>
      </div>

      {/* Pricing */}
      <div className="flex items-center gap-4">
        <span className="text-white/40 text-2xl line-through font-bold">₹299</span>
        <span className="text-4xl font-black text-white">₹149</span>
        <span className="bg-[#C4622D] text-white text-sm font-bold px-3 py-1 rounded-full">50% OFF</span>
      </div>

      {/* CTA */}
      <Link
        href="/bogo"
        className="inline-flex items-center gap-3 bg-[#C4622D] text-white font-black px-10 py-4 rounded-full text-xl hover:bg-[#D4734A] transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95"
      >
        Grab This Deal Now
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>
      <p className="text-white/40 text-sm">Free shipping · No code needed · Ships within 24 hours</p>
    </div>
  );
}

// ─── Slide 3 — Charcoal (editorial, dark, minimal) ───────────────────────────
function Slide3() {
  return (
    <div className="max-w-7xl mx-auto px-4 w-full grid md:grid-cols-5 gap-8 items-center py-16 md:py-24">
      {/* Text — takes 2 cols */}
      <div className="md:col-span-2 order-2 md:order-1 flex flex-col gap-5">
        <span className="text-[#9BCB6A] text-xs font-bold uppercase tracking-[0.3em]">
          Activated Charcoal · Shea Butter
        </span>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-none font-display">
          Deep<br />Cleanse.<br />
          <span className="text-[#9BCB6A]">Clear<br />Skin.</span>
        </h1>
        <div className="w-12 h-1 bg-[#9BCB6A] rounded-full" />
        <p className="text-white/60 text-base leading-relaxed max-w-xs">
          Works like a magnet — drawing out toxins, unclogging pores, and clearing acne without stripping your skin.
        </p>
        <div className="flex gap-3 flex-wrap">
          {["Anti-Acne", "Pore Cleansing", "Cruelty Free"].map((tag) => (
            <span key={tag} className="text-xs font-semibold text-white/50 border border-white/20 px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <Link
          href="/product/activated-charcoal-soap"
          className="self-start inline-flex items-center gap-2 bg-white text-[#1C1C1C] font-bold px-7 py-3.5 rounded-full text-base hover:bg-[#9BCB6A] hover:text-[#1C1C1C] transition-all duration-300 hover:scale-[1.03]"
        >
          Shop Charcoal Soap
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Image — takes 3 cols */}
      <div className="md:col-span-3 order-1 md:order-2 flex justify-center md:justify-end">
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-[#9BCB6A]/20 rounded-3xl blur-3xl scale-90" />
          <div className="relative w-72 h-72 sm:w-[360px] sm:h-[360px] lg:w-[480px] lg:h-[480px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#222]">
            <Image
              src="/images/charcoal-cover.png"
              alt="Hardin Organics Activated Charcoal Soap"
              fill
              className="object-contain p-4"
              sizes="(max-width: 640px) 288px, (max-width: 1024px) 360px, 480px"
            />
          </div>
          {/* Corner badge */}
          <div className="absolute top-4 right-4 bg-[#9BCB6A] text-[#1C1C1C] text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
            Bestseller
          </div>
          {/* Bottom tag */}
          <div className="absolute -bottom-4 left-4 bg-[#1C1C1C] border border-white/10 rounded-2xl px-4 py-2.5 shadow-xl">
            <div className="text-white font-bold text-sm">5,000+ bars sold</div>
            <div className="text-white/40 text-xs">⭐⭐⭐⭐⭐ 4.9 / 5</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 4 — Haldi Chandan (warm, reversed, glow) ─────────────────────────
function Slide4() {
  return (
    <div className="max-w-7xl mx-auto px-4 w-full grid md:grid-cols-2 gap-12 items-center py-16 md:py-24">
      {/* Image — LEFT (reversed from slide 1) */}
      <div className="flex justify-center order-1">
        <div className="relative">
          <div className="absolute inset-0 bg-[#D4A017]/30 rounded-full scale-110 -z-10 blur-2xl" />
          <div className="animate-float relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[460px] lg:h-[460px] rounded-[40%_60%_55%_45%/45%_55%_60%_40%] overflow-hidden shadow-2xl bg-[#F5E6C0]">
            <Image
              src="/images/haldi-1.png"
              alt="Saffron Haldi Chandan Soap"
              fill
              className="object-contain"
              sizes="(max-width: 640px) 288px, (max-width: 1024px) 384px, 460px"
            />
          </div>
          {/* Floating ingredient tags */}
          <div className="absolute -top-2 -left-4 bg-white rounded-2xl shadow-lg px-3 py-2">
            <span className="text-xs font-bold text-[#8B5E1A]">🌿 Saffron</span>
          </div>
          <div className="absolute top-1/2 -right-6 bg-white rounded-2xl shadow-lg px-3 py-2">
            <span className="text-xs font-bold text-[#8B5E1A]">✨ Haldi</span>
          </div>
          <div className="absolute -bottom-3 -left-2 bg-white rounded-2xl shadow-lg px-3 py-2">
            <span className="text-xs font-bold text-[#8B5E1A]">🪵 Chandan</span>
          </div>
        </div>
      </div>

      {/* Text — RIGHT */}
      <div className="order-2 flex flex-col gap-5">
        <div className="inline-flex items-center gap-2 bg-[#F5E0B0] text-[#8B5E1A] text-sm font-semibold px-4 py-2 rounded-full self-start">
          ✨ Glow Edition
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1C1C1C] leading-tight font-display">
          Radiant Glow.{" "}
          <span className="text-[#8B5E1A]">Natural Beauty.</span>
        </h1>
        <p className="text-lg text-[#6B6B6B] leading-relaxed">
          Ancient Ayurvedic ingredients — saffron, turmeric &amp; sandalwood — in one luxurious handcrafted bar. Evens skin tone and reduces dullness in 2 weeks.
        </p>

        {/* Feature pills */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "☀️", label: "Brightens Skin" },
            { icon: "🔸", label: "Evens Tone" },
            { icon: "💧", label: "Hydrating" },
            { icon: "🌿", label: "100% Natural" },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-xl px-3 py-2.5 shadow-sm">
              <span className="text-base">{f.icon}</span>
              <span className="text-sm font-semibold text-[#1C1C1C]">{f.label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 pt-1">
          <Link
            href="/product/saffron-haldi-chandan-soap"
            className="inline-flex items-center gap-2 bg-[#D4A017] text-white font-bold px-8 py-4 rounded-full text-lg hover:bg-[#E8B52A] transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            Shop Haldi Chandan
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <div className="text-center">
            <div className="text-xl font-bold text-[#1C1C1C]">₹199</div>
            <div className="text-xs text-[#6B6B6B] line-through">₹349</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SLIDES = [Slide1, Slide2, Slide3, Slide4];
const SLIDE_BG = ["#F5F0E8", "#111111", "#1A1A1A", "#FDF3E3"];
const DOT_ACCENT = ["#2D5016", "#C4622D", "#9BCB6A", "#D4A017"];

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const go = useCallback((index: number, dir: number) => {
    setDirection(dir);
    setCurrent(index);
  }, []);

  const next = useCallback(() => go((current + 1) % SLIDES.length, 1), [current, go]);
  const prev = useCallback(() => go((current - 1 + SLIDES.length) % SLIDES.length, -1), [current, go]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [paused, next]);

  const SlideContent = SLIDES[current];

  return (
    <section
      className="relative overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: SLIDE_BG[current] }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slide area */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transition}
          className="w-full flex items-center"
        >
          <SlideContent />
        </motion.div>
      </AnimatePresence>

      {/* ── Controls ─────────────────────────────────────── */}
      <div className="absolute bottom-5 left-0 right-0 flex items-center justify-center gap-3 z-10">
        {/* Prev arrow */}
        <button
          onClick={() => { prev(); setPaused(true); }}
          className="w-7 h-7 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center hover:bg-black/40 transition-colors"
          aria-label="Previous"
        >
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Dots */}
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => { go(i, i > current ? 1 : -1); setPaused(true); }}
            aria-label={`Slide ${i + 1}`}
            className="rounded-full transition-all duration-300"
            style={{
              height: 8,
              width: current === i ? 28 : 8,
              backgroundColor: current === i ? DOT_ACCENT[i] : "rgba(255,255,255,0.45)",
            }}
          />
        ))}

        {/* Next arrow */}
        <button
          onClick={() => { next(); setPaused(true); }}
          className="w-7 h-7 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center hover:bg-black/40 transition-colors"
          aria-label="Next"
        >
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      {!paused && (
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/10">
          <motion.div
            key={`bar-${current}`}
            className="h-full"
            style={{ backgroundColor: DOT_ACCENT[current] }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: INTERVAL / 1000, ease: "linear" }}
          />
        </div>
      )}
    </section>
  );
}
