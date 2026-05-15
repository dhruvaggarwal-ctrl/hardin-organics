"use client";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
}

export function StarRating({ rating, size = "md", showNumber = false }: StarRatingProps) {
  const sizes = { sm: "text-xs", md: "text-sm", lg: "text-lg" };
  const full = Math.floor(rating);
  const partial = rating % 1;

  return (
    <span className={`inline-flex items-center gap-1 ${sizes[size]}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className="relative inline-block">
          {/* Background star */}
          <span className="text-gray-300">★</span>
          {/* Filled overlay */}
          {i <= full ? (
            <span className="absolute inset-0 text-amber-400 overflow-hidden">★</span>
          ) : i === full + 1 && partial > 0 ? (
            <span
              className="absolute inset-0 text-amber-400 overflow-hidden"
              style={{ width: `${partial * 100}%` }}
            >
              ★
            </span>
          ) : null}
        </span>
      ))}
      {showNumber && (
        <span className="text-[#6B6B6B] font-medium ml-0.5">{rating.toFixed(1)}</span>
      )}
    </span>
  );
}
