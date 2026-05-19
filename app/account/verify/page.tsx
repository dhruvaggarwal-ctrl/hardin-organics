"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase/client";
import { Suspense } from "react";

function VerifyInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function verify() {
      const url = window.location.href;
      if (!isSignInWithEmailLink(firebaseAuth, url)) {
        setStatus("error");
        setErrorMsg("Invalid or expired sign-in link.");
        return;
      }

      let email = searchParams.get("email") || window.localStorage.getItem("emailForSignIn") || "";
      if (!email) {
        email = window.prompt("Please enter your email to confirm sign-in:") || "";
      }

      try {
        const result = await signInWithEmailLink(firebaseAuth, email, url);
        window.localStorage.removeItem("emailForSignIn");
        const idToken = await result.user.getIdToken();
        const res = await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });
        if (!res.ok) throw new Error("Session failed");
        setStatus("success");
        setTimeout(() => router.push("/account/dashboard"), 1000);
      } catch (err) {
        console.error(err);
        setStatus("error");
        setErrorMsg("Sign-in failed. The link may have expired. Please try again.");
      }
    }
    verify();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full text-center">
        {status === "verifying" && (
          <>
            <div className="w-12 h-12 border-4 border-[#2D5016] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#6B6B6B] text-sm">Verifying your sign-in link…</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-bold text-[#1C1C1C]">Signed in! Redirecting…</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="font-bold text-[#1C1C1C] mb-2">Sign-in failed</p>
            <p className="text-[#6B6B6B] text-sm mb-5">{errorMsg}</p>
            <a href="/account/login" className="block w-full bg-[#2D5016] text-white font-bold py-3.5 rounded-2xl text-sm hover:bg-[#3D6B20] transition-colors">
              Try Again
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyInner />
    </Suspense>
  );
}
