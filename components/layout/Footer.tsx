import Link from "next/link";

export function Footer() {
  return (
    <footer id="contact" className="bg-[#1C1C1C] text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hardin-logo.png"
              alt="Hardin Organics"
              className="h-12 w-auto object-contain brightness-0 invert"
            />
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Handcrafted organic soaps made with love, pure ingredients, and the wisdom of Ayurveda. For skin that deserves only the best.
          </p>
          <div className="flex gap-3">
            <a
              href="https://www.instagram.com/hardin_organics/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#D4A017] transition-colors"
              aria-label="Instagram @hardin_organics"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/hardin_soaps/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#D4A017] transition-colors"
              aria-label="Instagram @hardin_soaps"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-bold text-base mb-4 text-white">Quick Links</h4>
          <ul className="space-y-2.5">
            {[
              { label: "Home", href: "/" },
              { label: "Shop All Products", href: "/shop" },
              { label: "About Us", href: "/about" },
              { label: "Skin Quiz", href: "/#skin-quiz" },
              { label: "Ingredients", href: "/#ingredients" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-gray-400 text-sm hover:text-[#D4A017] transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer care */}
        <div>
          <h4 className="font-bold text-base mb-4 text-white">Customer Care</h4>
          <ul className="space-y-2.5">
            {[
              { label: "Track My Order", href: "/track" },
              { label: "FAQ", href: "/#faq" },
              { label: "Shipping Policy", href: "/shipping" },
              { label: "Return & Refund Policy", href: "/returns" },
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms & Conditions", href: "/terms" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-gray-400 text-sm hover:text-[#D4A017] transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-base mb-4 text-white">Get in Touch</h4>
          <div className="space-y-3">
            <a href="https://wa.me/919650595027" className="flex items-center gap-2 text-gray-400 text-sm hover:text-[#D4A017] transition-colors">
              +91 98719 00959 (WhatsApp)
            </a>
            <a href="mailto:marketinghardinorganics@gmail.com" className="flex items-center gap-2 text-gray-400 text-sm hover:text-[#D4A017] transition-colors">
              marketinghardinorganics@gmail.com
            </a>
            <p className="flex items-start gap-2 text-gray-400 text-sm">
              India — Shipping Pan-India
            </p>
          </div>

          {/* Newsletter */}
          <div className="mt-6">
            <p className="text-sm text-gray-400 mb-2">Get 10% off your first order:</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-white/10 text-white placeholder-gray-500 text-sm px-3 py-2 rounded-lg border border-white/20 focus:outline-none focus:border-[#D4A017]"
              />
              <button className="bg-[#D4A017] text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#E8B52A] transition-colors">
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className="text-gray-500 text-xs">Accepted payments:</span>
            {["UPI", "Razorpay", "Visa", "Mastercard", "COD"].map((p) => (
              <span key={p} className="bg-white/10 text-gray-300 text-xs px-2.5 py-1 rounded font-medium">
                {p}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {["SSL Secured", "100% Natural", "Easy Returns"].map((badge) => (
              <span key={badge} className="text-gray-400 text-xs">{badge}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 py-4 text-center text-xs text-gray-600">
        © 2024 Hardin Organics. All rights reserved. Made in India.
      </div>
    </footer>
  );
}
