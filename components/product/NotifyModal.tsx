"use client";

import { useState, useEffect } from "react";

interface Props {
  productSlug: string;
  productName: string;
  onClose: () => void;
}

export function NotifyModal({ productSlug, productName, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Auto-close after success
  useEffect(() => {
    if (success) {
      const t = setTimeout(onClose, 3000);
      return () => clearTimeout(t);
    }
  }, [success, onClose]);

  // Close on Escape
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setError("Please enter your email"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Please enter a valid email"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/notify/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mobile: mobile || undefined, productSlug, productName }),
      });
      if (!res.ok) throw new Error("Failed");
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />

      {/* Sheet on mobile, centered modal on desktop */}
      <div className="fixed z-50 bottom-0 inset-x-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-sm bg-white rounded-t-3xl md:rounded-2xl p-6 shadow-2xl">
        {success ? (
          <div className="flex flex-col items-center text-center py-4">
            {/* Animated checkmark */}
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4 animate-pop-in">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#1C1C1A] mb-2">You&apos;re on the list!</h3>
            <p className="text-sm text-[#6B6B6B]">We&apos;ll email you the moment {productName} is back in stock.</p>
            <p className="text-xs text-[#6B6B6B] mt-3">Closing in 3 seconds…</p>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-[#1C1C1A]">We&apos;ll let you know when it&apos;s back.</h3>
                <p className="text-sm text-[#6B6B6B] mt-1">No spam. Just one email when <strong>{productName}</strong> is back in stock.</p>
              </div>
              <button onClick={onClose} className="text-[#6B6B6B] hover:text-[#1C1C1A] ml-3 text-2xl leading-none">×</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#A0522D]"
                  required
                />
              </div>
              <div>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="Mobile (optional — for WhatsApp alert)"
                  maxLength={10}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#A0522D]"
                />
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#A0522D] text-white font-bold py-3 rounded-xl hover:bg-[#8B4513] transition-colors disabled:opacity-60"
              >
                {loading ? "Saving…" : "Notify Me"}
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
}
