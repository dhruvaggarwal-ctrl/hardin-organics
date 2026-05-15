"use client";

import { use, useState } from "react";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{
    orderId?: string;
    method?: string;
    name?: string;
    mobile?: string;
    total?: string;
  }>;
}

export default function OrderConfirmationPage({ searchParams }: PageProps) {
  const { orderId, method, name, mobile, total } = use(searchParams);
  const [copied, setCopied] = useState(false);

  const isPaid = method === "paid";
  const lastFour = mobile ? mobile.slice(-4) : "XXXX";
  const firstName = name ? name.split(" ")[0] : "";

  const waText = encodeURIComponent(
    `Hi! I placed an order ${orderId || ""}. Can you share the tracking details?`
  );

  function copyOrderId() {
    if (orderId) {
      navigator.clipboard?.writeText(orderId).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] py-12 px-4">
      {/* Inline keyframes for the checkmark draw animation */}
      <style>{`
        @keyframes drawCheck {
          from { stroke-dashoffset: 50; }
          to   { stroke-dashoffset: 0; }
        }
        .animate-check path {
          stroke-dasharray: 50;
          stroke-dashoffset: 50;
          animation: drawCheck 0.55s 0.35s ease forwards;
        }
        @keyframes popIn {
          0%   { transform: scale(0.6); opacity: 0; }
          70%  { transform: scale(1.1); }
          100% { transform: scale(1);   opacity: 1; }
        }
        .animate-pop { animation: popIn 0.45s ease forwards; }
      `}</style>

      <div className="max-w-md mx-auto">
        {/* Checkmark */}
        <div className="flex justify-center mb-8">
          <div className="animate-pop w-24 h-24 rounded-full bg-[#A0522D]/12 flex items-center justify-center">
            <svg
              className="animate-check w-11 h-11 text-[#A0522D]"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          {/* Top banner */}
          <div className="bg-[#2D5016] px-8 py-6 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white font-display mb-1">
              Order Placed Successfully!
            </h1>
            {firstName && (
              <p className="text-green-200 text-sm">
                Thank you, {firstName}! Your handcrafted soaps are being prepared.
              </p>
            )}
          </div>

          <div className="p-6 md:p-8 space-y-5">
            {/* Order ID */}
            {orderId && (
              <div className="bg-[#F5F0E8] rounded-2xl p-4 text-center">
                <p className="text-xs text-[#6B6B6B] mb-1 uppercase tracking-wide">Order ID</p>
                <p className="font-mono font-bold text-[#1C1C1C] text-xl tracking-widest mb-2">
                  {orderId}
                </p>
                <button
                  onClick={copyOrderId}
                  className="text-xs text-[#A0522D] hover:text-[#8B4513] transition-colors font-medium"
                >
                  {copied ? "✓ Copied!" : "Copy Order ID"}
                </button>
              </div>
            )}

            {/* Delivery status */}
            <div className={`rounded-xl p-4 text-sm font-medium leading-relaxed ${
              isPaid
                ? "bg-green-50 border border-green-100 text-green-800"
                : "bg-blue-50 border border-blue-100 text-blue-800"
            }`}>
              {isPaid ? (
                <>
                  ✅ <strong>Payment confirmed.</strong> Your order will be shipped within 24 hours.
                </>
              ) : (
                <>
                  💰 <strong>Cash on Delivery.</strong>{" "}
                  Pay ₹{total} when your order arrives. Delivery in 4–6 business days.
                </>
              )}
            </div>

            {/* Mobile note */}
            <p className="text-xs text-[#6B6B6B] text-center">
              You&apos;ll receive updates on your mobile number ending in{" "}
              <span className="font-semibold text-[#1C1C1C]">••••{lastFour}</span>
            </p>

            {/* CTAs */}
            <div className="space-y-3 pt-1">
              <a
                href={`https://wa.me/919871900959?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full bg-[#25D366] text-white font-bold py-4 rounded-xl hover:bg-[#1EBD59] transition-colors text-sm"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Track on WhatsApp →
              </a>
              <Link
                href="/shop"
                className="block w-full text-center border-2 border-[#2D5016] text-[#2D5016] font-bold py-3.5 rounded-xl hover:bg-[#2D5016] hover:text-white transition-all text-sm"
              >
                Shop More →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
