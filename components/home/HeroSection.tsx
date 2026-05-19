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

// ─── Slide 2 — BOGO banner image ─────────────────────────────────────────────
function Slide2() {
  return (
    <Link href="/bogo" className="block w-full group" aria-label="Shop BOGO offer">
      <div className="relative w-full">
        <Image
          src="/images/bogo-banner.jpg"
          alt="Buy One Get One Free — Hardin Organics"
          width={1717}
          height={916}
          className="w-full h-auto object-cover"
          priority
          sizes="100vw"
        />
        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>
    </Link>
  );
}

// ─── Slide 3 — Charcoal banner image ─────────────────────────────────────────
function Slide3() {
  return (
    <Link href="/product/activated-charcoal-soap" className="block w-full group" aria-label="Shop Charcoal Anti-Acne Soap">
      <div className="relative w-full">
        <Image
          src="/images/charcoal-banner.jpg"
          alt="Hardin Organics Charcoal Anti-Acne Soap"
          width={1717}
          height={916}
          className="w-full h-auto object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>
    </Link>
  );
}

// ─── Slide 4 — Haldi Chandan banner image ────────────────────────────────────
function Slide4() {
  return (
    <Link href="/product/saffron-haldi-chandan-soap" className="block w-full group" aria-label="Shop Saffron Haldi Chandan Soap">
      <div className="relative w-full">
        <Image
          src="/images/haldi-banner.jpg"
          alt="Hardin Organics Saffron Haldi Chandan Soap"
          width={1672}
          height={941}
          className="w-full h-auto object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>
    </Link>
  );
}

const SLIDES = [Slide1, Slide2, Slide3, Slide4];
const SLIDE_BG = ["#F5F0E8", "#F5EDDA", "#EBEBEB", "#F5E6C0"];
const DOT_ACCENT = ["#2D5016", "#2D5016", "#1C1C1C", "#D4A017"];

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
