"use client";

import { notFound } from "next/navigation";
import { use, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getProductBySlug, products } from "@/data/products";
import { getReviewsByProduct } from "@/data/reviews";
import { ProductGallery } from "@/components/product/ProductGallery";
import { AddToCartSection } from "@/components/product/AddToCartSection";
import { ReviewList } from "@/components/product/ReviewList";
import { ProductCard } from "@/components/ui/ProductCard";
import { StarRating } from "@/components/ui/StarRating";
import { IngredientComparisonTable } from "@/components/home/IngredientComparisonTable";
import { CompleteYourRoutine } from "@/components/product/CompleteYourRoutine";
import { AnimatePresence } from "framer-motion";

// ── Product-specific FAQs ────────────────────────────────────────────────────
const productFaqs: Record<string, { q: string; a: string }[]> = {
  "activated-charcoal-soap": [
    { q: "Will charcoal soap dry out my skin?", a: "No — our charcoal soap is balanced with Shea Butter and coconut oil to ensure it cleanses without stripping natural moisture. Most customers with oily and combination skin find it leaves skin feeling clean, not tight." },
    { q: "How soon will I see results for acne?", a: "Most customers notice fewer breakouts within 2–3 weeks of daily use. The activated charcoal works by drawing out impurities and excess sebum from pores. Consistency is key — use it twice daily for best results." },
    { q: "Can I use this on my face every day?", a: "Yes. It's pH-balanced and gentle enough for daily facial use, morning and night. If you have very sensitive skin, start with once daily and see how your skin responds." },
    { q: "Does it work on blackheads?", a: "Yes, activated charcoal is particularly effective on blackheads and clogged pores. It works like a magnet, pulling out the oxidised sebum that causes blackheads over time." },
  ],
  "saffron-haldi-chandan-soap": [
    { q: "Will the saffron or haldi stain my skin yellow?", a: "Not at all. The concentrations used are skin-safe and formulated to give the skin benefits of turmeric without any yellow tint. Thousands of our customers use it daily with zero staining." },
    { q: "How quickly will I notice a glow?", a: "Many customers report a visible difference in skin brightness within 1–2 weeks. Saffron and sandalwood together are known to even skin tone and reduce dullness — the results build over time with consistent use." },
    { q: "Is this soap safe during pregnancy?", a: "The ingredients are all-natural, but we always recommend consulting your doctor before introducing any new skincare product during pregnancy. There are no harsh chemicals in this soap." },
    { q: "Can I use this with my regular moisturiser?", a: "Absolutely. Use this soap to cleanse, then follow with your regular moisturiser. The soap is designed to cleanse without disrupting your skin barrier, so it pairs well with any moisturiser." },
  ],
};

function ProductFAQ({ slug }: { slug: string }) {
  const faqs = productFaqs[slug] ?? [];
  const [open, setOpen] = useState<number | null>(null);
  if (!faqs.length) return null;

  return (
    <div className="mt-14">
      <h2 className="text-2xl font-bold text-[#1C1C1C] mb-1">Common Questions</h2>
      <p className="text-sm text-[#6B6B6B] mb-6">Everything you want to know about this soap</p>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#EDE6D6]">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
            >
              <span className="font-semibold text-sm text-[#1C1C1C]">{faq.q}</span>
              <svg
                className={`w-4 h-4 shrink-0 text-[#2D5016] transition-transform duration-300 ${open === i ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-sm text-[#6B6B6B] leading-relaxed border-t border-[#EDE6D6] pt-3">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      <a
        href="https://wa.me/919871900959"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-5 text-sm text-[#2D5016] font-semibold hover:underline"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Still have a question? WhatsApp us
      </a>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>;
}

const tabs = ["Description", "Ingredients", "How to Use", "Reviews"];

export default function ProductPage({ params }: PageProps) {
  const { slug } = use(params);
  const product = getProductBySlug(slug);
  const [activeTab, setActiveTab] = useState("Description");

  if (!product) notFound();

  const reviews = getReviewsByProduct(slug);
  const relatedProducts = products.filter((p) => p.slug !== slug).slice(0, 3);

  const tabContent: Record<string, React.ReactNode> = {
    Description: (
      <div className="prose prose-sm max-w-none text-[#6B6B6B] leading-relaxed">
        <p>{product.longDescription}</p>
      </div>
    ),
    Ingredients: (
      <div>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {product.ingredients.map((ing) => (
            <div key={ing} className="flex items-center gap-2 bg-[#F5F0E8] rounded-xl p-3">
              <span className="text-[#2D5016]">✓</span>
              <span className="text-sm font-medium text-[#1C1C1C]">{ing}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-[#6B6B6B]">
          <strong>What we leave out:</strong> Parabens • SLS/SLES • Artificial fragrances • Mineral oils • Synthetic colours • Phthalates
        </p>
      </div>
    ),
    "How to Use": (
      <ol className="space-y-3">
        {product.howToUse.map((step, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="w-7 h-7 bg-[#2D5016] text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
              {i + 1}
            </span>
            <span className="text-[#6B6B6B] pt-0.5">{step}</span>
          </li>
        ))}
      </ol>
    ),
    Reviews: <ReviewList reviews={reviews} />,
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-[#6B6B6B]">
          <Link href="/" className="hover:text-[#2D5016]">Home</Link>
          <span>›</span>
          <Link href="/shop" className="hover:text-[#2D5016]">Shop</Link>
          <span>›</span>
          <span className="text-[#1C1C1C] font-medium">{product.name}</span>
        </nav>
      </div>

      {/* Main product section */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <ProductGallery images={product.images} name={product.name} />
          </motion.div>

          {/* Add to cart */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <AddToCartSection product={product} />
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-16 bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-semibold text-sm whitespace-nowrap transition-all duration-200 border-b-2 ${
                  activeTab === tab
                    ? "border-[#2D5016] text-[#2D5016] bg-[#F5F0E8]/50"
                    : "border-transparent text-[#6B6B6B] hover:text-[#1C1C1C]"
                }`}
              >
                {tab} {tab === "Reviews" && `(${reviews.length})`}
              </button>
            ))}
          </div>
          <div className="p-6 md:p-8">
            {tabContent[activeTab]}
          </div>
        </div>

        {/* Frequently Bought Together */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-[#1C1C1C] mb-6 font-display">
            Frequently Bought Together
          </h2>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                {[product, ...products.filter((p) => p.id !== product.id).slice(0, 1)].map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3">
                    {i > 0 && <span className="text-[#6B6B6B] font-bold text-xl">+</span>}
                    <div className="text-center">
                      <div className="w-20 h-20 bg-[#EDE6D6] rounded-xl overflow-hidden relative">
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs text-[#6B6B6B] mt-1 max-w-[80px] leading-tight">{p.name.split(" ").slice(0, 2).join(" ")}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="sm:ml-auto text-center sm:text-right">
                <div className="text-2xl font-bold text-[#1C1C1C]">
                  ₹{product.price + products.filter((p) => p.id !== product.id)[0].price}
                </div>
                <div className="text-sm text-green-600 font-medium">Save ₹50 vs buying separately</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <StarRating rating={4.85} size="sm" showNumber />
              <span className="text-sm text-[#6B6B6B]">Highly recommended combo by our customers</span>
            </div>
          </div>
        </div>

        {/* Complete Your Routine */}
        <CompleteYourRoutine currentProductId={product.id} />

        {/* You May Also Like */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-[#1C1C1C] mb-6 font-display">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

        {/* Ingredient Comparison Table */}
        <div className="mt-12 -mx-4 md:mx-0">
          <IngredientComparisonTable />
        </div>

        {/* Product-specific FAQ */}
        <ProductFAQ slug={slug} />
      </div>

      {/* Sticky mobile add-to-cart bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white border-t border-gray-100 p-3 flex items-center gap-3 shadow-lg">
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm text-[#1C1C1C] truncate">{product.name}</div>
          <div className="text-[#C4622D] font-bold">₹{product.price}</div>
        </div>
        <Link
          href="/cart"
          className="bg-[#C4622D] text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-[#D4734A] transition-colors shrink-0"
        >
          Add to Cart →
        </Link>
      </div>
    </div>
  );
}
