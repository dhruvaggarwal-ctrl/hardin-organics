"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = use(searchParams);
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) { setStatus("error"); return; }
    fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        if (res.ok) {
          setStatus("success");
          setTimeout(() => router.replace("/account/dashboard"), 1500);
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [token, router]);

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-sm w-full text-center">
        {status === "loading" && (
          <>
            <div className="animate-spin w-10 h-10 border-4 border-[#A0522D] border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-[#6B6B6B]">Verifying your link…</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-[#1C1C1A] mb-2">You&apos;re logged in!</h2>
            <p className="text-[#6B6B6B] text-sm">Redirecting to your account…</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-[#1C1C1A] mb-2">Link expired or invalid</h2>
            <p className="text-[#6B6B6B] text-sm mb-6">This login link has expired or already been used. Request a new one.</p>
            <Link href="/account/login" className="inline-block bg-[#A0522D] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#8B4513] transition-colors">
              Request new link
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
