"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { StarRating } from "./StarRating";
import { useCart } from "@/context/CartContext";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const savings = product.originalPrice - product.price;
  const savingsPct = Math.round((savings / product.originalPrice) * 100);

  const handleAdd = () => {
    addToCart(product, product.sizes[0].label, product.price);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-[#EDE6D6]">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 40vw, 384px"
        />
        {product.badge && (
          <span
            className={`absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${
              product.badge === "BESTSELLER"
                ? "bg-[#C4622D]"
                : product.badge.includes("SAVE")
                ? "bg-[#D4A017]"
                : "bg-red-600"
            }`}
          >
            {product.badge}
          </span>
        )}
        {product.stockCount <= 10 && (
          <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            Only {product.stockCount} left!
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-bold text-lg text-[#1C1C1C] leading-tight hover:text-[#2D5016] transition-colors">
            {product.name}
          </h3>
          <p className="text-[#6B6B6B] text-sm mt-0.5">{product.tagline}</p>
        </Link>

        <div className="flex items-center gap-2">
          <StarRating rating={product.rating} size="sm" />
          <span className="text-xs text-[#6B6B6B]">({product.reviewCount})</span>
        </div>

        <div className="flex items-center gap-2 mt-auto pt-2">
          <span className="text-xl font-bold text-[#1C1C1C]">₹{product.price}</span>
          <span className="text-sm line-through text-[#6B6B6B]">₹{product.originalPrice}</span>
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
            {savingsPct}% off
          </span>
        </div>

        <button
          onClick={handleAdd}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
            added
              ? "bg-green-600 text-white"
              : "bg-[#2D5016] text-white hover:bg-[#3D6B20]"
          }`}
        >
          {added ? "✓ Added to Cart!" : "Add to Cart"}
        </button>

        <Link
          href={`/product/${product.slug}`}
          className="text-center text-sm text-[#2D5016] font-medium hover:underline"
        >
          View Details →
        </Link>
      </div>
    </motion.div>
  );
}
