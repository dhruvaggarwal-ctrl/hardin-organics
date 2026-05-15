import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Haldi Chandan Soap: The Ancient Ayurvedic Secret for Glowing Skin',
  description: 'Turmeric, sandalwood, and saffron have been used in Indian skincare for over 3,000 years. Here\'s the science behind each ingredient and why the combination works so well for brightening and evening skin tone.',
  keywords: ['haldi chandan soap benefits', 'turmeric soap for glowing skin', 'saffron soap India', 'ayurvedic soap for glowing skin', 'natural soap for dark spots'],
  openGraph: {
    title: 'Haldi Chandan Soap: The Ancient Ayurvedic Secret for Glowing Skin',
    description: 'The science behind turmeric, sandalwood, and saffron — and why this ancient trio still works better than most modern brightening ingredients.',
  },
}

export default function HaldiChandanBlogPost() {
  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Header */}
      <div className="py-14 px-4" style={{ background: 'linear-gradient(135deg, #3A2A10 0%, #8B5E1A 100%)' }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <Link href="/blog" className="text-white/50 text-sm hover:text-white transition-colors">
              ← Blog
            </Link>
            <span className="text-white/30">·</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#D4A017] text-white">Glow &amp; Brightening</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-5">
            Haldi Chandan Soap: The Ancient Ayurvedic Secret for Glowing Skin
          </h1>
          <div className="flex items-center gap-4 text-white/50 text-sm">
            <span>April 14, 2025</span>
            <span>·</span>
            <span>6 min read</span>
          </div>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-2xl mx-auto px-4 py-12">

        <p className="text-lg text-[#6B6B6B] leading-relaxed mb-8">
          Indian skincare has used haldi (turmeric), chandan (sandalwood), and kesar (saffron) for millennia. These aren&apos;t folk remedies waiting for science to catch up — there&apos;s substantial research on each ingredient&apos;s mechanism. Here&apos;s what each one actually does, and why they work exceptionally well together.
        </p>

        <h2 className="text-2xl font-bold text-[#1C1C1C] mt-10 mb-4">Haldi (Turmeric): Nature&apos;s Brightener</h2>
        <p className="text-[#6B6B6B] leading-relaxed mb-4">
          The active compound in turmeric is curcumin — a polyphenol with well-documented antioxidant and anti-inflammatory properties. For skin specifically, curcumin works in two ways:
        </p>
        <ul className="space-y-2 mb-6 pl-0">
          <li className="flex items-start gap-2 text-[#6B6B6B]">
            <span className="text-[#D4A017] font-bold mt-0.5">—</span>
            <span><strong className="text-[#1C1C1C]">Melanin inhibition:</strong> Curcumin inhibits the enzyme tyrosinase, which is involved in melanin production. Less melanin means reduced hyperpigmentation, dark spots, and post-acne marks.</span>
          </li>
          <li className="flex items-start gap-2 text-[#6B6B6B]">
            <span className="text-[#D4A017] font-bold mt-0.5">—</span>
            <span><strong className="text-[#1C1C1C]">Free radical scavenging:</strong> UV radiation generates free radicals that accelerate skin ageing and uneven tone. Curcumin neutralises these before they can cause damage.</span>
          </li>
        </ul>
        <p className="text-[#6B6B6B] leading-relaxed mb-6">
          The concern most people have is staining — but the concentrations in a properly formulated soap are far too low to leave a yellow tint. The turmeric does its work during the 60–90 seconds it&apos;s in contact with skin, then rinses away completely.
        </p>

        <h2 className="text-2xl font-bold text-[#1C1C1C] mt-10 mb-4">Chandan (Sandalwood): Soothing and Toning</h2>
        <p className="text-[#6B6B6B] leading-relaxed mb-6">
          Sandalwood contains alpha-santalol, a sesquiterpene alcohol with significant anti-inflammatory and antimicrobial properties. For everyday use, what this means:
        </p>
        <ul className="space-y-2 mb-6 pl-0">
          <li className="flex items-start gap-2 text-[#6B6B6B]">
            <span className="text-[#D4A017] font-bold mt-0.5">—</span>
            <span><strong className="text-[#1C1C1C]">Reduces redness and irritation</strong> — alpha-santalol inhibits pro-inflammatory signalling pathways, making it useful for reactive and sensitive skin</span>
          </li>
          <li className="flex items-start gap-2 text-[#6B6B6B]">
            <span className="text-[#D4A017] font-bold mt-0.5">—</span>
            <span><strong className="text-[#1C1C1C]">Mild astringent effect</strong> — naturally tightens and tones skin, reducing the appearance of enlarged pores</span>
          </li>
          <li className="flex items-start gap-2 text-[#6B6B6B]">
            <span className="text-[#D4A017] font-bold mt-0.5">—</span>
            <span><strong className="text-[#1C1C1C]">Moisture retention</strong> — sandalwood oil is an emollient that helps skin retain water, contributing to a plumper, more even surface</span>
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-[#1C1C1C] mt-10 mb-4">Kesar (Saffron): The Luxury Brightener</h2>
        <p className="text-[#6B6B6B] leading-relaxed mb-6">
          Saffron is the world&apos;s most expensive spice, and its skincare value matches its price. The active compounds — crocin, crocetin, and safranal — are potent antioxidants that:
        </p>
        <ul className="space-y-2 mb-6 pl-0">
          <li className="flex items-start gap-2 text-[#6B6B6B]">
            <span className="text-[#D4A017] font-bold mt-0.5">—</span>
            <span>Improve skin luminosity by protecting skin cells from oxidative damage and improving microcirculation</span>
          </li>
          <li className="flex items-start gap-2 text-[#6B6B6B]">
            <span className="text-[#D4A017] font-bold mt-0.5">—</span>
            <span>Inhibit melanin synthesis through a different pathway than curcumin — creating a synergistic brightening effect when both are used together</span>
          </li>
          <li className="flex items-start gap-2 text-[#6B6B6B]">
            <span className="text-[#D4A017] font-bold mt-0.5">—</span>
            <span>Reduce the appearance of fine lines through their antioxidant activity</span>
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-[#1C1C1C] mt-10 mb-4">Why the Combination Works Better Than Any Single Ingredient</h2>
        <p className="text-[#6B6B6B] leading-relaxed mb-6">
          Each of these three ingredients targets melanin production through a slightly different mechanism. Haldi inhibits tyrosinase enzymatically. Saffron scavenges the free radicals that trigger excess melanin production. Sandalwood calms the inflammation that can lead to post-inflammatory hyperpigmentation (the dark marks that linger after a pimple heals). Together, they address the same problem — uneven, dull skin tone — from three angles simultaneously.
        </p>
        <p className="text-[#6B6B6B] leading-relaxed mb-8">
          This is why Ayurvedic formulations have been so durable. Pre-modern practitioners didn&apos;t know the molecular mechanisms, but thousands of years of empirical observation arrived at combinations that turn out to be synergistic in ways modern science can now explain.
        </p>

        <h2 className="text-2xl font-bold text-[#1C1C1C] mt-10 mb-4">What Results to Expect and When</h2>
        <p className="text-[#6B6B6B] leading-relaxed mb-4">
          Skin brightening is gradual. Here&apos;s a realistic timeline:
        </p>
        <div className="space-y-3 mb-8">
          {[
            { time: 'Week 1–2', result: 'Skin feels smoother and slightly more even. The astringent effect of sandalwood is noticeable immediately.' },
            { time: 'Week 3–4', result: 'Visible reduction in redness and mild dark spots. Skin tone starts to look more uniform.' },
            { time: 'Week 6–8', result: 'Significant brightening for most skin types. Post-acne marks lighten noticeably. Skin appears more luminous overall.' },
          ].map(({ time, result }) => (
            <div key={time} className="bg-white rounded-2xl p-4 border border-[#EDE6D6] flex gap-4">
              <span className="text-xs font-bold bg-[#D4A017] text-white px-2 py-1 rounded-lg h-fit whitespace-nowrap">{time}</span>
              <p className="text-[#6B6B6B] text-sm leading-relaxed">{result}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-[#1C1C1C] mt-10 mb-4">Who Should Use Haldi Chandan Soap</h2>
        <p className="text-[#6B6B6B] leading-relaxed mb-6">
          This soap works best for normal, dry, and combination skin types. People with dull, uneven skin tone, post-acne hyperpigmentation, or general skin tiredness will see the most pronounced results. It&apos;s also excellent as a body soap — the brightening effect works anywhere on the body where you have dark spots or uneven tone (underarms, knees, elbows). Those with very oily or acne-prone skin may find the activated charcoal soap a better primary cleanser, using haldi chandan as an evening or alternate-day soap.
        </p>

        {/* CTA */}
        <div className="mt-12 rounded-3xl p-8 text-center" style={{ background: 'linear-gradient(135deg, #3A2A10 0%, #8B5E1A 100%)' }}>
          <p className="text-[#D4A017] text-sm font-bold uppercase tracking-widest mb-3">Try the Ancient Formula</p>
          <h3 className="text-2xl font-bold text-white mb-3">Hardin Organics Saffron Haldi Chandan Soap</h3>
          <p className="text-white/60 mb-6 max-w-sm mx-auto">
            Real saffron, turmeric, and sandalwood in a handcrafted cold-process bar. No artificial brighteners, no synthetic fragrance.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href="/product/saffron-haldi-chandan-soap"
              className="inline-flex items-center gap-2 bg-[#D4A017] text-white font-bold px-8 py-3.5 rounded-full hover:bg-[#E8B52A] transition-colors"
            >
              Try Saffron Haldi Chandan Soap →
            </Link>
            <span className="text-white/50 text-sm">₹299 · Free shipping above ₹399</span>
          </div>
        </div>

        {/* Back to blog */}
        <div className="mt-10 text-center">
          <Link href="/blog" className="text-[#2D5016] font-semibold text-sm hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </article>
    </div>
  )
}
