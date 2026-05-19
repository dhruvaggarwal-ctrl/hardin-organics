"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  sendSignInLinkToEmail,
} from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase/client";

type Step = "mobile" | "otp" | "email" | "email-sent";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("mobile");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

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
      // Always clear and recreate reCAPTCHA — avoids stale-verifier errors
      if (recaptchaRef.current) {
        recaptchaRef.current.clear();
        recaptchaRef.current = null;
      }
      recaptchaRef.current = new RecaptchaVerifier(firebaseAuth, "recaptcha-container", {
        size: "invisible",
        "expired-callback": () => { recaptchaRef.current = null; },
      });
      await recaptchaRef.current.render();

      const result = await signInWithPhoneNumber(firebaseAuth, `+91${trimmed}`, recaptchaRef.current);
      confirmationRef.current = result;
      setStep("otp");
      setResendCountdown(30);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err: unknown) {
      console.error("[Firebase Phone Auth error]", err);
      const code = (err as { code?: string }).code ?? "";
      if (code === "auth/captcha-check-failed" || code === "auth/internal-error") {
        setError("Domain not authorised for Firebase. Add this site's URL in Firebase Console → Authentication → Settings → Authorised domains.");
      } else if (code === "auth/quota-exceeded" || code === "auth/too-many-requests") {
        setError("SMS limit reached. Please try again in a few minutes.");
      } else if (code === "auth/invalid-phone-number") {
        setError("Invalid phone number. Please check and try again.");
      } else if (code === "auth/operation-not-allowed") {
        setError("Phone sign-in is not enabled in Firebase. Enable it under Authentication → Sign-in method.");
      } else {
        setError(`Failed to send OTP (${code || "unknown"}). Please try again.`);
      }
      if (recaptchaRef.current) { recaptchaRef.current.clear(); recaptchaRef.current = null; }
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
    if (next.every((d) => d !== "")) verifyOtp(next.join(""));
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
  }

  async function verifyOtp(code?: string) {
    const otpCode = code || otp.join("");
    if (otpCode.length !== 6) { setError("Enter the full 6-digit OTP."); return; }
    if (!confirmationRef.current) { setError("Session expired. Please resend OTP."); return; }
    setError("");
    setLoading(true);
    try {
      const result = await confirmationRef.current.confirm(otpCode);
      const idToken = await result.user.getIdToken();
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) throw new Error("Session creation failed");
      router.push("/account/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("invalid-verification-code") || msg.includes("Session creation failed")) {
        setError("Incorrect OTP. Please try again.");
      } else {
        setError("Verification failed. Please try again.");
      }
      setLoading(false);
    }
  }

  async function sendEmailLink() {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/account/verify?email=${encodeURIComponent(email)}`,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(firebaseAuth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      setStep("email-sent");
    } catch (err) {
      console.error(err);
      setError("Failed to send email. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Invisible reCAPTCHA container */}
      <div id="recaptcha-container" />

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
          {step === "otp" ? `OTP sent to +91 ${mobile.replace(/\D/g, "")}` :
           step === "email-sent" ? `Check your inbox at ${email}` :
           "Sign in to view your orders"}
        </p>
      </div>

      <div className="max-w-sm mx-auto px-4 -mt-16 pb-16 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <AnimatePresence mode="wait">

            {/* Mobile step */}
            {step === "mobile" && (
              <motion.div key="mobile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-7">
                <div className="w-12 h-12 bg-[#F5F0E8] rounded-2xl flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-[#2D5016]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-[#1C1C1C] mb-1">Enter your mobile</h2>
                <p className="text-sm text-[#6B6B6B] mb-6">We&apos;ll send a one-time password via SMS</p>
                <form onSubmit={(e) => { e.preventDefault(); sendOtp(); }} className="space-y-4">
                  <div className="flex rounded-xl border border-[#EDE6D6] overflow-hidden focus-within:ring-2 focus-within:ring-[#2D5016] focus-within:border-transparent transition">
                    <span className="flex items-center px-4 bg-[#F5F0E8] text-[#6B6B6B] text-sm font-medium border-r border-[#EDE6D6] shrink-0">+91</span>
                    <input
                      type="tel" inputMode="numeric"
                      value={mobile}
                      onChange={(e) => { setMobile(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
                      placeholder="98765 43210"
                      autoFocus
                      className="flex-1 px-4 py-3.5 text-sm text-[#1C1C1C] focus:outline-none bg-white"
                    />
                  </div>
                  {error && <p className="text-xs text-red-500">{error}</p>}
                  <button type="submit" disabled={loading || mobile.replace(/\D/g, "").length !== 10}
                    className="w-full bg-[#2D5016] text-white font-bold py-4 rounded-2xl hover:bg-[#3D6B20] transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending…</> : "Send OTP →"}
                  </button>
                </form>

                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#EDE6D6]" /></div>
                  <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-[#9B9B9B]">or</span></div>
                </div>

                <button onClick={() => { setStep("email"); setError(""); }}
                  className="w-full border border-[#EDE6D6] text-[#6B6B6B] font-semibold py-3.5 rounded-2xl hover:border-[#2D5016] hover:text-[#2D5016] transition-all text-sm">
                  Sign in with Email →
                </button>
                <p className="text-center text-xs text-[#9B9B9B] mt-4">New here? We&apos;ll create your account automatically.</p>
              </motion.div>
            )}

            {/* OTP step */}
            {step === "otp" && (
              <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="p-7">
                <button onClick={() => { setStep("mobile"); setOtp(["","","","","",""]); setError(""); }} className="flex items-center gap-1.5 text-xs text-[#6B6B6B] hover:text-[#1C1C1C] mb-5 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  Change number
                </button>
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-[#1C1C1C] mb-1">Enter OTP</h2>
                <p className="text-sm text-[#6B6B6B] mb-6">6-digit code sent to <span className="font-semibold text-[#1C1C1C]">+91 {mobile.replace(/\D/g, "")}</span></p>
                <div className="flex gap-2.5 justify-center mb-4">
                  {otp.map((digit, i) => (
                    <input key={i} ref={(el) => { otpRefs.current[i] = el; }}
                      type="text" inputMode="numeric" maxLength={1} value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={`w-11 text-center text-xl font-bold border-2 rounded-xl transition-all focus:outline-none ${digit ? "border-[#2D5016] bg-[#F5F0E8] text-[#2D5016]" : "border-[#EDE6D6] bg-white"} focus:border-[#2D5016]`}
                      style={{ height: "3.25rem" }}
                    />
                  ))}
                </div>
                {error && <p className="text-xs text-red-500 text-center mb-3">{error}</p>}
                <button onClick={() => verifyOtp()} disabled={loading || otp.some((d) => !d)}
                  className="w-full bg-[#2D5016] text-white font-bold py-4 rounded-2xl hover:bg-[#3D6B20] transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Verifying…</> : "Verify & Continue →"}
                </button>
                <div className="text-center mt-4">
                  {resendCountdown > 0 ? <p className="text-xs text-[#9B9B9B]">Resend in {resendCountdown}s</p> :
                    <button onClick={sendOtp} className="text-xs text-[#2D5016] font-semibold hover:underline">Resend OTP</button>}
                </div>
              </motion.div>
            )}

            {/* Email step */}
            {step === "email" && (
              <motion.div key="email" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-7">
                <button onClick={() => { setStep("mobile"); setError(""); }} className="flex items-center gap-1.5 text-xs text-[#6B6B6B] hover:text-[#1C1C1C] mb-5 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  Back
                </button>
                <div className="w-12 h-12 bg-[#F5F0E8] rounded-2xl flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-[#2D5016]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-[#1C1C1C] mb-1">Sign in with email</h2>
                <p className="text-sm text-[#6B6B6B] mb-6">We&apos;ll send you a secure sign-in link</p>
                <form onSubmit={(e) => { e.preventDefault(); sendEmailLink(); }} className="space-y-4">
                  <input type="email" value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="you@email.com" autoFocus
                    className="w-full border border-[#EDE6D6] rounded-xl px-4 py-3.5 text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent transition"
                  />
                  {error && <p className="text-xs text-red-500">{error}</p>}
                  <button type="submit" disabled={loading || !email.trim()}
                    className="w-full bg-[#2D5016] text-white font-bold py-4 rounded-2xl hover:bg-[#3D6B20] transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending…</> : "Send Sign-in Link →"}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Email sent */}
            {step === "email-sent" && (
              <motion.div key="email-sent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-7 text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-[#1C1C1C] mb-2">Check your inbox!</h2>
                <p className="text-sm text-[#6B6B6B] leading-relaxed mb-6">
                  We sent a sign-in link to <strong className="text-[#1C1C1C]">{email}</strong>.<br />Click the link in the email to sign in.
                </p>
                <button onClick={() => { setStep("email"); setEmail(""); }}
                  className="text-sm text-[#2D5016] font-semibold hover:underline">Try a different email</button>
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
