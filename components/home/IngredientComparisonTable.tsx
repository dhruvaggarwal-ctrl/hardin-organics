"use client";

import { motion } from "framer-motion";

const rows = [
  { ingredient: "Activated Charcoal", hardin: true, regular: false },
  { ingredient: "Shea Butter", hardin: true, regular: false },
  { ingredient: "SLS (Sodium Lauryl Sulphate)", hardin: false, regular: true },
  { ingredient: "Parabens", hardin: false, regular: true },
  { ingredient: "Artificial Fragrance", hardin: false, regular: true },
  { ingredient: "Handmade in Small Batches", hardin: true, regular: false },
];

function Check({ yes }: { yes: boolean }) {
  return yes ? (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100">
      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  ) : (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-100">
      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </span>
  );
}

export function IngredientComparisonTable() {
  return (
    <section className="py-8 md:py-20 bg-white rounded-2xl md:rounded-none">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 md:mb-10"
        >
          <h2
            className="text-xl md:text-4xl font-bold text-[#1C1C1C] font-display"
          >
            We have nothing to hide.
            <br />
            <span className="text-[#2D5016]">Here&apos;s exactly what&apos;s in your soap.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="overflow-x-auto rounded-2xl border border-[#EDE6D6] shadow-sm"
        >
          <table className="w-full min-w-[340px] text-sm">
            <thead>
              <tr className="bg-[#F5F0E8]">
                <th className="text-left py-3 px-3 md:py-4 md:px-5 font-bold text-[#1C1C1C] w-1/2">Ingredient</th>
                <th className="text-center py-3 px-3 md:py-4 md:px-5 font-bold text-[#2D5016] text-xs md:text-sm">
                  Hardin Organics
                </th>
                <th className="text-center py-3 px-3 md:py-4 md:px-5 font-bold text-[#6B6B6B] text-xs md:text-sm">
                  Regular Soap
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.ingredient}
                  className={`border-t border-[#EDE6D6] ${i % 2 === 0 ? "bg-white" : "bg-[#FAFAF7]"}`}
                >
                  <td className="py-3 px-3 md:py-3.5 md:px-5 text-[#1C1C1C] font-medium text-xs md:text-sm">{row.ingredient}</td>
                  <td className="py-3 px-3 md:py-3.5 md:px-5 text-center">
                    <Check yes={row.hardin} />
                  </td>
                  <td className="py-3 px-3 md:py-3.5 md:px-5 text-center">
                    <Check yes={row.regular} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center text-sm text-[#6B6B6B] mt-5 italic"
        >
          Every ingredient is listed on our packaging. Always.
        </motion.p>
      </div>
    </section>
  );
}
