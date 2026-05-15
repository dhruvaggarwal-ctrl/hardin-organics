"use client";

import Image from "next/image";
import { StarRating } from "../ui/StarRating";
import { Review } from "@/data/reviews";

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  return (
    <div id="reviews" className="space-y-5">
      {reviews.length === 0 ? (
        <p className="text-[#6B6B6B] italic">No reviews yet. Be the first to review!</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="bg-[#F5F0E8] rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {review.hasPhoto && review.photo ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                    <Image src={review.photo} alt={review.name} fill className="object-cover" sizes="40px" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#2D5016] flex items-center justify-center text-white font-bold shrink-0">
                    {review.name[0]}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-sm text-[#1C1C1C]">{review.name}</div>
                  <div className="text-xs text-[#6B6B6B]">{review.city} · {review.date}</div>
                </div>
              </div>
              {review.verified && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium shrink-0">
                  ✓ Verified Purchase
                </span>
              )}
            </div>

            <StarRating rating={review.rating} size="sm" />
            <h4 className="font-bold text-sm text-[#1C1C1C] mt-2 mb-1">{review.title}</h4>
            <p className="text-sm text-[#6B6B6B] leading-relaxed">{review.text}</p>
          </div>
        ))
      )}
    </div>
  );
}
