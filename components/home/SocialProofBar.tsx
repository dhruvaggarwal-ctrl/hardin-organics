"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StarRating } from "../ui/StarRating";

const microReviews = [
  { name: "Priya S.", city: "Delhi", text: "My skin has never felt this clean! Blackheads are gone in 3 weeks." },
  { name: "Kavya R.", city: "Bangalore", text: "My skin literally glows now. No filter needed on my videos anymore 😂" },
  { name: "Anjali S.", city: "Mumbai", text: "Breakouts down by 80% in just 4 weeks. Thank you Hardin Organics!" },
  { name: "Sneha P.", city: "Ahmedabad", text: "My skin is less oily and dark spots are fading. Amazing quality!" },
  { name: "Meera K.", city: "Chennai", text: "Even my dermatologist was impressed. Switched completely to natural!" },
];

export function SocialProofBar() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCurrent((c) => (c + 1) % microReviews.length), 3500);
    return () => clearInterval(id);
  }, []);

  const review = microReviews[current];

  return (
    <section className="bg-[#EDE6D6] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-[#2D5016]">
              Trusted by
            </span>
            <div>
              <div className="text-3xl font-bold text-[#C4622D]">10,000+</div>
              <div className="text-xs text-[#6B6B6B] font-medium">Happy Customers</div>
            </div>
          </div>

          <div className="hidden md:block w-px h-12 bg-gray-300" />

          <div className="flex items-center gap-3">
            <StarRating rating={4.8} size="lg" />
            <span className="text-lg font-semibold text-[#1C1C1C]">4.8 / 5</span>
            <span className="text-sm text-[#6B6B6B]">from 2,000+ verified reviews</span>
          </div>

          <div className="hidden md:block w-px h-12 bg-gray-300" />

          {/* Rotating micro review */}
          <div className="max-w-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                className="text-sm italic text-[#1C1C1C]"
              >
                &ldquo;{review.text}&rdquo;
                <div className="text-xs text-[#6B6B6B] mt-1 not-italic">
                  — {review.name}, {review.city}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
