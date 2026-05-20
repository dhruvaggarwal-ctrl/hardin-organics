"use client";

import Link from "next/link";

export default function TrackError() {
  return (
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col items-center justify-center px-4 py-16">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-xl">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[#1C1C1C] mb-2">Something went wrong</h2>
        <p className="text-[#6B6B6B] text-sm mb-6 leading-relaxed">
          We couldn&apos;t load your tracking details. Please try again or contact us on WhatsApp.
        </p>
        <Link
          href="/track"
          className="block w-full bg-[#2D5016] text-white font-bold py-3.5 rounded-2xl hover:bg-[#3D6B20] transition-colors text-sm mb-2"
        >
          Try Again
        </Link>
        <a
          href="https://wa.me/919650595027"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full border border-[#EDE6D6] text-[#6B6B6B] font-semibold py-3.5 rounded-2xl hover:border-[#2D5016] hover:text-[#2D5016] transition-all text-sm"
        >
          WhatsApp Support
        </a>
      </div>
    </div>
  );
}
