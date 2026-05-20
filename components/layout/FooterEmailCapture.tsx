"use client";

import { useState, useRef } from "react";

type Step = "email" | "otp" | "success";

export function FooterEmailCapture() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [copied, setCopied] = useState(false);
  const otpRef = useRef<HTMLInputElement>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/email-coupon/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.alreadyClaimed ? "Already claimed! Check your inbox." : (data.error || "Something went wrong."));
      } else {
        setStep("otp");
        setTimeout(() => otpRef.current?.focus(), 100);
      }
    } catch { setError("Network error. Try again."); }
    finally { setLoading(false); }
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
      if (!res.ok) { setError(data.error || "Incorrect code."); }
      else { setCouponCode(data.couponCode); setStep("success"); }
    } catch { setError("Network error. Try again."); }
    finally { setLoading(false); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-6">
      <p className="text-sm text-gray-400 mb-2">Get 10% off your first order:</p>

      {step === "email" && (
        <form onSubmit={handleEmailSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
            className="flex-1 bg-white/10 text-white placeholder-gray-500 text-sm px-3 py-2 rounded-lg border border-white/20 focus:outline-none focus:border-[#D4A017]"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#D4A017] text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#E8B52A] transition-colors disabled:opacity-60"
          >
            {loading ? "..." : "→"}
          </button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleOtpSubmit} className="space-y-2">
          <p className="text-xs text-gray-400">Code sent to <span className="text-white">{email}</span></p>
          <div className="flex gap-2">
            <input
              ref={otpRef}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="6-digit code"
              className="flex-1 bg-white/10 text-white placeholder-gray-500 text-sm px-3 py-2 rounded-lg border border-white/20 focus:outline-none focus:border-[#D4A017] tracking-widest text-center font-bold"
            />
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="bg-[#D4A017] text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#E8B52A] transition-colors disabled:opacity-60"
            >
              {loading ? "..." : "✓"}
            </button>
          </div>
          <button type="button" onClick={() => { setStep("email"); setOtp(""); setError(""); }} className="text-xs text-gray-500 hover:text-gray-300">
            ← Change email
          </button>
        </form>
      )}

      {step === "success" && (
        <div>
          <p className="text-xs text-gray-400 mb-2">✓ Email verified! Your code:</p>
          <button
            onClick={handleCopy}
            className="w-full bg-white/10 border border-[#D4A017] rounded-lg px-3 py-2 flex items-center justify-between hover:bg-white/20 transition-colors"
          >
            <span className="text-[#D4A017] font-bold tracking-widest text-sm">{couponCode}</span>
            <span className="text-xs text-gray-400">{copied ? "✓ Copied!" : "Tap to copy"}</span>
          </button>
        </div>
      )}

      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
