"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { products, Product } from "@/data/products";
import { BOGO_SALE_ENABLED } from "@/lib/promotions";

const questions = [
  {
    id: "concern",
    question: "What's your biggest skin concern right now?",
    options: [
      { label: "Acne & Breakouts", value: "acne", emoji: "😤" },
      { label: "Dull Skin & Pigmentation", value: "dull", emoji: "🌥️" },
      { label: "Blackheads & Clogged Pores", value: "pores", emoji: "🔍" },
      { label: "Dryness & Dehydration", value: "dry", emoji: "🏜️" },
      { label: "Uneven Skin Tone", value: "uneven", emoji: "🎭" },
    ],
  },
  {
    id: "skin_type",
    question: "What's your skin type?",
    options: [
      { label: "Oily — gets shiny by afternoon", value: "oily", emoji: "✨" },
      { label: "Dry — feels tight after washing", value: "dry_skin", emoji: "🥜" },
      { label: "Combination — oily T-zone, dry cheeks", value: "combination", emoji: "☯️" },
      { label: "Sensitive — reacts easily", value: "sensitive", emoji: "🌸" },
      { label: "Normal — rarely have issues", value: "normal", emoji: "😊" },
    ],
  },
  {
    id: "routine",
    question: "How would you describe your current routine?",
    options: [
      { label: "Minimal — just water and basic soap", value: "minimal", emoji: "💧" },
      { label: "Basic — face wash + moisturiser", value: "basic", emoji: "🧴" },
      { label: "Full routine — multiple products daily", value: "full", emoji: "🗂️" },
      { label: "I'm overwhelmed, nothing is working", value: "overwhelmed", emoji: "😩" },
    ],
  },
];

interface QuizResult {
  product: Product | null;
  bothProducts: boolean;
  reason: string;
}

function getResult(answers: Record<string, string>): QuizResult {
  const { concern, skin_type, routine } = answers;

  // Sensitive skin always → Haldi Chandan
  if (skin_type === "sensitive") {
    return {
      product: products.find((p) => p.id === "saffron-haldi-chandan") || null,
      bothProducts: false,
      reason: "Sensitive skin needs gentle, soothing ingredients. Our Saffron Haldi Chandan Soap is free from harsh chemicals and calms irritation while brightening your complexion with Ayurvedic botanicals.",
    };
  }

  // Overwhelmed routine or multiple concerns → Starter Duo (both)
  if (routine === "overwhelmed") {
    return {
      product: null,
      bothProducts: true,
      reason: "When nothing seems to work, a reset is often the answer. Our Starter Duo gives you both soaps so you can target different concerns at different times — charcoal for deep cleansing, and haldi-chandan for brightening.",
    };
  }

  // Acne / oily / combination / blackheads / pores → Charcoal
  if (
    concern === "acne" ||
    concern === "pores" ||
    skin_type === "oily" ||
    skin_type === "combination"
  ) {
    return {
      product: products.find((p) => p.id === "charcoal-soap") || null,
      bothProducts: false,
      reason: "Your skin needs deep detoxification. Activated Charcoal acts like a magnet, pulling out excess oil, bacteria, and impurities from deep within your pores. Paired with Tea Tree Oil, it targets breakouts at the root.",
    };
  }

  // Dull / pigmentation / uneven / dry → Haldi Chandan
  if (
    concern === "dull" ||
    concern === "uneven" ||
    concern === "dry" ||
    skin_type === "dry_skin" ||
    skin_type === "normal"
  ) {
    return {
      product: products.find((p) => p.id === "saffron-haldi-chandan") || null,
      bothProducts: false,
      reason: "Your skin craves brightening and nourishment. The golden trio of Saffron, Turmeric, and Sandalwood works together to fade pigmentation, boost radiance, and leave your skin with a healthy natural glow in 4–6 weeks.",
    };
  }

  // Fallback → both
  return {
    product: null,
    bothProducts: true,
    reason: "Your skin has multiple needs. Our Starter Duo lets you tackle different concerns with the right soap for each — deep cleansing with charcoal and brightening with haldi-chandan.",
  };
}

interface SkinQuizProps {
  autoOpen?: boolean;
}

export function SkinQuizSection({ autoOpen = false }: SkinQuizProps) {
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1); // slide direction: 1 = forward, -1 = back
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const q = questions[step];
  const total = questions.length;

  function handleSelect(value: string) {
    setSelected(value);
    const newAnswers = { ...answers, [q.id]: value };
    setAnswers(newAnswers);

    setTimeout(() => {
      if (step < total - 1) {
        setDir(1);
        setStep(step + 1);
        setSelected(null);
      } else {
        setResult(getResult(newAnswers));
      }
    }, 220);
  }

  function reset() {
    setStep(0);
    setDir(1);
    setAnswers({});
    setResult(null);
    setSelected(null);
  }

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <>
      <section id="skin-quiz" className="py-16 md:py-20 bg-[#EDE6D6]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs uppercase tracking-widest text-[#C4622D] font-semibold mb-3">Free Skin Quiz</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#2D5016] mb-4 font-display">
              Not Sure Which Soap is Right For You?
            </h2>
            <p className="text-[#6B6B6B] text-lg mb-8">
              Answer 3 quick questions and get a personalized recommendation for your skin.
            </p>
            <button
              onClick={() => setIsOpen(true)}
              className="bg-[#C4622D] text-white font-bold px-10 py-4 rounded-full text-lg hover:bg-[#D4734A] transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-100"
            >
              Start Skin Quiz — It&apos;s Free →
            </button>
            <p className="text-sm text-[#6B6B6B] mt-3">3 quick questions · No email required · Instant result</p>
          </motion.div>
        </div>
      </section>

      {/* Quiz Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={(e) => { if (e.target === e.currentTarget) { setIsOpen(false); reset(); } }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              {!result ? (
                <div className="p-6 md:p-8">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-[#6B6B6B]">
                      Question {step + 1} of {total}
                    </span>
                    <button
                      onClick={() => { setIsOpen(false); reset(); }}
                      className="w-8 h-8 flex items-center justify-center text-[#6B6B6B] hover:text-[#1C1C1C] hover:bg-gray-100 rounded-full transition-colors text-xl"
                    >×</button>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 bg-gray-100 rounded-full mb-7 overflow-hidden">
                    <div
                      className="h-full bg-[#C4622D] rounded-full transition-all duration-500"
                      style={{ width: `${((step) / total) * 100}%` }}
                    />
                  </div>

                  {/* Question with slide animation */}
                  <div className="overflow-hidden">
                    <AnimatePresence mode="wait" custom={dir}>
                      <motion.div
                        key={step}
                        custom={dir}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.28, ease: "easeInOut" }}
                      >
                        <h3 className="text-xl md:text-2xl font-bold text-[#1C1C1C] mb-5 leading-snug">
                          {q.question}
                        </h3>
                        <div className="space-y-2.5">
                          {q.options.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => handleSelect(opt.value)}
                              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 text-left transition-all duration-200 ${
                                selected === opt.value
                                  ? "border-[#C4622D] bg-orange-50"
                                  : "border-gray-100 bg-[#F5F0E8] hover:border-[#C4622D]/40 hover:bg-orange-50/40"
                              }`}
                            >
                              <span className="text-xl shrink-0">{opt.emoji}</span>
                              <span className="text-sm font-medium text-[#1C1C1C]">{opt.label}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                /* Results */
                <div className="p-6 md:p-8">
                  <div className="text-center mb-5">
                    <p className="text-xs uppercase tracking-widest text-[#C4622D] font-semibold mb-2">Your Result</p>
                    <h3 className="text-2xl font-bold text-[#2D5016] font-display">
                      Based on your answers, your skin needs:
                    </h3>
                  </div>

                  {result.bothProducts ? (
                    /* Both products recommendation */
                    <div className="bg-[#F5F0E8] rounded-2xl p-4 mb-5">
                      <p className="text-sm font-bold text-[#1C1C1C] text-center mb-3">Starter Duo — One of Each</p>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        {products.map((p) => (
                          <div key={p.id} className="bg-white rounded-xl p-3 text-center">
                            <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2">
                              <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="120px" />
                            </div>
                            <p className="text-xs font-semibold text-[#1C1C1C] leading-tight">{p.name}</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-xl font-bold text-center text-[#2D5016]">₹249 <span className="text-sm font-normal text-[#6B6B6B] line-through">₹298</span></p>
                    </div>
                  ) : result.product ? (
                    /* Single product recommendation */
                    <div className="bg-[#F5F0E8] rounded-2xl p-4 mb-5 flex gap-4 items-center">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                        <Image src={result.product.images[0]} alt={result.product.name} fill className="object-cover" sizes="96px" />
                      </div>
                      <div>
                        <p className="font-bold text-[#1C1C1C] text-base leading-tight">{result.product.name}</p>
                        <p className="text-xs text-[#6B6B6B] mt-1">{result.product.tagline}</p>
                        <p className="text-xl font-bold text-[#2D5016] mt-2">₹{result.product.price}</p>
                      </div>
                    </div>
                  ) : null}

                  {/* Why this works */}
                  <p className="text-sm text-[#6B6B6B] leading-relaxed mb-5 bg-green-50 rounded-xl p-3 border border-green-100">
                    🌿 <strong>Why this works for you:</strong> {result.reason}
                  </p>

                  <div className="space-y-3">
                    {result.bothProducts ? (
                      <Link
                        href={BOGO_SALE_ENABLED ? "/bogo" : "/shop"}
                        onClick={() => { setIsOpen(false); reset(); }}
                        className="block w-full bg-[#C4622D] text-white font-bold py-4 rounded-xl text-center hover:bg-[#D4734A] transition-colors"
                      >
                        Get Starter Duo — ₹249 →
                      </Link>
                    ) : result.product ? (
                      <Link
                        href={`/product/${result.product.slug}`}
                        onClick={() => { setIsOpen(false); reset(); }}
                        className="block w-full bg-[#C4622D] text-white font-bold py-4 rounded-xl text-center hover:bg-[#D4734A] transition-colors"
                      >
                        Shop {result.product.name} — ₹{result.product.price} →
                      </Link>
                    ) : null}

                    <div className="flex gap-2">
                      <Link
                        href="/shop"
                        onClick={() => { setIsOpen(false); reset(); }}
                        className="flex-1 text-center text-sm text-[#2D5016] border border-[#2D5016] py-2.5 rounded-xl hover:bg-[#2D5016] hover:text-white transition-all"
                      >
                        See All Products
                      </Link>
                      <button
                        onClick={reset}
                        className="flex-1 text-center text-sm text-[#6B6B6B] border border-gray-200 py-2.5 rounded-xl hover:border-gray-400 hover:text-[#1C1C1C] transition-all"
                      >
                        Retake Quiz
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
