"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function AvailableOnSection() {
  return (
    <section className="py-10 md:py-14 bg-[#F5F0E8]">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-7"
        >
          <p className="text-xs uppercase tracking-widest text-[#C4622D] font-semibold mb-2">Trusted & Verified</p>
          <h2 className="text-xl md:text-2xl font-bold text-[#1C1C1C]">
            Also available on Flipkart
          </h2>
          <p className="text-sm text-[#6B6B6B] mt-1.5">
            Order from wherever you feel most comfortable — same authentic product.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center"
        >
          <a
            href="https://www.flipkart.com/search?q=hardin+organics+soap&marketplace=FLIPKART"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-7 py-3.5 rounded-2xl font-bold text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            style={{ backgroundColor: "#2874F0" }}
          >
            <img
              src="/images/flipkart-logo.png"
              alt="Flipkart"
              width={22}
              height={22}
              className="brightness-0 invert"
            />
            <span className="text-base">Shop on Flipkart</span>
            <svg className="w-3.5 h-3.5 opacity-80" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </motion.div>

        {/* Trust note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center text-xs text-[#6B6B6B] mt-5 flex items-center justify-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Verified seller · Same price, same quality
        </motion.p>
      </div>
    </section>
  );
}
