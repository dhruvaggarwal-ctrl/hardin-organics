"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "Are your soaps suitable for sensitive skin?",
    a: "Absolutely! Our soaps are formulated without harsh chemicals like SLS, parabens, or artificial fragrances — the main culprits behind skin irritation. The Saffron Haldi Chandan Soap is especially gentle and is loved by our customers with sensitive skin. If you have a known allergy to any specific ingredient, please check the full ingredient list before purchase.",
  },
  {
    q: "How long does one soap bar last?",
    a: "With daily use, one 75g bar typically lasts 4-6 weeks. To maximize the life of your soap, keep it on a dry soap dish between uses and let it dry completely. Avoid leaving it in a pool of water.",
  },
  {
    q: "Do you offer COD (Cash on Delivery)?",
    a: "Yes! We offer Cash on Delivery across India. Simply select COD at checkout. We also accept UPI, Credit/Debit cards, and Net Banking through Razorpay — all fully secure.",
  },
  {
    q: "How do I contact you if I have an issue with my order?",
    a: "We're always here to help! Reach us on WhatsApp at +91 96505 95027 or email us and our team will respond quickly to sort out any concerns.",
  },
  {
    q: "Are your ingredients sourced from India?",
    a: "Yes! We proudly source all our ingredients from within India. The saffron comes from Kashmir, sandalwood from Karnataka, and turmeric from Rajasthan. Supporting Indian farmers is part of our mission.",
  },
  {
    q: "Are Hardin Organics soaps tested on animals?",
    a: "Never. We are proudly 100% cruelty-free. Our products are never tested on animals. We believe great skincare and compassion go hand in hand.",
  },
  {
    q: "How long does delivery take?",
    a: "We ship pan-India! Standard delivery takes 4-7 business days. Express delivery (2-3 days) is available for select cities. Orders above ₹399 get FREE standard shipping. You'll receive a tracking link via SMS/WhatsApp once your order is dispatched.",
  },
  {
    q: "Can I use these soaps on my face daily?",
    a: "Yes! Both our soaps are pH-balanced and gentle enough for daily facial use. The Charcoal Soap can be used once or twice daily for oily/acne-prone skin. The Saffron Haldi Chandan Soap is suitable for twice-daily use on all skin types. Always follow with a moisturizer.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 md:py-20 bg-[#F5F0E8]">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#2D5016] font-display">
            Frequently Asked Questions
          </h2>
          <p className="text-[#6B6B6B] mt-3 text-lg">Everything you need to know before you buy</p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-semibold text-[#1C1C1C] pr-4">{faq.q}</span>
                <span
                  className="shrink-0 w-7 h-7 rounded-full bg-[#F5F0E8] flex items-center justify-center text-[#2D5016] font-bold transition-transform duration-300"
                  style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}
                >
                  +
                </span>
              </button>

              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-[#6B6B6B] leading-relaxed border-t border-gray-100 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-[#1C1C1C] font-semibold mb-2">Still have questions?</p>
          <p className="text-[#6B6B6B] text-sm mb-4">We&apos;re just a WhatsApp message away</p>
          <a
            href="https://wa.me/919650595027?text=Hi! I have a question about Hardin Organics soaps"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-full hover:bg-green-500 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
