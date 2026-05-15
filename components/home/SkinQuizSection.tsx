"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/data/products";

const questions = [
  {
    id: "skin_type",
    question: "What is your primary skin type?",
    options: [
      { label: "Oily / Combination", value: "oily" },
      { label: "Dry / Normal", value: "dry" },
      { label: "Sensitive", value: "sensitive" },
      { label: "Mature / Aging", value: "mature" },
    ],
  },
  {
    id: "concern",
    question: "What is your biggest skin concern?",
    options: [
      { label: "Acne & Breakouts", value: "acne" },
      { label: "Dullness & Dark Spots", value: "dull" },
      { label: "Blackheads & Pores", value: "pores" },
      { label: "Aging & Fine Lines", value: "aging" },
    ],
  },
  {
    id: "budget",
    question: "What is your budget per soap?",
    options: [
      { label: "Under ₹150", value: "low" },
      { label: "₹150 – ₹300", value: "mid" },
      { label: "₹300+", value: "high" },
      { label: "Best Value Bundle", value: "bundle" },
    ],
  },
];

function getRecommendation(answers: Record<string, string>) {
  const { skin_type, concern } = answers;

  if (concern === "acne" || concern === "pores" || skin_type === "oily") {
    return products.find((p) => p.id === "charcoal-soap")!;
  }
  return products.find((p) => p.id === "saffron-haldi-chandan")!;
}

export function SkinQuizSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<(typeof products)[0] | null>(null);

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setResult(getRecommendation(newAnswers));
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  const q = questions[step];

  return (
    <>
      <section id="skin-quiz" className="py-16 md:py-20 bg-[#EDE6D6]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-bold text-[#2D5016] mb-4 font-display">
              Not Sure Which Soap is Right For You?
            </h2>
            <p className="text-[#6B6B6B] text-lg mb-8">
              Take our 60-second skin quiz and get a personalized recommendation tailored to your skin.
            </p>
            <button
              onClick={() => setIsOpen(true)}
              className="bg-[#C4622D] text-white font-bold px-10 py-4 rounded-full text-lg hover:bg-[#D4734A] transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
            >
              Start Skin Quiz — It&apos;s Free →
            </button>
            <p className="text-sm text-[#6B6B6B] mt-3">3 quick questions · No email required</p>
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
            onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              {!result ? (
                <div className="p-8">
                  {/* Progress */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm text-[#6B6B6B]">Question {step + 1} of {questions.length}</span>
                    <button onClick={() => setIsOpen(false)} className="text-2xl text-[#6B6B6B] hover:text-[#1C1C1C]">×</button>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full mb-8">
                    <div
                      className="h-full bg-[#2D5016] rounded-full transition-all duration-500"
                      style={{ width: `${((step) / questions.length) * 100}%` }}
                    />
                  </div>

                  <h3 className="text-2xl font-bold text-[#1C1C1C] mb-6">
                    {q.question}
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    {q.options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleAnswer(q.id, opt.value)}
                        className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#F5F0E8] hover:bg-[#E8F0E0] hover:border-[#2D5016] border-2 border-transparent transition-all duration-200 text-center"
                      >
                        <span className="text-sm font-medium text-[#1C1C1C]">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-[#2D5016] mb-2">
                    Your Perfect Match!
                  </h3>
                  <p className="text-[#6B6B6B] text-sm mb-6">Based on your answers, we recommend:</p>

                  <div className="bg-[#F5F0E8] rounded-2xl p-5 mb-6">
                    <div className="relative w-full aspect-square max-w-[200px] mx-auto rounded-xl overflow-hidden mb-4">
                      <Image src={result.images[0]} alt={result.name} fill className="object-cover" sizes="200px" />
                    </div>
                    <h4 className="font-bold text-lg text-[#1C1C1C]">{result.name}</h4>
                    <p className="text-sm text-[#6B6B6B] mb-3">{result.tagline}</p>
                    <div className="text-2xl font-bold text-[#2D5016]">₹{result.price}</div>
                  </div>

                  <div className="space-y-3">
                    <Link
                      href={`/product/${result.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="block w-full bg-[#C4622D] text-white font-bold py-4 rounded-xl hover:bg-[#D4734A] transition-colors"
                    >
                      Shop This Now →
                    </Link>
                    <button
                      onClick={reset}
                      className="block w-full text-sm text-[#6B6B6B] hover:text-[#1C1C1C]"
                    >
                      Retake Quiz
                    </button>
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
