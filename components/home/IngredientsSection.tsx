"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const ingredients = [
  {
    name: "Activated Charcoal",
    benefit: "Draws out toxins & unclogs pores",
    description: "Acts like a magnet — absorbing 200x its weight in impurities deep within your skin.",
    image: "/images/charcoal-feature.png",
    contain: true,
  },
  {
    name: "Saffron (Kesar)",
    benefit: "Brightens & evens skin tone",
    description: "The most prized ingredient in Ayurveda — reduces dark spots and gives skin a golden glow.",
    image: "/images/haldi-4.png",
    contain: true,
  },
  {
    name: "Haldi (Turmeric)",
    benefit: "Natural anti-inflammatory & anti-bacterial",
    description: "Ancient Indian secret — fights acne bacteria, reduces redness, and brightens complexion.",
    image: "/images/haldi-3.png",
    contain: false,
  },
  {
    name: "Chandan (Sandalwood)",
    benefit: "Soothes, cools & moisturizes",
    description: "A sacred wood with powerful anti-aging properties — soothes sensitive skin and adds natural moisture.",
    image: "/images/charcoal-cover.png",
    contain: false,
  },
];

export function IngredientsSection() {
  return (
    <section id="ingredients" className="py-16 md:py-20 bg-[#F5F0E8]">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#2D5016] font-display">
            We Believe in Complete Ingredient Transparency
          </h2>
          <p className="text-[#6B6B6B] mt-4 text-lg max-w-2xl mx-auto">
            Every ingredient earns its place in our formula. No fillers, no secrets, no compromises.
          </p>
        </motion.div>

        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 md:overflow-visible md:mx-0 md:px-0">
          <div className="flex gap-5 md:grid md:grid-cols-4 w-[calc(100vw*2.8)] sm:w-[calc(100vw*1.8)] md:w-auto">
            {ingredients.map((ing, i) => (
              <motion.div
                key={ing.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 w-60 md:w-auto shrink-0 md:shrink"
              >
                <div className="relative aspect-square overflow-hidden bg-[#F5F0E8]">
                  <Image
                    src={ing.image}
                    alt={ing.name}
                    fill
                    className={ing.contain ? "object-contain p-3" : "object-cover"}
                    sizes="(max-width: 768px) 240px, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-bold text-lg leading-tight">
                      {ing.name}
                    </h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-[#2D5016] text-sm">{ing.benefit}</p>
                  <p className="text-[#6B6B6B] text-xs mt-2 leading-relaxed">{ing.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* No-list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          {["No Parabens", "No SLS", "No Artificial Fragrances", "No Mineral Oils", "No Synthetic Colours"].map((no) => (
            <span
              key={no}
              className="bg-white border border-red-100 text-[#1C1C1C] text-sm font-medium px-4 py-2 rounded-full shadow-sm"
            >
              {no}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
