"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !dismissed) {
        setIsOpen(true);
      }
    };

    // Also trigger on mobile after 15s of inactivity
    const timer = setTimeout(() => {
      if (!dismissed && typeof window !== "undefined" && window.innerWidth < 768) {
        setIsOpen(true);
      }
    }, 15000);

    document.addEventListener("mouseleave", onMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      clearTimeout(timer);
    };
  }, [dismissed]);

  const handleClose = () => {
    setIsOpen(false);
    setDismissed(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(handleClose, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="bg-[#2D5016] p-6 text-center relative">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl"
              >
                ×
              </button>
              <h3 className="text-3xl font-bold text-white">
                Wait! Before You Go...
              </h3>
              <p className="text-white/80 mt-2 text-sm">Your skin deserves the best. Don&apos;t leave empty-handed.</p>
            </div>

            <div className="p-6 text-center">
              {!submitted ? (
                <>
                  <div className="bg-[#F5F0E8] rounded-2xl p-4 mb-5">
                    <div className="text-3xl font-bold text-[#C4622D]">10% OFF</div>
                    <div className="text-sm text-[#6B6B6B]">on your first order</div>
                  </div>
                  <p className="text-[#1C1C1C] text-sm mb-5">
                    Enter your email to get an exclusive discount code + skincare tips from our experts.
                  </p>
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2D5016]"
                    />
                    <button
                      type="submit"
                      className="bg-[#C4622D] text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-[#D4734A] transition-colors shrink-0"
                    >
                      Get 10% Off
                    </button>
                  </form>
                  <button onClick={handleClose} className="mt-4 text-xs text-[#6B6B6B] hover:text-[#1C1C1C]">
                    No thanks, I&apos;ll pay full price
                  </button>
                </>
              ) : (
                <div className="py-4">
                  <h4 className="text-xl font-bold text-[#2D5016] mb-2">Code Sent!</h4>
                  <p className="text-[#6B6B6B] text-sm">Check your email for your 10% off code. Happy shopping!</p>
                  <div className="mt-4 bg-[#F5F0E8] rounded-xl p-3 text-lg font-bold text-[#C4622D] tracking-widest">
                    WELCOME10
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
