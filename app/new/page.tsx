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

function ProductPanel({
  product,
  accent,
  kicker,
  onBuy,
}: {
  product: typeof charcoal;
  accent: string;
  kicker: string;
  onBuy: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center text-center w-full"
    >
      <div className="relative mb-7">
        <div
          className="absolute inset-0 blur-3xl opacity-40 rounded-full"
          style={{ background: accent }}
        />
        <div className="relative bg-white rounded-[28px] p-6 md:p-7 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={600}
            height={600}
            className="w-36 md:w-48 h-auto"
            priority
          />
        </div>
      </div>

      <p
        className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3"
        style={{ color: accent }}
      >
        {kicker}
      </p>
      <h3 className="font-display text-2xl md:text-3xl text-white mb-1.5">
        {product.name}
      </h3>
      <p className="text-white/50 text-sm mb-5 max-w-xs">{product.tagline}</p>

      <div className="flex items-baseline gap-2.5 mb-6">
        <span className="text-white text-2xl font-bold">₹{product.price}</span>
        <span className="text-white/35 text-sm line-through">₹{product.originalPrice}</span>
      </div>

      <button
        onClick={onBuy}
        className="w-full max-w-[280px] bg-[#C4622D] hover:bg-[#D4734A] text-white font-bold py-4 rounded-2xl text-sm tracking-wide transition-all duration-200 hover:shadow-xl hover:shadow-[#C4622D]/20"
      >
        Buy Now — Free Shipping
      </button>
      <p className="text-white/35 text-xs mt-3">Ships in 24 hrs · COD available</p>
    </motion.div>
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
      <section className="bg-[#141310] py-20 md:py-28 px-4">
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

          <div className="grid md:grid-cols-2 gap-16 md:gap-10">
            <ProductPanel
              product={charcoal}
              accent="#9CA3AF"
              kicker="Activated Charcoal · Anti-Acne"
              onBuy={() => buyNow(charcoal)}
            />
            <ProductPanel
              product={haldi}
              accent="#D4A017"
              kicker="Saffron · Haldi · Chandan"
              onBuy={() => buyNow(haldi)}
            />
          </div>
        </div>
      </section>

      {/* ─── Section 2 — Trust ────────────────────────────────────────── */}
      <section className="bg-[#F5F0E8] py-16 md:py-24 px-4">
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
