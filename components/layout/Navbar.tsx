"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Ingredients", href: "/#ingredients" },
  { label: "Reviews", href: "/#reviews" },
  { label: "Contact", href: "/#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems, openDrawer } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
            : "bg-[#F5F0E8]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hardin-logo.png"
              alt="Hardin Organics"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-[#1C1C1C] hover:text-[#2D5016] transition-colors"
              >
                {l.label}
              </Link>
            ))}

            {/* Account link */}
            <Link href="/account/dashboard" className="text-sm font-medium text-[#1C1C1C] hover:text-[#2D5016] transition-colors">
              My Account
            </Link>

            {/* BOGO animated button */}
            <Link
              href="/bogo"
              className="relative inline-flex items-center gap-1.5 bg-[#C4622D] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-[#D4734A] transition-colors overflow-hidden group"
            >
              {/* Shimmer sweep */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              {/* Pulse ring */}
              <span className="absolute inset-0 rounded-full animate-ping opacity-30 bg-[#C4622D]" />
              <span className="relative flex items-center gap-1.5">
                🔥
                <span>BOGO FREE</span>
              </span>
            </Link>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button className="hidden md:flex text-[#1C1C1C] hover:text-[#2D5016] transition-colors" aria-label="Search">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx={11} cy={11} r={8} />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>

            {/* Wishlist */}
            <button className="hidden md:flex text-[#1C1C1C] hover:text-[#2D5016] transition-colors" aria-label="Wishlist">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>

            {/* Cart */}
            <button
              onClick={openDrawer}
              className="relative flex items-center text-[#1C1C1C] hover:text-[#2D5016] transition-colors"
              aria-label="Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1={3} y1={6} x2={21} y2={6} />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#C4622D] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden text-[#1C1C1C]"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <line x1={3} y1={6} x2={21} y2={6} />
                <line x1={3} y1={12} x2={21} y2={12} />
                <line x1={3} y1={18} x2={21} y2={18} />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="relative ml-auto w-72 h-full bg-[#F5F0E8] flex flex-col p-6 shadow-2xl animate-slide-in-right">
            <div className="flex justify-between items-center mb-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hardin-logo.png"
                alt="Hardin Organics"
                className="h-8 w-auto object-contain"
              />
              <button onClick={() => setMenuOpen(false)} className="text-[#1C1C1C] text-2xl">×</button>
            </div>
            <nav className="flex flex-col gap-5">
              <Link
                href="/bogo"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-[#C4622D] text-white font-bold px-5 py-3 rounded-xl text-base mb-2"
              >
                🔥 BOGO FREE — Buy 1 Get 1
              </Link>
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-lg font-medium text-[#1C1C1C] hover:text-[#2D5016] border-b border-gray-200 pb-3"
                >
                  {l.label}
                </Link>
              ))}
              <Link href="/account/dashboard" onClick={() => setMenuOpen(false)} className="text-lg font-medium text-[#1C1C1C] hover:text-[#2D5016] border-b border-gray-200 pb-3">
                My Account
              </Link>
            </nav>
            <div className="mt-auto pt-6 border-t border-gray-200">
              <a
                href="https://wa.me/919871900959"
                className="flex items-center gap-2 text-sm text-[#6B6B6B]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.15 6.15l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.94 16.92z"/></svg>
                +91 98719 00959
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
