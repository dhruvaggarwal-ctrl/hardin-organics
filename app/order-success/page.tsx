"use client";

import Link from "next/link";
import { use } from "react";
import { motion } from "framer-motion";

interface PageProps {
  searchParams: Promise<{ paymentId?: string; orderId?: string }>;
}

export default function OrderSuccessPage({ searchParams }: PageProps) {
  const { paymentId, orderId } = use(searchParams);

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-xl max-w-lg w-full p-10 text-center"
      >
        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>

        <h1 className="text-4xl font-bold text-[#2D5016] mb-3 font-display">
          Order Placed!
        </h1>
        <p className="text-[#6B6B6B] text-lg mb-6">
          Thank you for choosing Hardin Organics. Your handcrafted soaps are on their way!
        </p>

        {/* Order details */}
        <div className="bg-[#F5F0E8] rounded-2xl p-5 mb-6 text-left space-y-2">
          {paymentId && (
            <div className="flex justify-between text-sm">
              <span className="text-[#6B6B6B]">Payment ID</span>
              <span className="font-mono font-medium text-[#1C1C1C] text-xs">{paymentId}</span>
            </div>
          )}
          {orderId && (
            <div className="flex justify-between text-sm">
              <span className="text-[#6B6B6B]">Order ID</span>
              <span className="font-mono font-medium text-[#1C1C1C] text-xs">{orderId}</span>
            </div>
          )}
          <div className="flex justify-between text-sm pt-2 border-t border-[#EDE6D6]">
            <span className="text-[#6B6B6B]">Delivery</span>
            <span className="font-medium text-[#1C1C1C]">4–7 business days</span>
          </div>
        </div>

        {/* What's next */}
        <div className="space-y-3 mb-8">
          {[
            "We're packing your order with care",
            "You'll get a tracking link via WhatsApp/SMS",
            "Questions? Chat with us on WhatsApp",
          ].map((text) => (
            <div key={text} className="flex items-center gap-3 text-sm text-[#6B6B6B] text-left">
              <span>{text}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/shop"
            className="block w-full bg-[#2D5016] text-white font-bold py-4 rounded-xl hover:bg-[#3D6B20] transition-colors"
          >
            Continue Shopping
          </Link>
          <a
            href="https://wa.me/919871900959?text=Hi! I just placed an order on Hardin Organics"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full border-2 border-[#25D366] text-[#25D366] font-semibold py-3 rounded-xl hover:bg-[#25D366] hover:text-white transition-all"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Track on WhatsApp
          </a>
        </div>
      </motion.div>
    </div>
  );
}
