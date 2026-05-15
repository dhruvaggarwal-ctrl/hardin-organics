"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/ui/ProductCard";
import { products } from "@/data/products";

const concerns = ["All", "Acne & Breakouts", "Dull Skin", "Blackheads & Pores", "Anti-Aging", "Dryness", "Complete Skincare"];
const skinTypes = ["All Skin Types", "Oily", "Dry", "Combination", "Sensitive", "Mature"];
const sortOptions = [
  { label: "Bestselling", value: "bestselling" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Most Reviewed", value: "reviews" },
];

export default function ShopPage() {
  const [selectedConcern, setSelectedConcern] = useState("All");
  const [selectedSkinType, setSelectedSkinType] = useState("All Skin Types");
  const [sort, setSort] = useState("bestselling");
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = products
    .filter((p) => {
      if (selectedConcern !== "All" && !p.concerns.some((c) => c.includes(selectedConcern.split(" ")[0]))) return false;
      if (selectedSkinType !== "All Skin Types" && !p.skinTypes.includes(selectedSkinType)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      if (sort === "reviews") return b.reviewCount - a.reviewCount;
      return b.reviewCount - a.reviewCount; // bestselling = most reviews
    });

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Header */}
      <div className="bg-[#2D5016] text-white py-14 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-5xl font-bold font-display">
            All Products
          </h1>
          <p className="text-white/70 mt-3">Handcrafted organic soaps for every skin type</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Filters bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#6B6B6B]">{filtered.length} products</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="md:hidden flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-2 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M3 6h18M7 12h10M11 18h2" />
              </svg>
              Filters
            </button>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm bg-white text-[#1C1C1C] focus:outline-none focus:border-[#2D5016]"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters — desktop */}
          <aside className="hidden md:block w-52 shrink-0">
            <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-24">
              <h3 className="font-bold text-[#1C1C1C] mb-4">Filter By</h3>

              <div className="mb-5">
                <p className="text-xs font-bold text-[#2D5016] uppercase tracking-wider mb-3">Skin Concern</p>
                <div className="space-y-1.5">
                  {concerns.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedConcern(c)}
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                        selectedConcern === c
                          ? "bg-[#2D5016] text-white font-medium"
                          : "text-[#6B6B6B] hover:bg-[#F5F0E8]"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-[#2D5016] uppercase tracking-wider mb-3">Skin Type</p>
                <div className="space-y-1.5">
                  {skinTypes.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedSkinType(t)}
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                        selectedSkinType === t
                          ? "bg-[#2D5016] text-white font-medium"
                          : "text-[#6B6B6B] hover:bg-[#F5F0E8]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {(selectedConcern !== "All" || selectedSkinType !== "All Skin Types") && (
                <button
                  onClick={() => { setSelectedConcern("All"); setSelectedSkinType("All Skin Types"); }}
                  className="mt-4 w-full text-sm text-[#C4622D] hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-[#6B6B6B]">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-lg">No products match your filters.</p>
                <button
                  onClick={() => { setSelectedConcern("All"); setSelectedSkinType("All Skin Types"); }}
                  className="mt-4 text-[#2D5016] font-medium hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
