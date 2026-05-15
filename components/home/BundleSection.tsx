"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CountdownTimer } from "../ui/CountdownTimer";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";

const bundles = [
  {
    name: "Starter Duo",
    subtitle: "The perfect day + night routine",
    includes: [
      "1× Activated Charcoal Soap (100g)",
      "1× Saffron Haldi Chandan Soap (100g)",
      "Free eco-friendly packaging",
    ],
    originalPrice: 298,
    price: 249,
    savings: 49,
    savingsPct: 16,
    badge: "Most Popular",
    color: "#2D5016",
  },
  {
    name: "Double Up Pack",
    subtitle: "Stock up & save more",
    includes: [
      "2× Activated Charcoal Soap (100g each)",
      "2× Saffron Haldi Chandan Soap (100g each)",
      "Free eco-friendly packaging",
      "Priority shipping",
    ],
    originalPrice: 596,
    price: 449,
    savings: 147,
    savingsPct: 25,
    badge: "Best Value",
    color: "#C4622D",
  },
];

export function BundleSection() {
  const { addToCart } = useCart();
  const charcoal = products.find((p) => p.id === "charcoal-soap")!;
  const haldi = products.find((p) => p.id === "saffron-haldi-chandan")!;

  return (
    <section className="py-16 md:py-20 bg-[#2D5016]">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full mb-4">
            Limited Time Offer
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white font-display">
            Save More With Our Combo Packs
          </h2>
          <p className="text-white/70 mt-3 text-lg">Handcrafted in limited batches — stock is always limited</p>

          <div className="mt-4 flex items-center justify-center gap-3 text-white">
            <span className="text-sm font-medium">Offer ends in:</span>
            <CountdownTimer hoursFromNow={8} className="text-white text-lg" />
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {bundles.map((bundle, i) => (
            <motion.div
              key={bundle.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-white rounded-3xl p-7 relative overflow-hidden"
            >
              {/* Badge */}
              <div
                className="absolute top-5 right-5 text-white text-xs font-bold px-3 py-1 rounded-full"
                style={{ backgroundColor: bundle.color }}
              >
                {bundle.badge}
              </div>

              {/* Product images preview */}
              <div className="flex items-center gap-3 mb-5">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#F5F0E8] shrink-0">
                  <Image src="/images/charcoal-1.png" alt="Charcoal Soap" fill className="object-contain p-1" sizes="80px" />
                </div>
                <span className="text-2xl font-light text-[#6B6B6B]">+</span>
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#F5F0E8] shrink-0">
                  <Image src="/images/haldi-1.png" alt="Haldi Chandan Soap" fill className="object-contain p-1" sizes="80px" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-[#1C1C1C] mb-1">
                {bundle.name}
              </h3>
              <p className="text-[#6B6B6B] text-sm mb-5">{bundle.subtitle}</p>

              <ul className="space-y-2 mb-6">
                {bundle.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[#1C1C1C]">
                    <span className="text-[#2D5016] mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-end gap-3 mb-6">
                <span className="text-4xl font-bold text-[#1C1C1C]">
                  ₹{bundle.price}
                </span>
                <div>
                  <div className="text-sm line-through text-[#6B6B6B]">₹{bundle.originalPrice}</div>
                  <div className="text-sm font-bold text-green-600">Save ₹{bundle.savings} ({bundle.savingsPct}%)</div>
                </div>
              </div>

              <button
                onClick={() => {
                  addToCart(charcoal, charcoal.sizes[0].label, charcoal.price);
                  addToCart(haldi, haldi.sizes[0].label, haldi.price);
                }}
                className="w-full py-4 rounded-xl font-bold text-white text-base transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: bundle.color }}
              >
                Buy Bundle — ₹{bundle.price} →
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
