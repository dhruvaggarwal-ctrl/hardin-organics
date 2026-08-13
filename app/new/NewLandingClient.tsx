"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import { DICT, LANGUAGES, PRODUCT_COPY, deliveryMessage, type Lang } from "./i18n";
import { SwipeToBuy } from "./SwipeToBuy";

const charcoal = products.find((p) => p.id === "charcoal-soap")!;
const haldi = products.find((p) => p.id === "saffron-haldi-chandan")!;

const QUOTES = [
  {
    text: "Blackheads on my nose are almost gone after 3 weeks. Highly recommend to anyone with oily skin.",
    name: "Priya Sharma",
    city: "Delhi",
  },
  {
    text: "Ordered the Saffron Haldi Chandan soap on a whim and my skin literally glows now. Will definitely reorder.",
    name: "Kavya Reddy",
    city: "Bangalore",
  },
  {
    text: "Packaging is so premium — looks like a luxury product but at such an affordable price. 10/10.",
    name: "Ritu Agarwal",
    city: "Jaipur",
  },
];

const TOTAL_REVIEWS = charcoal.reviewCount + haldi.reviewCount;
const LANG_STORAGE_KEY = "ho_new_lang";

function ProductCard({
  name,
  kicker,
  price,
  originalPrice,
  image,
  bg,
  fg,
  rotate,
  swipeLabel,
  swipeDone,
  onBuy,
}: {
  name: string;
  kicker: string;
  price: number;
  originalPrice: number;
  image: string;
  bg: string;
  fg: string;
  rotate: string;
  swipeLabel: string;
  swipeDone: string;
  onBuy: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative w-full rounded-[28px] p-6 md:p-7 overflow-hidden"
      style={{ backgroundColor: bg }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-widest opacity-50" style={{ color: fg }}>
            {kicker}
          </p>
          <h3 className="font-display text-xl md:text-2xl leading-tight mt-1" style={{ color: fg }}>
            {name}
          </h3>
          <div className="flex items-baseline gap-2 mt-2.5">
            <span className="text-lg font-bold" style={{ color: fg }}>₹{price}</span>
            <span className="text-xs line-through opacity-40" style={{ color: fg }}>₹{originalPrice}</span>
          </div>
        </div>

        {/* Product photo — sticker treatment */}
        <div className={`shrink-0 w-16 md:w-20 ${rotate}`}>
          <div className="bg-white rounded-2xl p-1.5 shadow-xl">
            <Image
              src={image}
              alt={name}
              width={300}
              height={300}
              className="w-full h-auto rounded-lg"
              priority
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <SwipeToBuy label={swipeLabel} doneLabel={swipeDone} trackColor="#C4622D" onComplete={onBuy} />
      </div>
    </motion.div>
  );
}

export function NewLandingClient({
  city,
  initialLang,
}: {
  city: string | null;
  initialLang: Lang;
}) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [lang, setLang] = useState<Lang>(initialLang);

  // A saved manual choice always wins over the server-guessed language.
  useEffect(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY) as Lang | null;
    if (saved && LANGUAGES.some((l) => l.code === saved)) setLang(saved);
  }, []);

  function changeLang(next: Lang) {
    setLang(next);
    localStorage.setItem(LANG_STORAGE_KEY, next);
  }

  function buyNow(product: typeof charcoal) {
    addToCart(product, "Pack of 1", product.price, 1);
    router.push("/checkout");
  }

  const t = DICT[lang];
  const copy = PRODUCT_COPY[lang];
  const delivery = deliveryMessage(lang, city);

  return (
    <div>
      {/* ─── Section 1 — Hero ─────────────────────────────────────────── */}
      <section className="relative bg-[#141310] pt-20 md:pt-28 pb-36 md:pb-44 px-4">
        {/* Language switcher */}
        <div className="absolute top-5 right-4 md:right-6 flex gap-1 bg-white/10 rounded-full p-1" aria-label={t.langLabel}>
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => changeLang(l.code)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                lang === l.code ? "bg-white text-[#1C1C1C]" : "text-white/60 hover:text-white"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <motion.p
            key={`kicker-${lang}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] mb-5"
          >
            {t.kicker}
          </motion.p>
          <motion.h1
            key={`headline-${lang}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-6xl text-white leading-[1.1] mb-14"
          >
            {t.headline1}
            <br />
            {t.headline2}
          </motion.h1>

          {/* Product banner — visual only, no price/CTA here */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center gap-6 md:gap-10"
          >
            {[
              { img: charcoal.images[0], glow: "#9CA3AF" },
              { img: haldi.images[0], glow: "#D4A017" },
            ].map((p, i) => (
              <div key={i} className="relative">
                <div className="absolute inset-0 blur-3xl opacity-40 rounded-full" style={{ background: p.glow }} />
                <div className="relative bg-white rounded-[24px] p-4 md:p-5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]">
                  <Image src={p.img} alt="" width={300} height={300} className="w-24 md:w-32 h-auto" priority />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Buy cards — pulled up so they peek out of the hero, prompting a scroll */}
      <div className="max-w-5xl mx-auto px-4 -mt-24 md:-mt-28 relative z-10">
        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          <ProductCard
            name={copy.charcoal.name}
            kicker={copy.charcoal.kicker}
            price={charcoal.price}
            originalPrice={charcoal.originalPrice}
            image={charcoal.images[0]}
            bg="#E4E1D8"
            fg="#1C1C1C"
            rotate="rotate-[6deg]"
            swipeLabel={t.swipeLabel}
            swipeDone={t.swipeDone}
            onBuy={() => buyNow(charcoal)}
          />
          <ProductCard
            name={copy.haldi.name}
            kicker={copy.haldi.kicker}
            price={haldi.price}
            originalPrice={haldi.originalPrice}
            image={haldi.images[0]}
            bg="#F6E2A8"
            fg="#5A3E12"
            rotate="rotate-[-6deg]"
            swipeLabel={t.swipeLabel}
            swipeDone={t.swipeDone}
            onBuy={() => buyNow(haldi)}
          />
        </div>
        {delivery && (
          <p className="text-center text-xs text-[#6B6B6B] mt-4">📍 {delivery}</p>
        )}
      </div>

      {/* ─── Section 2 — Trust ────────────────────────────────────────── */}
      <section className="bg-[#F5F0E8] pt-16 md:pt-20 pb-16 md:pb-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-14">
            <div className="flex gap-0.5 text-[#D4A017]">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <p className="text-[#1C1C1C] font-semibold text-sm">
              4.8 · {TOTAL_REVIEWS.toLocaleString("en-IN")}+ {t.ratingSuffix}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 md:gap-8 mb-16">
            {QUOTES.map((q, i) => (
              <motion.div
                key={q.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`text-center md:text-left ${
                  i > 0 ? "md:pl-8 md:border-l md:border-[#DDD3BE]" : ""
                }`}
              >
                <p className="text-[#1C1C1C] text-sm leading-relaxed italic mb-3">
                  &ldquo;{q.text}&rdquo;
                </p>
                <p className="text-xs text-[#6B6B6B] font-semibold">
                  — {q.name}, {q.city}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-semibold text-[#6B6B6B] mb-16">
            {t.badges.flatMap((b, i) => [
              i > 0 && <span key={`dot-${i}`} className="w-1 h-1 rounded-full bg-[#DDD3BE]" />,
              <span key={b}>{b}</span>,
            ])}
          </div>

          <div className="text-center">
            <p className="text-[#6B6B6B] text-xs mb-5">{t.freeShipping}</p>
            <div className="max-w-md mx-auto space-y-4">
              <div>
                <p className="text-xs font-semibold text-[#1C1C1C] mb-2">{copy.charcoal.name}</p>
                <SwipeToBuy label={t.swipeLabel} doneLabel={t.swipeDone} trackColor="#1C1C1C" onComplete={() => buyNow(charcoal)} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#1C1C1C] mb-2">{copy.haldi.name}</p>
                <SwipeToBuy label={t.swipeLabel} doneLabel={t.swipeDone} trackColor="#1C1C1C" onComplete={() => buyNow(haldi)} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
