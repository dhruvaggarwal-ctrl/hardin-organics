"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";

const BUNDLE_PRODUCTS = [
  { id: "charcoal-soap", slug: "activated-charcoal-soap", name: "Activated Charcoal Soap", benefit: "Deep cleanses & fights acne", image: "/images/charcoal-1.png", price: 149 },
  { id: "saffron-haldi-chandan", slug: "saffron-haldi-chandan-soap", name: "Saffron Haldi Chandan Soap", benefit: "Brightens & evens skin tone", image: "/images/haldi-1.png", price: 149 },
];
const MRP = 199;

function getBundleDiscount(qty: number): number {
  if (qty >= 5) return 200;
  if (qty === 4) return 147;
  if (qty === 3) return 90;
  if (qty === 2) return 50;
  return 0;
}

const COMBOS = [
  { label: "The Classic", desc: "1 Charcoal + 1 Saffron", emoji: "⚡", qty: { "charcoal-soap": 1, "saffron-haldi-chandan": 1 } },
  { label: "Double Cleanse", desc: "2× Charcoal", emoji: "🖤", qty: { "charcoal-soap": 2, "saffron-haldi-chandan": 0 } },
  { label: "Glow Stack", desc: "2× Saffron Haldi", emoji: "✨", qty: { "charcoal-soap": 0, "saffron-haldi-chandan": 2 } },
  { label: "Family Pack", desc: "2 Charcoal + 2 Saffron", emoji: "👨‍👩‍👧", qty: { "charcoal-soap": 2, "saffron-haldi-chandan": 2 } },
];

export default function BuildYourBundlePage() {
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>({ "charcoal-soap": 0, "saffron-haldi-chandan": 0 });
  const [toast, setToast] = useState(false);

  const totalQty = Object.values(quantities).reduce((s, q) => s + q, 0);
  const originalTotal = BUNDLE_PRODUCTS.reduce((s, p) => s + p.price * (quantities[p.id] || 0), 0);
  const mrpTotal = BUNDLE_PRODUCTS.reduce((s, p) => s + MRP * (quantities[p.id] || 0), 0);
  const discount = getBundleDiscount(totalQty);
  const finalPrice = originalTotal - discount;

  const setQty = useCallback((id: string, delta: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.min(6, Math.max(0, (prev[id] || 0) + delta)) }));
  }, []);

  const applyCombo = useCallback((qty: Record<string, number>) => {
    setQuantities({ ...qty });
  }, []);

  function handleAddToCart() {
    if (totalQty < 2) return;
    for (const p of BUNDLE_PRODUCTS) {
      const qty = quantities[p.id] || 0;
      if (qty > 0) {
        const product = products.find((pr) => pr.id === p.id);
        if (product) addToCart(product, product.sizes[0].label, p.price, qty);
      }
    }
    setToast(true);
    setTimeout(() => setToast(false), 4000);
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Header */}
      <div className="bg-[#2D5016] text-white py-12 text-center px-4">
        <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
          Bundle & Save up to ₹200
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-display mb-2">Build Your Bundle</h1>
        <p className="text-white/70 text-lg">Pick your soaps, see live savings, add to cart.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 pb-40 md:pb-12">
        {/* Product cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-8">
          {BUNDLE_PRODUCTS.map((p) => {
            const qty = quantities[p.id] || 0;
            return (
              <div key={p.id} className={`bg-white rounded-2xl p-4 border-2 transition-all duration-200 ${qty > 0 ? "border-[#2D5016] shadow-md" : "border-transparent shadow-sm"}`}>
                <div className="relative aspect-square w-full mb-3 bg-[#F5F0E8] rounded-xl overflow-hidden">
                  <Image src={p.image} alt={p.name} fill className="object-contain p-3" sizes="(max-width: 768px) 50vw, 300px" />
                  {qty > 0 && (
                    <div className="absolute top-2 right-2 bg-[#2D5016] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">{qty}</div>
                  )}
                </div>
                <h3 className="font-bold text-sm text-[#1C1C1A] leading-tight mb-0.5">{p.name}</h3>
                <p className="text-xs text-[#6B6B6B] mb-3">{p.benefit}</p>
                <p className="text-xs text-[#6B6B6B] mb-3">
                  <span className="line-through">₹{MRP}</span>
                  <span className="text-[#A0522D] font-bold ml-1">₹{p.price}/bar</span>
                </p>
                {/* Stepper */}
                <div className="flex items-center justify-between border border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQty(p.id, -1)} className="px-4 py-2.5 text-[#1C1C1A] hover:bg-gray-100 font-bold text-lg transition-colors" aria-label="Decrease">−</button>
                  <span className="text-base font-bold text-[#1C1C1A] w-8 text-center">{qty}</span>
                  <button onClick={() => setQty(p.id, 1)} className="px-4 py-2.5 text-[#1C1C1A] hover:bg-gray-100 font-bold text-lg transition-colors" aria-label="Increase">+</button>
                </div>
              </div>
            );
          })}
        </div>

        {totalQty < 2 && totalQty > 0 && (
          <p className="text-center text-sm text-[#A0522D] font-medium mb-6">
            Add at least 2 soaps to unlock bundle pricing 🎁
          </p>
        )}

        {/* Popular combos */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-[#1C1C1A] mb-3">Popular Combos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {COMBOS.map((combo) => (
              <button
                key={combo.label}
                onClick={() => applyCombo(combo.qty)}
                className="bg-white rounded-xl p-3 text-left border border-[#EDE6D6] hover:border-[#2D5016] hover:shadow-sm transition-all"
              >
                <span className="text-2xl block mb-1">{combo.emoji}</span>
                <p className="text-sm font-bold text-[#1C1C1A]">{combo.label}</p>
                <p className="text-xs text-[#6B6B6B] mt-0.5">{combo.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Pricing panel — desktop sidebar sticky (md+) */}
        <div className="hidden md:block bg-white rounded-2xl p-6 shadow-sm border border-[#EDE6D6]">
          <h2 className="font-bold text-[#1C1C1A] text-lg mb-4">Your Bundle</h2>
          <div className="space-y-2 mb-4">
            {BUNDLE_PRODUCTS.map((p) => {
              const qty = quantities[p.id] || 0;
              if (qty === 0) return null;
              return (
                <div key={p.id} className="flex justify-between text-sm">
                  <span className="text-[#6B6B6B]">{qty}× {p.name}</span>
                  <span className="font-medium">₹{p.price * qty}</span>
                </div>
              );
            })}
            {totalQty === 0 && <p className="text-sm text-[#6B6B6B]">No soaps selected yet</p>}
          </div>
          {mrpTotal > 0 && (
            <div className="border-t border-gray-100 pt-3 space-y-1.5">
              <div className="flex justify-between text-sm text-[#6B6B6B]">
                <span>MRP Total</span>
                <span className="line-through">₹{mrpTotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600 font-medium">
                  <span>Bundle Discount</span>
                  <span>−₹{discount}</span>
                </div>
              )}
              {totalQty >= 2 && (
                <div className="flex items-center gap-1.5 text-xs text-[#2D5016] font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  Free shipping unlocked!
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="text-[#A0522D]">₹{finalPrice}</span>
              </div>
            </div>
          )}
          <button
            onClick={handleAddToCart}
            disabled={totalQty < 2}
            className="mt-4 w-full bg-[#A0522D] text-white font-bold py-4 rounded-xl hover:bg-[#8B4513] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {totalQty < 2 ? "Select at least 2 soaps" : `Add Bundle to Cart — ₹${finalPrice}`}
          </button>
          {toast && (
            <div className="mt-3 text-center text-sm text-green-600 font-medium">
              ✓ Bundle added! <Link href="/cart" className="underline">View Cart →</Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile fixed bottom bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 p-4 z-40">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-[#6B6B6B]">
            {totalQty} soap{totalQty !== 1 ? "s" : ""} selected
            {discount > 0 && <span className="text-green-600 font-medium ml-2">−₹{discount} saved</span>}
          </div>
          {mrpTotal > 0 && (
            <div className="text-right">
              <span className="text-xs text-[#6B6B6B] line-through mr-1">₹{mrpTotal}</span>
              <span className="font-bold text-[#A0522D]">₹{finalPrice}</span>
            </div>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={totalQty < 2}
          className="w-full bg-[#A0522D] text-white font-bold py-4 rounded-xl hover:bg-[#8B4513] transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-base"
        >
          {totalQty < 2 ? "Add 2+ soaps to unlock" : `Add Bundle to Cart — ₹${finalPrice}`}
        </button>
        {toast && (
          <p className="text-center text-xs text-green-600 font-medium mt-2">
            ✓ Added! <Link href="/cart" className="underline">View Cart →</Link>
          </p>
        )}
      </div>
    </div>
  );
}
