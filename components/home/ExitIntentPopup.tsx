"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Step = "email" | "otp" | "success";

export function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [step, setStep] = useState<Step>("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [copied, setCopied] = useState(false);
  const otpRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (dismissed) return;
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) setIsOpen(true);
    };
    const timer = setTimeout(() => {
      if (typeof window !== "undefined" && window.innerWidth < 768) setIsOpen(true);
    }, 15000);
    document.addEventListener("mouseleave", onMouseLeave);
    return () => { document.removeEventListener("mouseleave", onMouseLeave); clearTimeout(timer); };
  }, [dismissed]);

  const handleClose = () => { setIsOpen(false); setDismissed(true); };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/email-coupon/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "exit-popup" }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.alreadyClaimed) {
          setError("This email already has a discount code. Check your inbox!");
        } else {
          setError(data.error || "Something went wrong.");
        }
      } else {
        setStep("otp");
        setTimeout(() => otpRef.current?.focus(), 100);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/email-coupon/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Incorrect code.");
      } else {
        setCouponCode(data.couponCode);
        setStep("success");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="bg-[#2D5016] p-6 text-center relative">
              <button onClick={handleClose} className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl">×</button>
              <h3 className="text-3xl font-bold text-white">Wait! Before You Go...</h3>
              <p className="text-white/80 mt-2 text-sm">Your skin deserves the best. Don&apos;t leave empty-handed.</p>
            </div>

            <div className="p-6 text-center">

              {/* ── Step 1: Email ── */}
              {step === "email" && (
                <>
                  <div className="bg-[#F5F0E8] rounded-2xl p-4 mb-5">
                    <div className="text-3xl font-bold text-[#C4622D]">10% OFF</div>
                    <div className="text-sm text-[#6B6B6B]">on your first order</div>
                  </div>
                  <p className="text-[#1C1C1C] text-sm mb-5">
                    Enter your email and we&apos;ll send you a verification code to unlock your discount.
                  </p>
                  <form onSubmit={handleEmailSubmit} className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2D5016]"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#C4622D] text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-[#D4734A] transition-colors shrink-0 disabled:opacity-60"
                    >
                      {loading ? "..." : "Get Code"}
                    </button>
                  </form>
                  {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                  <button onClick={handleClose} className="mt-4 text-xs text-[#6B6B6B] hover:text-[#1C1C1C]">
                    No thanks, I&apos;ll pay full price
                  </button>
                </>
              )}

              {/* ── Step 2: OTP ── */}
              {step === "otp" && (
                <>
                  <div className="w-14 h-14 bg-[#E8F0E0] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-[#2D5016]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-[#1C1C1C] mb-1">Check your email</h4>
                  <p className="text-[#6B6B6B] text-sm mb-5">
                    We sent a 6-digit code to <strong>{email}</strong>
                  </p>
                  <form onSubmit={handleOtpSubmit} className="space-y-3">
                    <input
                      ref={otpRef}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="Enter 6-digit code"
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center text-2xl font-bold tracking-widest focus:outline-none focus:border-[#2D5016]"
                    />
                    <button
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      className="w-full bg-[#C4622D] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#D4734A] transition-colors disabled:opacity-60"
                    >
                      {loading ? "Verifying..." : "Verify & Get Discount"}
                    </button>
                  </form>
                  {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                  <button
                    onClick={() => { setStep("email"); setOtp(""); setError(""); }}
                    className="mt-3 text-xs text-[#6B6B6B] hover:text-[#1C1C1C]"
                  >
                    ← Use a different email
                  </button>
                </>
              )}

              {/* ── Step 3: Success ── */}
              {step === "success" && (
                <div className="py-2">
                  <div className="w-14 h-14 bg-[#E8F0E0] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-[#2D5016]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-[#2D5016] mb-2">Your code is ready! 🎉</h4>
                  <p className="text-[#6B6B6B] text-sm mb-5">Apply this at checkout for 10% off your first order.</p>
                  <button
                    onClick={handleCopy}
                    className="w-full bg-[#F5F0E8] rounded-xl p-4 flex items-center justify-between group hover:bg-[#EDE6D6] transition-colors"
                  >
                    <span className="text-2xl font-bold text-[#C4622D] tracking-widest">{couponCode}</span>
                    <span className="text-xs font-medium text-[#6B6B6B] group-hover:text-[#2D5016]">
                      {copied ? "✓ Copied!" : "Tap to copy"}
                    </span>
                  </button>
                  <button
                    onClick={handleClose}
                    className="mt-4 w-full bg-[#2D5016] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#3D6B20] transition-colors"
                  >
                    Shop Now →
                  </button>
                </div>
              )}

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
