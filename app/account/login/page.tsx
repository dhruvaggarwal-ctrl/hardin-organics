"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setError("Please enter your email"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed");
      setSent(true);
    } catch {
      setError("Couldn't send the link. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/">
            <Image src="/images/hardin-logo.png" alt="Hardin Organics" width={120} height={48} className="mx-auto h-12 w-auto object-contain" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {sent ? (
            <div className="text-center">
              <div className="text-5xl mb-4">📬</div>
              <h2 className="text-xl font-bold text-[#1C1C1A] mb-2">Check your inbox!</h2>
              <p className="text-[#6B6B6B] text-sm leading-relaxed">
                We sent a login link to <strong>{email}</strong>.<br />Link expires in 15 minutes.
              </p>
              <button
                onClick={() => { setSent(false); setEmail(""); }}
                className="mt-6 text-sm text-[#A0522D] hover:underline"
              >
                Try a different email
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-[#1C1C1A] mb-1">Welcome back</h1>
              <p className="text-sm text-[#6B6B6B] mb-6">No password needed. We&apos;ll email you a secure link.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#A0522D]"
                  />
                </div>
                {error && <p className="text-red-500 text-xs">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#A0522D] text-white font-bold py-3 rounded-xl hover:bg-[#8B4513] transition-colors disabled:opacity-60"
                >
                  {loading ? "Sending…" : "Send Login Link"}
                </button>
              </form>

              <p className="text-center text-xs text-[#6B6B6B] mt-6">
                New here? We&apos;ll create your account automatically.
              </p>
            </>
          )}
        </div>

        <p className="text-center text-xs text-[#6B6B6B] mt-6">
          <Link href="/" className="hover:underline">← Back to store</Link>
        </p>
      </div>
    </div>
  );
}
