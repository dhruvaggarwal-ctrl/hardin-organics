"use client";

import { motion } from "framer-motion";

export function FounderSection() {
  return (
    <section className="py-16 md:py-24 bg-[#F5F0E8]">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden bg-[#EDE6D6] shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/founder.jpg"
                alt="Dhruv — Founder of Hardin Organics"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            <p className="text-xs uppercase tracking-widest text-[#C4622D] font-semibold">
              A message from our founder
            </p>

            <h2
              className="text-4xl md:text-5xl font-bold text-[#1C1C1C] font-display"
            >
              Hey, I&apos;m Dhruv.
            </h2>

            <p className="text-[#6B6B6B] leading-relaxed text-base">
              I started Hardin Organics because I wanted clean, honest skincare that doesn&apos;t cost a
              fortune or hide behind complicated ingredient lists. Every soap is made in small batches —
              by hand, with ingredients I&apos;d use on my own skin. Thank you for being part of this
              journey. Let&apos;s make your HarDin Organic.
            </p>

            <div className="pt-2">
              <p
                className="text-[#2D5016]"
                style={{ fontFamily: "var(--font-dancing), 'Dancing Script', cursive", fontSize: "28px" }}
              >
                — Dhruv
              </p>
              <p className="text-sm text-[#6B6B6B] mt-1">Founder, Hardin Organics · Gurgaon, India</p>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://www.instagram.com/hardin_organics/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#2D5016] font-semibold hover:underline"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                @hardin_organics
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
