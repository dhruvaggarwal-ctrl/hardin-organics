"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const stats = [
  { value: "100%", label: "Natural Ingredients" },
  { value: "0", label: "Harsh Chemicals" },
  { value: "2+", label: "Years Handcrafted" },
  { value: "10K+", label: "Happy Customers" },
];

export function BrandStorySection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
              <Image
                src="/images/brand-hand.jpg"
                alt="Hardin Organics handcrafted Saffron Haldi Chandan soap held in hands"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Overlay card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <p className="text-sm font-medium text-[#2D5016] italic">
                  &ldquo;I started Hardin Organics because I couldn&apos;t find a soap without a laundry list of chemicals. So I made one myself.&rdquo;
                </p>
                <p className="text-xs text-[#6B6B6B] mt-2 font-medium">— Dhruv, Founder of Hardin Organics</p>
              </div>
            </div>

          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-[#E8F0E0] text-[#2D5016] text-sm font-semibold px-4 py-2 rounded-full mb-6">
              Our Story
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1C1C1C] leading-tight mb-6 font-display">
              Born From a Belief That Skincare Should Be
              <span className="text-[#2D5016]"> Simple & Pure</span>
            </h2>
            <p className="text-[#6B6B6B] text-lg leading-relaxed mb-4">
              Hardin Organics was born from a simple frustration — every soap on the market was packed with chemicals that sounded more like a science experiment than skincare.
            </p>
            <p className="text-[#6B6B6B] leading-relaxed mb-4">
              We went back to our roots. To Ayurvedic wisdom. To ingredients our grandmothers trusted. To the power of activated charcoal, saffron, haldi, and chandan — pure, effective, and honest.
            </p>
            <p className="text-[#6B6B6B] leading-relaxed mb-8">
              Every bar is still handcrafted in small batches, cold-processed to preserve all the goodness, and made with the promise that if you can&apos;t pronounce an ingredient, it&apos;s not in our soap.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {stats.map((s) => (
                <div key={s.label} className="bg-[#F5F0E8] rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold text-[#2D5016]">
                    {s.value}
                  </div>
                  <div className="text-xs text-[#6B6B6B] font-medium mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-[#2D5016] font-semibold hover:gap-3 transition-all"
            >
              Read Our Full Story →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
