import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '5 Proven Benefits of Activated Charcoal Soap for Acne-Prone Skin',
  description: 'Activated charcoal soap binds to excess oil, bacteria, and toxins in your pores — without stripping your skin barrier. Here are 5 evidence-backed benefits and how to use it correctly.',
  keywords: ['activated charcoal soap benefits', 'charcoal soap for acne', 'charcoal soap for oily skin', 'best soap for acne India', 'natural acne soap'],
  openGraph: {
    title: '5 Proven Benefits of Activated Charcoal Soap for Acne-Prone Skin',
    description: 'Evidence-backed benefits of activated charcoal for acne, blackheads, and oily skin — plus how to use it correctly.',
  },
}

export default function CharcoalBlogPost() {
  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Header */}
      <div className="bg-[#1A1A1A] text-white py-14 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <Link href="/blog" className="text-white/50 text-sm hover:text-white transition-colors">
              ← Blog
            </Link>
            <span className="text-white/30">·</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#2D5016] text-white">Anti-Acne</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-5">
            5 Proven Benefits of Activated Charcoal Soap for Acne-Prone Skin
          </h1>
          <div className="flex items-center gap-4 text-white/50 text-sm">
            <span>April 28, 2025</span>
            <span>·</span>
            <span>5 min read</span>
          </div>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-2xl mx-auto px-4 py-12">
        <div className="prose-custom">

          <p className="text-lg text-[#6B6B6B] leading-relaxed mb-8">
            Activated charcoal has become one of the most talked-about ingredients in skincare — and for good reason. Unlike trendy ingredients that promise results without mechanism, activated charcoal has a clear and well-understood mode of action. Here&apos;s what it actually does for acne-prone skin, and what you should realistically expect.
          </p>

          <h2 className="text-2xl font-bold text-[#1C1C1C] mt-10 mb-4">What Is Activated Charcoal?</h2>
          <p className="text-[#6B6B6B] leading-relaxed mb-6">
            Activated charcoal is not the same as the charcoal in your barbecue. It&apos;s made by heating carbon-rich materials (like coconut shells or bamboo) at very high temperatures in the presence of gas, creating millions of tiny pores across its surface. This gives it an enormous surface area — one gram of activated charcoal can have a surface area exceeding 500 square metres. That surface area is what makes it so effective at adsorption: binding toxins, oils, and bacteria to its surface before they can settle into your pores.
          </p>

          <h2 className="text-2xl font-bold text-[#1C1C1C] mt-10 mb-4">1. Deep-Cleans Pores Without Stripping</h2>
          <p className="text-[#6B6B6B] leading-relaxed mb-6">
            Most cleansers remove surface oil by breaking it down with surfactants — which can be harsh on the skin barrier. Activated charcoal works differently: it physically adsorbs excess sebum and draws it out of the pore. The result is a thorough clean that doesn&apos;t feel like it&apos;s stripping your face. When formulated alongside emollients like shea butter (as in our charcoal soap), the cleanser moisturises while it clears — so oily-skin types get the clean they need without the tight, dry feeling afterward.
          </p>

          <h2 className="text-2xl font-bold text-[#1C1C1C] mt-10 mb-4">2. Reduces Blackheads Over Time</h2>
          <p className="text-[#6B6B6B] leading-relaxed mb-6">
            Blackheads form when a pore fills with oxidised sebum and dead skin cells. Activated charcoal, used consistently, gradually draws out this accumulated debris. It won&apos;t dissolve a blackhead overnight the way a salicylic acid can — but daily use over 3–4 weeks measurably reduces the appearance of blackheads, particularly on the nose and chin. Think of it as maintenance: keeping pores from getting clogged in the first place, rather than a rescue treatment.
          </p>

          <h2 className="text-2xl font-bold text-[#1C1C1C] mt-10 mb-4">3. Controls Excess Oil Production</h2>
          <p className="text-[#6B6B6B] leading-relaxed mb-6">
            Oily skin overproduces sebum, often as a response to being dried out by harsh cleansers — a frustrating cycle. Activated charcoal breaks this cycle. By removing excess oil without disrupting the skin barrier, it helps signal to sebaceous glands that they don&apos;t need to compensate with extra production. Most people with oily skin notice their face feels less greasy throughout the day within 2–3 weeks of switching to a charcoal cleanser.
          </p>

          <h2 className="text-2xl font-bold text-[#1C1C1C] mt-10 mb-4">4. Antibacterial Action Against Acne-Causing Bacteria</h2>
          <p className="text-[#6B6B6B] leading-relaxed mb-6">
            <em>Cutibacterium acnes</em> (the bacteria responsible for most inflammatory acne) thrives in the oxygen-deprived environment of a clogged pore. Activated charcoal adsorbs these bacteria along with the sebum and dead skin cells that feed them. It doesn&apos;t kill bacteria the way benzoyl peroxide does — but it removes the conditions they need to proliferate. For people who find benzoyl peroxide too irritating, charcoal soap is a gentler alternative that still meaningfully reduces bacterial load.
          </p>

          <h2 className="text-2xl font-bold text-[#1C1C1C] mt-10 mb-4">5. Calms Post-Acne Redness</h2>
          <p className="text-[#6B6B6B] leading-relaxed mb-6">
            Activated charcoal has mild anti-inflammatory properties. When a pimple is healing, the surrounding skin often stays red and irritated for days. Regular use of charcoal soap — particularly formulations with soothing additives like tea tree or aloe — reduces this post-breakout inflammation. Users typically report that their skin looks calmer overall, with fewer of the angry red patches that follow individual breakouts.
          </p>

          <h2 className="text-2xl font-bold text-[#1C1C1C] mt-10 mb-4">How to Use Charcoal Soap Correctly</h2>
          <p className="text-[#6B6B6B] leading-relaxed mb-4">
            The most common mistake is leaving charcoal soap on like a mask — rinsing it off within 30 seconds barely allows any adsorption to occur. For best results:
          </p>
          <ul className="list-none space-y-3 mb-6">
            {[
              'Wet your face with lukewarm water (not hot — heat opens pores but can also irritate acne)',
              'Work up a lather in your hands, then apply to your face',
              'Massage gently in circular motions for 60–90 seconds',
              'Rinse thoroughly — charcoal leaves no residue when properly washed off',
              'Follow with a light, non-comedogenic moisturiser',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 bg-[#2D5016] text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                <span className="text-[#6B6B6B]">{step}</span>
              </li>
            ))}
          </ul>
          <p className="text-[#6B6B6B] leading-relaxed mb-8">
            Use once or twice daily. If you have dry or sensitive skin, start with once a day (morning or evening) and observe how your skin responds over one week before increasing frequency.
          </p>

          <h2 className="text-2xl font-bold text-[#1C1C1C] mt-10 mb-4">What to Realistically Expect</h2>
          <p className="text-[#6B6B6B] leading-relaxed mb-8">
            Charcoal soap is not a cure for severe cystic acne — if your acne is deep, nodular, or cystic, you need a dermatologist. But for everyday comedonal acne, blackheads, oily skin, and mild breakouts, a well-formulated activated charcoal soap is one of the most effective OTC options available. Most users see a noticeable difference in oiliness within one week, a reduction in blackheads within three to four weeks, and clearer skin overall by the six-week mark.
          </p>

        </div>

        {/* CTA */}
        <div className="mt-12 bg-[#1A1A1A] rounded-3xl p-8 text-center">
          <p className="text-[#9BCB6A] text-sm font-bold uppercase tracking-widest mb-3">Try It Yourself</p>
          <h3 className="text-2xl font-bold text-white mb-3">Hardin Organics Activated Charcoal Soap</h3>
          <p className="text-white/60 mb-6 max-w-sm mx-auto">
            Activated charcoal + shea butter + coconut oil. No SLS, no parabens, no artificial fragrance. Handcrafted in small batches in India.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href="/product/activated-charcoal-soap"
              className="inline-flex items-center gap-2 bg-[#C4622D] text-white font-bold px-8 py-3.5 rounded-full hover:bg-[#D4734A] transition-colors"
            >
              Try Our Activated Charcoal Soap →
            </Link>
            <span className="text-white/50 text-sm">₹199 · Free shipping above ₹399</span>
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
