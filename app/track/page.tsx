"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TrackOrderPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = orderId.trim().toUpperCase();
    if (!trimmed) { setError("Please enter your Order ID."); return; }

    setError("");
    setLoading(true);

    // Verify the order exists before redirecting
    const res = await fetch(`/api/track/${encodeURIComponent(trimmed)}`);
    if (res.status === 404) {
      setError("We couldn't find an order with that ID. Please check and try again.");
      setLoading(false);
      return;
    }

    router.push(`/track/${trimmed}`);
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col">
      {/* Banner */}
      <div className="bg-[#2D5016] pt-14 pb-28 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none select-none">
          {["🌿", "✨", "🌿", "✨", "🌿"].map((e, i) => (
            <span key={i} className="absolute text-5xl" style={{ left: `${8 + i * 21}%`, top: `${15 + (i % 2) * 45}%` }}>{e}</span>
          ))}
        </div>

        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 ring-2 ring-white/30">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-white font-display mb-1">Track Your Order</h1>
        <p className="text-white/70 text-sm">Enter your Order ID to see live shipping updates</p>
      </div>

      {/* Card */}
      <div className="max-w-md mx-auto w-full px-4 -mt-16 pb-16 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#6B6B6B] uppercase tracking-widest mb-2">
                Order ID
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => { setOrderId(e.target.value); setError(""); }}
                placeholder="e.g. HO-20240501-XXXX"
                className="w-full border border-[#EDE6D6] rounded-xl px-4 py-3.5 text-sm font-mono text-[#1C1C1C] placeholder-[#C4C4C4] focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent transition"
                autoFocus
              />
              {error && (
                <p className="mt-2 text-xs text-red-500 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2D5016] text-white font-bold py-4 rounded-2xl hover:bg-[#3D6B20] transition-colors text-sm disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Looking up…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Track Order
                </>
              )}
            </button>
          </form>

          {/* Hint */}
          <div className="mt-5 flex items-start gap-2.5 bg-[#F5F0E8] rounded-xl px-4 py-3">
            <svg className="w-4 h-4 text-[#6B6B6B] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              Your Order ID was shared in the confirmation message after you placed your order.
            </p>
          </div>
        </div>

        {/* Support */}
        <p className="text-center text-xs text-[#6B6B6B] mt-5">
          Can&apos;t find your Order ID?{" "}
          <a
            href="https://wa.me/919650595027?text=Hi%21%20I%20need%20help%20tracking%20my%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2D5016] font-semibold hover:underline"
          >
            WhatsApp us
          </a>
          {" "}or{" "}
          <Link href="/account/dashboard" className="text-[#2D5016] font-semibold hover:underline">
            sign in to your account
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
