"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function ComparisonSection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#2D5016] font-display">
            Why Hardin Organics Wins
          </h2>
          <p className="text-[#6B6B6B] mt-3 text-lg">Not all soaps are made equal. Here&apos;s the difference.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden shadow-xl"
        >
          <Image
            src="/images/comparison.png"
            alt="Hardin Organics vs ordinary soap comparison"
            width={1200}
            height={700}
            className="w-full h-auto"
          />
        </motion.div>

        <div className="text-center mt-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#C4622D] text-white font-bold px-10 py-4 rounded-full text-lg hover:bg-[#D4734A] transition-all duration-300 hover:shadow-lg"
          >
            Make the Switch Today →
          </Link>
        </div>
      </div>
    </section>
  );
}
