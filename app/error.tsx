"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-[#E8F0E0] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-[#2D5016]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#1C1C1C] mb-3 font-display">
          Something went wrong
        </h1>
        <p className="text-[#6B6B6B] mb-8">
          We hit a snag. Your cart and any in-progress order are safe — please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-[#C4622D] text-white font-bold px-6 py-3 rounded-full hover:bg-[#D4734A] transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="border-2 border-[#2D5016] text-[#2D5016] font-semibold px-6 py-3 rounded-full hover:bg-[#2D5016] hover:text-white transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
