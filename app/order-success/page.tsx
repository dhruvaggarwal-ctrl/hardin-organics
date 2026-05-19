"use client";

import Link from "next/link";
import { use, useState } from "react";
import { motion } from "framer-motion";

interface PageProps {
  searchParams: Promise<{ paymentId?: string; orderId?: string; name?: string }>;
}

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
      {/* Top banner */}
      <div className="bg-[#2D5016] pt-16 pb-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {["🌿", "✨", "🧼", "🌿", "✨"].map((e, i) => (
            <span key={i} className="absolute text-4xl" style={{ left: `${10 + i * 22}%`, top: `${20 + (i % 2) * 40}%` }}>{e}</span>
          ))}
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg"
        >
          <svg className="w-10 h-10 text-[#2D5016]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h1 className="text-3xl md:text-4xl font-bold text-white font-display mb-2">
            Payment Successful! 🎉
          </h1>
          <p className="text-white/75 text-base">
            Thank you, <span className="text-white font-semibold">{firstName}</span>! Your soaps are being handcrafted with love.
          </p>
        </motion.div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-12 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Order ID */}
          {orderId && (
            <div className="bg-[#F5F0E8] px-6 py-5 flex items-center justify-between border-b border-[#EDE6D6]">
              <div>
                <p className="text-xs text-[#6B6B6B] uppercase tracking-wider mb-0.5">Order ID</p>
                <p className="font-mono font-bold text-[#1C1C1C] text-lg tracking-wider">{orderId}</p>
              </div>
              <button
                onClick={copyOrderId}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all ${
                  copied ? "bg-green-100 text-green-700" : "bg-white text-[#A0522D] hover:bg-[#A0522D] hover:text-white border border-[#A0522D]"
                }`}
              >
                {copied ? (
                  <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg> Copied!</>
                ) : (
                  <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x={9} y={9} width={13} height={13} rx={2}/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy</>
                )}
              </button>
            </div>
          )}

          <div className="p-6 md:p-8 space-y-6">
            {/* Payment confirmed */}
            <div className="rounded-2xl p-4 flex items-start gap-3 bg-green-50 border border-green-100">
              <span className="text-2xl shrink-0">✅</span>
              <div>
                <p className="font-bold text-sm text-green-800">Payment Confirmed</p>
                <p className="text-xs mt-0.5 text-green-700">
                  Your order will be picked up & shipped within 24 hours. Delivery in 4–6 days.
                </p>
              </div>
            </div>

            {/* Payment ID */}
            {paymentId && (
              <div className="bg-[#F5F0E8] rounded-xl p-3">
                <p className="text-xs text-[#6B6B6B] mb-0.5">Payment ID</p>
                <p className="font-mono text-xs text-[#1C1C1C] break-all">{paymentId}</p>
              </div>
            )}

            {/* Journey steps */}
            <div>
              <p className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wider mb-4">Your Order Journey</p>
              <div className="flex items-start justify-between relative">
                <div className="absolute top-5 left-5 right-5 h-0.5 bg-[#EDE6D6]" />
                {[
                  { icon: "📦", label: "Confirmed" },
                  { icon: "🧼", label: "Packing" },
                  { icon: "🚚", label: "Shipped" },
                  { icon: "🏠", label: "Delivered" },
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 z-10 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm ${
                      i === 0 ? "bg-[#2D5016]" : "bg-white border-2 border-[#EDE6D6]"
                    }`}>
                      {step.icon}
                    </div>
                    <p className={`text-[10px] font-bold ${i === 0 ? "text-[#2D5016]" : "text-[#6B6B6B]"}`}>
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <circle cx={12} cy={11} r={3}/>
                  </svg>
                  Track My Order
                </Link>
              )}
              <Link
                href="/shop"
                className="block w-full text-center border-2 border-[#EDE6D6] text-[#6B6B6B] font-semibold py-3.5 rounded-2xl hover:border-[#2D5016] hover:text-[#2D5016] transition-all text-sm"
              >
                Continue Shopping →
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
          Questions? <a href="https://wa.me/919650595027" target="_blank" rel="noopener noreferrer" className="text-[#2D5016] font-semibold hover:underline">WhatsApp us</a>
        </motion.p>
      </div>
    </div>
  );
}
