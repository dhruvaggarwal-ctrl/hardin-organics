"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const WA_NUMBER = "919650595027";

const MENU_ITEMS = [
  {
    icon: "📦",
    label: "Track My Order",
    sub: "Know your order status instantly",
    text: "Hi! I'd like to track my order. My Order ID is: ",
  },
  {
    icon: "🔁",
    label: "Reorder My Soaps",
    sub: "Skip the website, just tell us",
    text: "Hi! I'd like to reorder. I previously ordered ",
  },
  {
    icon: "❓",
    label: "I Have a Question",
    sub: "We reply within 30 minutes",
    text: "Hi! I have a question about Hardin Organics soaps.",
  },
  {
    icon: "🎁",
    label: "Bulk / Gift Orders",
    sub: "10+ soaps? We have special pricing",
    text: "Hi! I'm interested in placing a bulk or gift order.",
  },
];

const WA_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#25D366] shrink-0 mt-0.5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const [showDot, setShowDot] = useState(false);
  const [didBounce, setDidBounce] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const isConfirmation = pathname === "/order-confirmation";
    const dismissed = localStorage.getItem("wa_dot_dismissed");
    setShowDot(isConfirmation && !dismissed);
    // Bounce once on first mount
    const t = setTimeout(() => setDidBounce(true), 1200);
    return () => clearTimeout(t);
  }, [pathname]);

  // Close on outside click or Escape
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  function toggle() {
    setOpen((v) => !v);
    if (showDot) {
      localStorage.setItem("wa_dot_dismissed", "1");
      setShowDot(false);
    }
  }

  return (
    <div ref={ref} className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-3">
      {/* Menu card */}
      {open && (
        <div className="bg-[#F5F0E8] rounded-2xl shadow-2xl border-l-4 border-[#A0522D] w-72 overflow-hidden animate-wa-slide-up">
          <div className="px-4 py-3 border-b border-[#E8DDD0]">
            <p className="text-sm font-semibold text-[#1C1C1A]">Chat with us</p>
          </div>
          {MENU_ITEMS.map((item) => (
            <a
              key={item.label}
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(item.text)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 px-4 py-3 hover:bg-[#A0522D]/10 transition-colors"
            >
              {WA_ICON}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1C1C1A]">{item.icon} {item.label}</p>
                <p className="text-xs text-[#6B6B6B] mt-0.5">{item.sub}</p>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={toggle}
        aria-label="Chat on WhatsApp"
        className={`relative w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl flex items-center justify-center hover:bg-[#20BA5A] transition-all duration-200 ${didBounce && !open ? "animate-wa-bounce" : ""}`}
      >
        {showDot && (
          <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
        )}
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        )}
      </button>
    </div>
  );
}
