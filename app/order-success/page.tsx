"use client";

import Link from "next/link";
import { use, useState } from "react";
import { motion } from "framer-motion";

interface PageProps {
  searchParams: Promise<{ paymentId?: string; orderId?: string; name?: string }>;
}

const steps = [
  {
    label: "Confirmed",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Packing",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
      </svg>
    ),
  },
  {
    label: "Shipped",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
  },
  {
    label: "Delivered",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
];

export default function OrderSuccessPage({ searchParams }: PageProps) {
  const { paymentId, orderId, name } = use(searchParams);
  const [copied, setCopied] = useState(false);
  const firstName = name ? name.split(" ")[0] : "Friend";

  function copyOrderId() {
    if (orderId) {
      navigator.clipboard?.writeText(orderId).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Top banner — tall enough so card floats clearly over it */}
      <div className="bg-[#2D5016] pt-14 pb-32 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none select-none">
          {["🌿", "✨", "🌿", "✨", "🌿"].map((e, i) => (
            <span key={i} className="absolute text-5xl" style={{ left: `${8 + i * 21}%`, top: `${15 + (i % 2) * 45}%` }}>{e}</span>
          ))}
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
        >
          <svg className="w-8 h-8 text-[#2D5016]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h1 className="text-3xl md:text-4xl font-bold text-white font-display mb-1">
            Payment Successful!
          </h1>
          <p className="text-white/70 text-sm">
            Thank you, <span className="text-white font-semibold">{firstName}</span>! Your soaps are being handcrafted with love.
          </p>
        </motion.div>
      </div>

      {/* Card floats up over banner */}
      <div className="max-w-lg mx-auto px-4 -mt-20 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Order ID strip */}
          {orderId && (
            <div className="bg-[#F5F0E8] px-6 py-4 flex items-center justify-between border-b border-[#EDE6D6]">
              <div>
                <p className="text-[10px] text-[#6B6B6B] uppercase tracking-widest mb-0.5">Order ID</p>
                <p className="font-mono font-bold text-[#1C1C1C] text-base tracking-wider">{orderId}</p>
              </div>
              <button
                onClick={copyOrderId}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition-all ${
                  copied
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-white border-[#EDE6D6] text-[#6B6B6B] hover:border-[#2D5016] hover:text-[#2D5016]"
                }`}
              >
                {copied ? (
                  <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>Copied</>
                ) : (
                  <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x={9} y={9} width={13} height={13} rx={2}/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy</>
                )}
              </button>
            </div>
          )}

          <div className="p-6 md:p-8 space-y-6">
            {/* Payment confirmed */}
            <div className="rounded-2xl p-4 flex items-start gap-3 bg-green-50 border border-green-100">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-green-100">
                <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-sm text-green-800">Payment Confirmed</p>
                <p className="text-xs mt-0.5 leading-relaxed text-green-700">
                  Your order will be picked up &amp; shipped within 24 hours. Delivery in 4–6 business days.
                </p>
              </div>
            </div>

            {/* Payment ID */}
            {paymentId && (
              <div className="bg-[#F5F0E8] rounded-xl p-3">
                <p className="text-[10px] text-[#6B6B6B] uppercase tracking-widest mb-0.5">Payment ID</p>
                <p className="font-mono text-xs text-[#1C1C1C] break-all">{paymentId}</p>
              </div>
            )}

            {/* Journey stepper */}
            <div>
              <p className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-widest mb-5">Your Order Journey</p>
              <div className="relative flex items-start justify-between">
                {/* connector line */}
                <div className="absolute top-5 left-5 right-5 h-px bg-[#EDE6D6]" />
                {steps.map((step, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 z-10 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm border-2 transition-colors ${
                      i === 0
                        ? "bg-[#2D5016] border-[#2D5016] text-white"
                        : "bg-white border-[#EDE6D6] text-[#C4C4C4]"
                    }`}>
                      {step.icon}
                    </div>
                    <p className={`text-[10px] font-semibold text-center ${i === 0 ? "text-[#2D5016]" : "text-[#BBBBBB]"}`}>
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-1">
              {orderId && (
                <Link
                  href={`/track/${orderId}`}
                  className="flex items-center justify-center gap-2.5 w-full bg-[#2D5016] text-white font-bold py-4 rounded-2xl hover:bg-[#3D6B20] transition-colors text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Track My Order
                </Link>
              )}
              <Link
                href="/shop"
                className="block w-full text-center border border-[#EDE6D6] text-[#6B6B6B] font-semibold py-3.5 rounded-2xl hover:border-[#2D5016] hover:text-[#2D5016] transition-all text-sm"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-[#6B6B6B] mt-6"
        >
          Questions?{" "}
          <a href="https://wa.me/919650595027" target="_blank" rel="noopener noreferrer" className="text-[#2D5016] font-semibold hover:underline">
            WhatsApp us
          </a>
        </motion.p>
      </div>
    </div>
  );
}
