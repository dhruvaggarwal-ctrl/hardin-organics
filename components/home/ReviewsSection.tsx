"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { StarRating } from "../ui/StarRating";
import { reviews } from "@/data/reviews";

export function ReviewsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
  };

  return (
    <section id="reviews" className="py-14 md:py-18 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
        >
          <div>
            <h2
              className="text-3xl md:text-4xl font-bold text-[#2D5016] font-display"
            >
              What Our Customers Say
            </h2>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-3xl font-bold text-[#1C1C1C]">4.8</span>
              <StarRating rating={4.8} size="md" />
              <span className="text-sm text-[#6B6B6B]">2,000+ reviews</span>
            </div>
          </div>

          {/* Arrow controls — desktop */}
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border-2 border-[#EDE6D6] flex items-center justify-center hover:border-[#2D5016] hover:text-[#2D5016] transition-colors"
              aria-label="Scroll left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border-2 border-[#EDE6D6] flex items-center justify-center hover:border-[#2D5016] hover:text-[#2D5016] transition-colors"
              aria-label="Scroll right"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* Scrollable review cards */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-3 -mx-4 px-4"
        >
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i, 4) * 0.06 }}
              className="snap-start shrink-0 w-72 bg-[#F5F0E8] rounded-2xl p-5 flex flex-col gap-3"
            >
              {/* Reviewer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#2D5016] flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {review.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-[#1C1C1C] leading-tight">{review.name}</div>
                    <div className="text-xs text-[#6B6B6B]">{review.city}</div>
                  </div>
                </div>
                {review.verified && (
                  <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium shrink-0">
                    Verified
                  </span>
                )}
              </div>

              <StarRating rating={review.rating} size="sm" />

              <div>
                <h4 className="font-bold text-sm text-[#1C1C1C] mb-1 leading-tight">{review.title}</h4>
                <p className="text-xs text-[#6B6B6B] leading-relaxed line-clamp-4">{review.text}</p>
              </div>

              <div className="mt-auto pt-2 border-t border-[#EDE6D6]">
                <span className="text-[10px] text-[#2D5016] font-medium">{review.product}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer bar */}
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 mt-6 text-xs text-[#6B6B6B]">
          <span>4.8 / 5 on Google</span>
          <span className="hidden sm:inline">·</span>
          <span>10,000+ verified purchases</span>
          <span className="hidden sm:inline">·</span>
          <a
            href="https://www.instagram.com/hardin_organics/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#2D5016] transition-colors"
          >
            Follow @hardin_organics
          </a>
        </div>
      </div>
    </section>
  );
}
