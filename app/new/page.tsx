"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";

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

function ProductCard({
  product,
  bg,
  fg,
  rotate,
  onBuy,
}: {
  product: typeof charcoal;
  bg: string;
  fg: string;
  rotate: string;
  onBuy: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onClick={onBuy}
      className="group relative w-full h-[220px] md:h-[240px] rounded-[28px] p-6 md:p-7 text-left overflow-hidden transition-transform hover:-translate-y-1"
      style={{ backgroundColor: bg }}
    >
      <p className="text-[11px] font-bold uppercase tracking-widest opacity-50" style={{ color: fg }}>
        {product.tagline.split(" • ")[0]}
      </p>
      <h3 className="font-display text-xl md:text-2xl leading-tight mt-1 max-w-[60%]" style={{ color: fg }}>
        {product.name}
      </h3>
      <div className="flex items-baseline gap-2 mt-2.5">
        <span className="text-lg font-bold" style={{ color: fg }}>₹{product.price}</span>
        <span className="text-xs line-through opacity-40" style={{ color: fg }}>₹{product.originalPrice}</span>
      </div>

      {/* Product photo — sticker treatment */}
      <div
        className={`absolute right-5 bottom-5 w-20 md:w-24 ${rotate} transition-transform duration-300 group-hover:scale-105`}
      >
        <div className="bg-white rounded-2xl p-1.5 shadow-xl">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-auto rounded-lg"
            priority
          />
        </div>
      </div>

      {/* Buy chip */}
      <div className="absolute bottom-6 left-6 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center transition-colors group-hover:bg-[#C4622D]">
        <svg className="w-4 h-4 text-[#1C1C1C] group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 7 7 17M7 7h10v10" />
        </svg>
      </div>
    </motion.button>
  );
}

export default function NewLandingPage() {
  const { addToCart } = useCart();
  const router = useRouter();

  function buyNow(product: typeof charcoal) {
    addToCart(product, "Pack of 1", product.price, 1);
    router.push("/checkout");
  }

  return (
    <div>
      {/* ─── Section 1 — Hero ─────────────────────────────────────────── */}
      <section className="bg-[#141310] pt-20 md:pt-28 pb-36 md:pb-44 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] mb-5"
          >
            Handcrafted in India · No Parabens · No SLS
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-6xl text-white leading-[1.1] mb-14"
          >
            Better Ingredients.
            <br />
            Better Skin.
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
            product={charcoal}
            bg="#E4E1D8"
            fg="#1C1C1C"
            rotate="rotate-[6deg]"
            onBuy={() => buyNow(charcoal)}
          />
          <ProductCard
            product={haldi}
            bg="#F6E2A8"
            fg="#5A3E12"
            rotate="rotate-[-6deg]"
            onBuy={() => buyNow(haldi)}
          />
        </div>
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
              4.8 · {TOTAL_REVIEWS.toLocaleString("en-IN")}+ Verified Reviews
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
            <span>Handmade in India</span>
            <span className="w-1 h-1 rounded-full bg-[#DDD3BE]" />
            <span>No Parabens, No SLS</span>
            <span className="w-1 h-1 rounded-full bg-[#DDD3BE]" />
            <span>Cruelty-Free</span>
            <span className="w-1 h-1 rounded-full bg-[#DDD3BE]" />
            <span>COD Available</span>
          </div>

          <div className="text-center">
            <p className="text-[#6B6B6B] text-xs mb-5">Free shipping on orders above ₹399</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <button
                onClick={() => buyNow(charcoal)}
                className="flex-1 bg-[#1C1C1C] hover:bg-black text-white font-bold py-3.5 rounded-xl text-sm transition-colors"
              >
                Buy Charcoal Soap
              </button>
              <button
                onClick={() => buyNow(haldi)}
                className="flex-1 bg-[#1C1C1C] hover:bg-black text-white font-bold py-3.5 rounded-xl text-sm transition-colors"
              >
                Buy Saffron Haldi Chandan
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
