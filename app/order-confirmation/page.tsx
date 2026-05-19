"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface PageProps {
  searchParams: Promise<{
    orderId?: string;
    method?: string;
    name?: string;
    mobile?: string;
    total?: string;
  }>;
}

const steps = [
  { icon: "📦", label: "Order Confirmed", desc: "We've received your order" },
  { icon: "🧼", label: "Being Packed", desc: "Handcrafted with care" },
  { icon: "🚚", label: "Shipped", desc: "On its way to you" },
  { icon: "🏠", label: "Delivered", desc: "Enjoy your soaps!" },
];

export default function OrderConfirmationPage({ searchParams }: PageProps) {
  const { orderId, method, name, mobile, total } = use(searchParams);
  const [copied, setCopied] = useState(false);

  const isPaid = method === "paid";
  const lastFour = mobile ? mobile.slice(-4) : "XXXX";
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
      {/* Top success banner */}
      <div className="bg-[#2D5016] pt-16 pb-24 px-4 text-center relative overflow-hidden">
        {/* Background decoration */}
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
            Order Placed! 🎉
          </h1>
          <p className="text-white/75 text-base">
            Thank you, <span className="text-white font-semibold">{firstName}</span>! Your soaps are being handcrafted with love.
          </p>
        </motion.div>
      </div>

      {/* Card pulled up over the banner */}
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
            {/* Payment status */}
            <div className={`rounded-2xl p-4 flex items-start gap-3 ${
              isPaid ? "bg-green-50 border border-green-100" : "bg-amber-50 border border-amber-100"
            }`}>
              <span className="text-2xl shrink-0">{isPaid ? "✅" : "💵"}</span>
              <div>
                <p className={`font-bold text-sm ${isPaid ? "text-green-800" : "text-amber-800"}`}>
                  {isPaid ? "Payment Confirmed" : "Cash on Delivery"}
                </p>
                <p className={`text-xs mt-0.5 ${isPaid ? "text-green-700" : "text-amber-700"}`}>
                  {isPaid
                    ? "Your order will be picked up & shipped within 24 hours."
                    : `Pay ₹${total} when your order arrives. Delivery in 4–6 business days.`}
                </p>
              </div>
            </div>

            {/* Journey steps */}
            <div>
              <p className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wider mb-4">Your Order Journey</p>
              <div className="flex items-start justify-between relative">
                <div className="absolute top-5 left-5 right-5 h-0.5 bg-[#EDE6D6]" />
                <div className="absolute top-5 left-5 h-0.5 bg-[#2D5016] transition-all" style={{ width: "0%" }} />
                {steps.map((step, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 z-10 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm ${
                      i === 0 ? "bg-[#2D5016]" : "bg-white border-2 border-[#EDE6D6]"
                    }`}>
                      {step.icon}
                    </div>
                    <div className="text-center">
                      <p className={`text-[10px] font-bold leading-tight ${i === 0 ? "text-[#2D5016]" : "text-[#6B6B6B]"}`}>
                        {step.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile note */}
            <p className="text-xs text-[#6B6B6B] text-center bg-[#F5F0E8] rounded-xl py-3 px-4">
              📱 Shipping updates will be sent to your mobile ending in <strong className="text-[#1C1C1C]">••••{lastFour}</strong>
            </p>

            {/* CTAs */}
            <div className="space-y-3">
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

        {/* What's next note */}
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
