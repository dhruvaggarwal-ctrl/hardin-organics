"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type Step = "mobile" | "otp";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const t = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCountdown]);

  async function sendOtp() {
    const trimmed = mobile.trim().replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(trimmed)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to send OTP."); return; }
      setStep("otp");
      setResendCountdown(30);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    setError("");
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
    if (next.every((d) => d !== "") && next.join("").length === 6) {
      verifyOtp(next.join(""));
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  async function verifyOtp(code?: string) {
    const otpCode = code || otp.join("");
    if (otpCode.length !== 6) { setError("Enter the full 6-digit OTP."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: mobile.replace(/\D/g, ""), otp: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Incorrect OTP."); setLoading(false); return; }
      router.push("/account/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  async function resendOtp() {
    setOtp(["", "", "", "", "", ""]);
    setError("");
    await sendOtp();
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Green banner */}
      <div className="bg-[#2D5016] pt-12 pb-28 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none select-none">
          {["🌿", "✨", "🌿", "✨", "🌿"].map((e, i) => (
            <span key={i} className="absolute text-5xl" style={{ left: `${8 + i * 21}%`, top: `${15 + (i % 2) * 45}%` }}>{e}</span>
          ))}
        </div>
        <Link href="/">
          <Image src="/images/hardin-logo.png" alt="Hardin Organics" width={100} height={40} className="mx-auto h-10 w-auto object-contain brightness-0 invert mb-4" />
        </Link>
        <h1 className="text-2xl font-bold text-white font-display">My Account</h1>
        <p className="text-white/60 text-sm mt-1">
          {step === "mobile" ? "Sign in with your mobile number" : `OTP sent to +91 ${mobile.replace(/\D/g, "")}`}
        </p>
      </div>

      {/* Card */}
      <div className="max-w-sm mx-auto px-4 -mt-16 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {step === "mobile" ? (
              <motion.div
                key="mobile"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-7"
              >
                <div className="w-12 h-12 bg-[#F5F0E8] rounded-2xl flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-[#2D5016]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>

                <h2 className="text-xl font-bold text-[#1C1C1C] mb-1">Enter your mobile</h2>
                <p className="text-sm text-[#6B6B6B] mb-6">We&apos;ll send you a one-time password</p>

                <form onSubmit={(e) => { e.preventDefault(); sendOtp(); }} className="space-y-4">
                  <div className="flex rounded-xl border border-[#EDE6D6] overflow-hidden focus-within:ring-2 focus-within:ring-[#2D5016] focus-within:border-transparent transition">
                    <span className="flex items-center px-4 bg-[#F5F0E8] text-[#6B6B6B] text-sm font-medium border-r border-[#EDE6D6] shrink-0">+91</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={mobile}
                      onChange={(e) => { setMobile(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
                      placeholder="98765 43210"
                      autoFocus
                      className="flex-1 px-4 py-3.5 text-sm text-[#1C1C1C] focus:outline-none bg-white"
                    />
                  </div>

                  {error && (
                    <p className="text-xs text-red-500 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      </svg>
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading || mobile.replace(/\D/g, "").length !== 10}
                    className="w-full bg-[#2D5016] text-white font-bold py-4 rounded-2xl hover:bg-[#3D6B20] transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending&hellip;</>
                    ) : (
                      "Send OTP →"
                    )}
                  </button>
                </form>

                <p className="text-center text-xs text-[#9B9B9B] mt-5">
                  New here? We&apos;ll create your account automatically.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-7"
              >
                <button
                  onClick={() => { setStep("mobile"); setOtp(["", "", "", "", "", ""]); setError(""); }}
                  className="flex items-center gap-1.5 text-xs text-[#6B6B6B] hover:text-[#1C1C1C] mb-5 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Change number
                </button>

                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                <h2 className="text-xl font-bold text-[#1C1C1C] mb-1">Enter OTP</h2>
                <p className="text-sm text-[#6B6B6B] mb-6">
                  6-digit code sent to{" "}
                  <span className="font-semibold text-[#1C1C1C]">+91 {mobile.replace(/\D/g, "")}</span>
                </p>

                {/* OTP boxes */}
                <div className="flex gap-2.5 justify-center mb-4">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={`w-11 h-13 text-center text-xl font-bold border-2 rounded-xl transition-all focus:outline-none ${
                        digit ? "border-[#2D5016] bg-[#F5F0E8] text-[#2D5016]" : "border-[#EDE6D6] bg-white text-[#1C1C1C]"
                      } focus:border-[#2D5016]`}
                      style={{ height: "3.25rem" }}
                    />
                  ))}
                </div>

                {error && (
                  <p className="text-xs text-red-500 text-center mb-3 flex items-center justify-center gap-1.5">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                    {error}
                  </p>
                )}

                <button
                  onClick={() => verifyOtp()}
                  disabled={loading || otp.some((d) => !d)}
                  className="w-full bg-[#2D5016] text-white font-bold py-4 rounded-2xl hover:bg-[#3D6B20] transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Verifying&hellip;</>
                  ) : (
                    "Verify & Continue →"
                  )}
                </button>

                <div className="text-center mt-4">
                  {resendCountdown > 0 ? (
                    <p className="text-xs text-[#9B9B9B]">Resend OTP in {resendCountdown}s</p>
                  ) : (
                    <button onClick={resendOtp} className="text-xs text-[#2D5016] font-semibold hover:underline">
                      Resend OTP
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <p className="text-center text-xs text-[#9B9B9B] mt-5">
          <Link href="/" className="hover:underline">← Back to store</Link>
        </p>
      </div>
    </div>
  );
}
