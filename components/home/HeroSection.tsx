"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const INTERVAL = 4000;

// ─── Direction-aware slide variants ─────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 1 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 1 }),
};

const transition = { duration: 0.52, ease: [0.25, 0.46, 0.45, 0.94] as const };

// ─── Slide 1 — Hero banner (desktop + mobile) ────────────────────────────────
function Slide1() {
  return (
    <Link href="/shop" className="block w-full group" aria-label="Shop Hardin Organics">
      <div className="relative w-full">
        {/* Desktop */}
        <Image
          src="/images/hero-banner.jpg"
          alt="Better Ingredients. Better Skin. — Hardin Organics"
          width={1717}
          height={916}
          className="hidden md:block w-full h-auto object-cover"
          priority
          sizes="100vw"
        />
        {/* Mobile */}
        <Image
          src="/images/hero-banner-mobile.jpg"
          alt="Better Ingredients. Better Skin. — Hardin Organics"
          width={1122}
          height={1402}
          className="block md:hidden w-full h-auto object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>
    </Link>
  );
}

// ─── Slide 2 — BOGO banner (desktop + mobile) ────────────────────────────────
function Slide2() {
  return (
    <Link href="/bogo" className="block w-full group" aria-label="Shop BOGO offer">
      <div className="relative w-full">
        {/* Desktop */}
        <Image
          src="/images/bogo-banner.jpg"
          alt="Buy One Get One Free — Hardin Organics"
          width={1717}
          height={916}
          className="hidden md:block w-full h-auto object-cover"
          priority
          sizes="100vw"
        />
        {/* Mobile */}
        <Image
          src="/images/bogo-banner-mobile.jpg"
          alt="Buy One Get One Free — Hardin Organics"
          width={1122}
          height={1402}
          className="block md:hidden w-full h-auto object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>
    </Link>
  );
}

// ─── Slide 3 — Charcoal banner (desktop + mobile) ────────────────────────────
function Slide3() {
  return (
    <Link href="/product/activated-charcoal-soap" className="block w-full group" aria-label="Shop Charcoal Anti-Acne Soap">
      <div className="relative w-full">
        {/* Desktop */}
        <Image
          src="/images/charcoal-banner.jpg"
          alt="Hardin Organics Charcoal Anti-Acne Soap"
          width={1717}
          height={916}
          className="hidden md:block w-full h-auto object-cover"
          priority
          sizes="100vw"
        />
        {/* Mobile */}
        <Image
          src="/images/charcoal-banner-mobile.jpg"
          alt="Hardin Organics Charcoal Anti-Acne Soap"
          width={1092}
          height={1440}
          className="block md:hidden w-full h-auto object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>
    </Link>
  );
}

// ─── Slide 4 — Haldi Chandan banner (desktop + mobile) ───────────────────────
function Slide4() {
  return (
    <Link href="/product/saffron-haldi-chandan-soap" className="block w-full group" aria-label="Shop Saffron Haldi Chandan Soap">
      <div className="relative w-full">
        {/* Desktop */}
        <Image
          src="/images/haldi-banner.jpg"
          alt="Hardin Organics Saffron Haldi Chandan Soap"
          width={1672}
          height={941}
          className="hidden md:block w-full h-auto object-cover"
          priority
          sizes="100vw"
        />
        {/* Mobile */}
        <Image
          src="/images/haldi-banner-mobile.jpg"
          alt="Hardin Organics Saffron Haldi Chandan Soap"
          width={1122}
          height={1402}
          className="block md:hidden w-full h-auto object-cover"
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

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = useCallback((index: number, dir: number) => {
    setDirection(dir);
    setCurrent(index);
  }, []);

  const next = useCallback(() => go((current + 1) % SLIDES.length, 1), [current, go]);

  useEffect(() => {
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [next]);

  const SlideContent = SLIDES[current];

  return (
    <section
      className="relative overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: SLIDE_BG[current] }}
    >
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
    </section>
  );
}
