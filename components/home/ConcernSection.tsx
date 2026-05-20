"use client";

import Link from "next/link";
import { motion } from "framer-motion";

// SVG paths for concern icons — no emojis
const concerns = [
  {
    label: "Acne & Breakouts",
    slug: "activated-charcoal-soap",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Dull Skin & Pigmentation",
    slug: "saffron-haldi-chandan-soap",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="5" /><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Dryness & Dehydration",
    slug: "saffron-haldi-chandan-soap",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2c0 0-7 7.5-7 12a7 7 0 0 0 14 0c0-4.5-7-12-7-12Z" />
      </svg>
    ),
  },
  {
    label: "Blackheads & Pores",
    slug: "activated-charcoal-soap",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="8" strokeDasharray="3 2" />
      </svg>
    ),
  },
  {
    label: "Excess Oiliness",
    slug: "activated-charcoal-soap",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2z" />
      </svg>
    ),
  },
  {
    label: "Uneven Skin Tone",
    slug: "saffron-haldi-chandan-soap",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" opacity=".4" />
        <rect x="3" y="14" width="7" height="7" rx="1" opacity=".7" /><rect x="14" y="14" width="7" height="7" rx="1" opacity=".2" />
      </svg>
    ),
  },
];

export function ConcernSection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2
            className="text-4xl md:text-5xl font-bold text-[#2D5016] font-display"
          >
            What&apos;s Your Skin Concern?
          </h2>
          <p className="text-[#6B6B6B] mt-3 text-lg">Find the right soap for your skin — in seconds.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {concerns.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="h-full"
            >
              <Link
                href={`/product/${c.slug}`}
                className="group flex flex-col items-center justify-center gap-3 p-6 h-full min-h-[120px] rounded-2xl bg-[#F5F0E8] border-2 border-transparent hover:border-[#2D5016] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-center"
              >
                <span className="text-[#2D5016] group-hover:scale-110 transition-transform duration-300 shrink-0">
                  {c.icon}
                </span>
                <span className="font-semibold text-sm md:text-base text-[#1C1C1C] group-hover:text-[#2D5016] transition-colors leading-tight">
                  {c.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
