"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";

// ─── Countdown logic ──────────────────────────────────────────────────────────
// Persists in localStorage so refreshing doesn't reset the timer
const OFFER_DURATION_HOURS = 24;
const LS_KEY = "hardin_bogo_end";

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
  const [timeLeft, setTimeLeft] = useState({ h: 23, m: 59, s: 59 });
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

// ─── Razorpay helpers (same pattern as RazorpayButton) ───────────────────────
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) { resolve(true); return; }
    const s = document.createElement("script");
    s.id = "razorpay-script";
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

// ─── Social proof numbers ─────────────────────────────────────────────────────
const REVIEWS = [
  { name: "Priya S.", city: "Delhi", text: "Ordered BOGO, gifted one to my mom. Both of us love it. Skin feels baby soft.", stars: 5 },
  { name: "Kavya R.", city: "Bangalore", text: "Can't believe I got 2 soaps for ₹149. The charcoal one cleared my skin in a week.", stars: 5 },
  { name: "Rohit M.", city: "Mumbai", text: "Wife forced me to order. Now she's reordered 3 times. Says it's the best soap she's used.", stars: 5 },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BogoPage() {
  const { h, m, s } = useCountdown();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { clearCart } = useCart();
  const router = useRouter();

  const charcoal = products.find((p) => p.id === "charcoal-soap")!;
  const haldi = products.find((p) => p.id === "saffron-haldi-chandan")!;

  const BOGO_PRICE = 149; // pay for 1, get both
  const ORIGINAL_PRICE = 298;
  const SAVINGS = ORIGINAL_PRICE - BOGO_PRICE;

  const handleCheckout = async () => {
    setLoading(true);
    setError("");
    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Failed to load payment gateway. Please try again.");

      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: BOGO_PRICE, receipt: `bogo_${Date.now()}` }),
      });
      if (!orderRes.ok) throw new Error("Could not initiate payment. Please try again.");
      const { orderId, amount: orderAmount, currency } = await orderRes.json();

      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          order_id: orderId,
          amount: orderAmount,
          currency,
          name: "Hardin Organics",
          description: "BOGO Offer: Activated Charcoal Soap + Saffron Haldi Chandan Soap",
          image: "/images/charcoal-1.png",
          theme: { color: "#2D5016" },
          prefill: {},
          handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const { verified } = await verifyRes.json();
            if (!verified) { reject(new Error("Payment verification failed.")); return; }
            clearCart();
            router.push(`/order-success?paymentId=${response.razorpay_payment_id}&orderId=${response.razorpay_order_id}&offer=bogo`);
            resolve();
          },
          modal: { ondismiss: () => { setLoading(false); resolve(); } },
        });
        rzp.on("payment.failed", (r: { error: { description: string } }) => {
          reject(new Error(r.error?.description || "Payment failed."));
        });
        rzp.open();
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="min-h-screen bg-[#F5F0E8] font-sans">

      {/* ── Sticky urgency bar ── */}
      <div className="sticky top-0 z-50 bg-[#8B1A1A] text-white py-2.5 text-center">
        <div className="flex items-center justify-center gap-3 text-sm font-semibold">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
          </svg>
          <span>OFFER ENDS IN&nbsp;</span>
          <span className="font-mono bg-white/20 px-2 py-0.5 rounded text-base tracking-widest">
            {pad(h)}:{pad(m)}:{pad(s)}
          </span>
          <span className="hidden sm:inline">— Don&apos;t miss out</span>
        </div>
      </div>

      {/* ── Logo bar ── */}
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

      {/* ── Hero ── */}
      <div className="bg-[#2D5016] text-white text-center py-10 px-4">
        <p className="text-sm font-semibold tracking-widest uppercase text-[#A8C97A] mb-2">Limited Time Offer</p>
        <h1 className="text-4xl md:text-6xl font-bold mb-3 font-display">
          Buy 1, Get 1 <span className="text-[#D4A017]">FREE</span>
        </h1>
        <p className="text-lg text-white/80 max-w-md mx-auto">
          Get both our handcrafted organic soaps — worth ₹{ORIGINAL_PRICE} — for just <strong className="text-white">₹{BOGO_PRICE}</strong>
        </p>
        <div className="inline-flex items-center gap-2 bg-[#D4A017] text-[#1C1C1C] font-bold text-sm px-4 py-1.5 rounded-full mt-4">
          You save ₹{SAVINGS} — {Math.round((SAVINGS / ORIGINAL_PRICE) * 100)}% OFF
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Products */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[charcoal, haldi].map((product, i) => (
            <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#EDE6D6]">
              <div className="relative aspect-square bg-[#EDE6D6]">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 300px"
                />
                {i === 1 && (
                  <div className="absolute top-2 right-2 bg-[#8B1A1A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                    FREE
                  </div>
                )}
                {i === 0 && (
                  <div className="absolute top-2 right-2 bg-[#2D5016] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                    You Pay
                  </div>
                )}
              </div>
              <div className="p-3 text-center">
                <p className="text-xs font-semibold text-[#1C1C1C] leading-tight">{product.name}</p>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  {i === 1 ? (
                    <>
                      <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
                      <span className="text-sm font-bold text-[#8B1A1A]">FREE</span>
                    </>
                  ) : (
                    <span className="text-sm font-bold text-[#2D5016]">₹{product.price}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#EDE6D6] mb-5">
          <h2 className="font-bold text-[#1C1C1C] mb-3 text-sm uppercase tracking-wide">Your Order</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#6B6B6B]">Activated Charcoal Soap (100g)</span>
              <span className="font-medium">₹149</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B6B6B]">Saffron Haldi Chandan Soap (100g)</span>
              <span className="font-bold text-[#8B1A1A]">FREE</span>
            </div>
            <div className="flex justify-between text-xs text-[#6B6B6B]">
              <span>Shipping</span>
              <span className="text-[#2D5016] font-medium">FREE</span>
            </div>
            <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <div className="text-right">
                <span className="text-[#2D5016]">₹{BOGO_PRICE}</span>
                <div className="text-xs text-gray-400 font-normal line-through">₹{ORIGINAL_PRICE}</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-[#8B1A1A] hover:bg-[#A02020] text-white font-bold py-5 rounded-2xl text-lg transition-all duration-200 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Opening Payment...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              Claim My Free Soap — Pay ₹{BOGO_PRICE}
            </>
          )}
        </button>

        {error && <p className="mt-3 text-sm text-red-600 text-center bg-red-50 rounded-xl p-3">{error}</p>}

        {/* Reassurance row */}
        <div className="grid grid-cols-3 gap-3 mt-5 text-center">
          {[
            { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", label: "100% Secure" },
            { icon: "M5 12h14M5 12l4-4m-4 4 4 4", label: "Free Delivery" },
            { icon: "M3 10h10a8 8 0 0 1 8 8v2M3 10l4-4M3 10l4 4", label: "Easy Returns" },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl p-3 border border-[#EDE6D6]">
              <svg className="w-5 h-5 mx-auto mb-1.5 text-[#2D5016]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d={item.icon}/>
              </svg>
              <p className="text-xs text-[#6B6B6B] font-medium">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Razorpay trust */}
        <p className="text-center text-xs text-[#6B6B6B] mt-3">
          Secured by Razorpay · UPI · Cards · NetBanking · Wallets
        </p>

        {/* Social proof */}
        <div className="mt-8">
          <p className="text-center text-xs uppercase tracking-widest text-[#6B6B6B] font-semibold mb-4">
            What customers are saying
          </p>
          <div className="space-y-3">
            {REVIEWS.map((r) => (
              <div key={r.name} className="bg-white rounded-xl p-4 border border-[#EDE6D6]">
                <div className="flex items-center gap-0.5 mb-1.5">
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 text-[#D4A017]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-[#1C1C1C] leading-relaxed mb-1">&ldquo;{r.text}&rdquo;</p>
                <p className="text-xs text-[#6B6B6B]">{r.name} · {r.city}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ-style objection busters */}
        <div className="mt-8 bg-white rounded-2xl p-5 border border-[#EDE6D6] space-y-4">
          <h3 className="font-bold text-[#1C1C1C] text-sm uppercase tracking-wide">Common Questions</h3>
          {[
            { q: "Is this offer real?", a: "Yes. Buy any 1 soap and we'll ship both to you. No tricks, no fine print. The offer expires when the timer hits zero." },
            { q: "Both soaps in one delivery?", a: "Absolutely. Both the Activated Charcoal and Saffron Haldi Chandan soaps are packed together and shipped within 24 hours of ordering." },
            { q: "What if I don't like it?", a: "We offer a 7-day hassle-free return policy. Not satisfied? We'll figure it out — just WhatsApp us." },
          ].map((item) => (
            <div key={item.q}>
              <p className="text-sm font-semibold text-[#1C1C1C] mb-1">{item.q}</p>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>

        {/* Final CTA repeat */}
        <div className="mt-6 text-center">
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-[#8B1A1A] hover:bg-[#A02020] text-white font-bold py-5 rounded-2xl text-lg transition-all duration-200 hover:shadow-xl disabled:opacity-70"
          >
            {loading ? "Opening Payment..." : `Claim My Free Soap — Pay ₹${BOGO_PRICE}`}
          </button>
          <p className="text-xs text-[#6B6B6B] mt-2">
            Offer expires in {pad(h)}h {pad(m)}m {pad(s)}s
          </p>
        </div>

        <p className="text-center text-xs text-[#6B6B6B] mt-6 pb-4">
          &copy; {new Date().getFullYear()} Hardin Organics · All rights reserved
        </p>
      </div>
    </div>
  );
}
