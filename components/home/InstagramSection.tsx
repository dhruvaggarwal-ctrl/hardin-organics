"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// ── Reel cards ──────────────────────────────────────────────────────────────
// Replace `thumb` with a real reel thumbnail screenshot once you have one.
// Replace `url` with the actual Instagram reel URL.
// Replace `handle` and `followers` with real influencer info.
const reels = [
  {
    thumb: "/images/charcoal-2.png",
    handle: "@hardin_organics",
    caption: "The charcoal soap routine that cleared my skin in 3 weeks",
    followers: "Official",
    url: "https://www.instagram.com/hardin_organics/",
  },
  {
    thumb: "/images/haldi-2.png",
    handle: "@hardin_soaps",
    caption: "Saffron + Haldi + Chandan — why this combination works",
    followers: "Official",
    url: "https://www.instagram.com/hardin_soaps/",
  },
  {
    thumb: "/images/charcoal-3.png",
    handle: "@influencer_handle",
    caption: "I switched to Hardin Organics and never looked back",
    followers: "45K followers",
    url: "https://www.instagram.com/hardin_organics/",
  },
  {
    thumb: "/images/haldi-4.png",
    handle: "@influencer_handle2",
    caption: "Honest review after 30 days of using the saffron soap",
    followers: "28K followers",
    url: "https://www.instagram.com/hardin_organics/",
  },
  {
    thumb: "/images/haldi-3.png",
    handle: "@influencer_handle3",
    caption: "POV: you finally find a soap that actually works on acne",
    followers: "62K followers",
    url: "https://www.instagram.com/hardin_organics/",
  },
];

// Play icon SVG
function PlayIcon() {
  return (
    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
      <svg className="w-5 h-5 text-[#1C1C1C] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  );
}

export function InstagramSection() {
  return (
    <section className="py-14 bg-[#F5F0E8] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#C4622D] mb-1">As seen on</p>
            <h2
              className="text-3xl md:text-4xl font-bold text-[#1C1C1C] font-display"
            >
              Creators Love Hardin Organics
            </h2>
            <p className="text-[#6B6B6B] text-sm mt-1">
              Real reviews from real people — no scripts, no paid scripts
            </p>
          </div>
          <a
            href="https://www.instagram.com/hardin_organics/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#2D5016] hover:underline shrink-0"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            View all reels →
          </a>
        </motion.div>

        {/* Horizontal scroll reel cards (9:16 portrait ratio) */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-3 -mx-4 px-4">
          {reels.map((reel, i) => (
            <motion.a
              key={i}
              href={reel.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="group snap-start shrink-0 w-44 sm:w-52 relative rounded-2xl overflow-hidden shadow-md"
              style={{ aspectRatio: "9/16" }}
            >
              {/* Thumbnail */}
              <Image
                src={reel.thumb}
                alt={reel.caption}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 176px, 208px"
              />

              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Play button — center */}
              <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                <PlayIcon />
              </div>

              {/* Reel icon top-right */}
              <div className="absolute top-3 right-3 opacity-70">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                </svg>
              </div>

              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white font-semibold text-xs leading-tight mb-1">{reel.handle}</p>
                <p className="text-white/75 text-[10px] leading-tight line-clamp-2">{reel.caption}</p>
                <p className="text-white/50 text-[9px] mt-1">{reel.followers}</p>
              </div>
            </motion.a>
          ))}

          {/* "Tag us" card */}
          <motion.a
            href="https://www.instagram.com/hardin_organics/"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: reels.length * 0.07 }}
            className="snap-start shrink-0 w-44 sm:w-52 rounded-2xl border-2 border-dashed border-[#2D5016]/30 bg-white flex flex-col items-center justify-center gap-3 p-4 text-center hover:border-[#2D5016] transition-colors"
            style={{ aspectRatio: "9/16" }}
          >
            <svg viewBox="0 0 24 24" className="w-10 h-10 fill-[#2D5016]/40">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
            </svg>
            <div>
              <p className="text-sm font-bold text-[#2D5016]">Tag us in your reel</p>
              <p className="text-xs text-[#6B6B6B] mt-1 leading-tight">
                Use #HardinOrganics and get featured here
              </p>
            </div>
            <span className="text-xs font-semibold text-[#2D5016] border border-[#2D5016] px-3 py-1 rounded-full">
              @hardin_organics
            </span>
          </motion.a>
        </div>

        {/* Note for influencer collab */}
        <p className="text-center text-xs text-[#6B6B6B] mt-5">
          Want to collaborate?{" "}
          <a href="https://wa.me/919871900959" className="text-[#2D5016] font-semibold hover:underline">
            WhatsApp us
          </a>
        </p>
      </div>
    </section>
  );
}
