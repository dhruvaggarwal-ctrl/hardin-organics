import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Learn about Hardin Organics — how we started, why we exist, and our mission to bring pure, natural skincare to every Indian home.",
};

const pillars = [
  {
    icon: "🌿",
    title: "100% Natural",
    desc: "Every ingredient in every bar is sourced from nature. No synthetic fillers, no chemical shortcuts.",
  },
  {
    icon: "🤲",
    title: "Handcrafted",
    desc: "Made in small batches using the cold-process method, preserving all the goodness of each ingredient.",
  },
  {
    icon: "🔍",
    title: "Transparent",
    desc: "Full ingredient disclosure, always. If you can't pronounce it, it's not in our soap.",
  },
  {
    icon: "🌱",
    title: "Sustainable",
    desc: "Eco-friendly packaging, ethically sourced ingredients, and zero compromise on our planet.",
  },
];

const milestones = [
  { year: "2022", title: "The Beginning", desc: "Started making soaps in a small kitchen after failing to find a truly natural soap in the market." },
  { year: "2022", title: "First 100 Customers", desc: "Word spread fast — within 3 months, we had 100 loyal customers sharing their results." },
  { year: "2023", title: "Online Launch", desc: "Launched hardinorganics.com and started taking orders pan-India." },
  { year: "2023", title: "5,000 Happy Customers", desc: "Crossed 5,000 customers milestone. 4.8★ average rating on all reviews." },
  { year: "2024", title: "10,000+ Bars Sold", desc: "Over 10,000 bars sold. Still handmade. Still honest. Still just the two of us." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Hero */}
      <div className="relative bg-[#2D5016] py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10 text-[300px] select-none flex items-center justify-center text-white">🌿</div>
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-display">
            Our Story
          </h1>
          <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
            Two people. One belief. That skincare should be simple, honest, and kind to your skin.
          </p>
        </div>
      </div>

      {/* Story section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
              <Image
                src="/images/brand-hand.jpg"
                alt="Hardin Organics Saffron Haldi Chandan soap held by founder Dhruv"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-[#D4A017] text-white rounded-2xl p-4 shadow-xl text-center">
              <div className="text-4xl font-bold">10K+</div>
              <div className="text-sm font-medium">Bars Sold</div>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 bg-[#E8F0E0] text-[#2D5016] text-sm font-semibold px-4 py-2 rounded-full mb-6">
              🌱 How It Started
            </div>
            <h2 className="text-4xl font-bold text-[#1C1C1C] leading-tight mb-6 font-display">
              Born From a Frustration, Built on a Belief
            </h2>
            <p className="text-[#6B6B6B] leading-relaxed mb-4">
              In 2022, after years of struggling with oily, acne-prone skin and failing to find a soap without a novel-length ingredient list full of chemicals, we decided to make one ourselves.
            </p>
            <p className="text-[#6B6B6B] leading-relaxed mb-4">
              We went back to our roots — to the Ayurvedic wisdom our grandmothers swore by. Activated charcoal for deep cleansing. Saffron, haldi, and chandan for brightening and glow. Real, recognizable ingredients with centuries of proven results.
            </p>
            <p className="text-[#6B6B6B] leading-relaxed mb-8">
              We started small — just us, a recipe, and a belief that people deserve to know exactly what they&apos;re putting on their skin. Three years and 10,000+ happy customers later, that belief hasn&apos;t changed. And neither has our recipe.
            </p>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#C4622D] text-white font-bold px-8 py-4 rounded-full hover:bg-[#D4734A] transition-all duration-300"
            >
              Shop Our Soaps →
            </Link>
          </div>
        </div>
      </div>

      {/* Our Promise */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2D5016] font-display">
              Our Four Pillars
            </h2>
            <p className="text-[#6B6B6B] mt-3 text-lg">Everything we do is guided by these core values</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, i) => (
              <div key={i} className="bg-[#F5F0E8] rounded-2xl p-6 text-center hover:-translate-y-1 transition-transform duration-300">
                <div className="text-4xl mb-4">{p.icon}</div>
                <h3 className="font-bold text-[#1C1C1C] text-lg mb-2">
                  {p.title}
                </h3>
                <p className="text-[#6B6B6B] text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#2D5016] font-display">
              Our Journey
            </h2>
          </div>
          <div className="space-y-0">
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-[#2D5016] rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">
                    {m.year}
                  </div>
                  {i < milestones.length - 1 && (
                    <div className="w-0.5 flex-1 bg-[#2D5016]/20 my-2" />
                  )}
                </div>
                <div className="pb-8 pt-2">
                  <h3 className="font-bold text-[#1C1C1C] text-lg">{m.title}</h3>
                  <p className="text-[#6B6B6B] text-sm mt-1 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#2D5016] py-16 text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-4 font-display">
            Ready to Try Hardin Organics?
          </h2>
          <p className="text-white/70 mb-8">Join 10,000+ customers who&apos;ve made the switch to honest skincare.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#C4622D] text-white font-bold px-10 py-4 rounded-full text-lg hover:bg-[#D4734A] transition-all duration-300 hover:shadow-lg"
          >
            Shop Now — Free Shipping →
          </Link>
        </div>
      </div>
    </div>
  );
}
