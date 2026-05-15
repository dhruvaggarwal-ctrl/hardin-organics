"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ProductCard } from "../ui/ProductCard";
import { products } from "@/data/products";

export function BestsellerSection() {
  return (
    <section className="py-16 md:py-20 bg-[#F5F0E8]">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-[#2D5016]/10 text-[#2D5016] text-sm font-semibold px-4 py-2 rounded-full mb-4">
            Customer Favourites
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#2D5016] font-display">
            Our Bestsellers
          </h2>
          <p className="text-[#6B6B6B] mt-3 text-lg">The soaps that 10,000+ customers swear by</p>
        </motion.div>

        {/* 2-product centered grid */}
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-2 gap-5 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 border-2 border-[#2D5016] text-[#2D5016] font-semibold px-8 py-3 rounded-full hover:bg-[#2D5016] hover:text-white transition-all duration-300"
          >
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
}
