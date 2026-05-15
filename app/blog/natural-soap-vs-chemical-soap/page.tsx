import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Natural Soap vs Chemical Soap: What\'s Really in Your Bar?',
  description: 'Most supermarket soaps aren\'t soap at all — they\'re synthetic detergent bars. Learn how to read a soap ingredient list, what SLS and parabens actually do, and what to look for in a natural soap.',
  keywords: ['natural soap vs chemical soap', 'SLS free soap', 'paraben free soap India', 'how to read soap ingredients', 'best natural soap India', 'syndet bar vs natural soap'],
  openGraph: {
    title: 'Natural Soap vs Chemical Soap: What\'s Really in Your Bar?',
    description: 'A plain-English breakdown of what\'s in most supermarket soap bars, why it matters, and what to look for instead.',
  },
}

export default function NaturalVsChemicalBlogPost() {
  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Header */}
      <div className="bg-[#2D5016] py-14 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <Link href="/blog" className="text-white/50 text-sm hover:text-white transition-colors">
              ← Blog
            </Link>
            <span className="text-white/30">·</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#C4622D] text-white">Ingredients</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-5">
            Natural Soap vs Chemical Soap: What&apos;s Really in Your Bar?
          </h1>
          <div className="flex items-center gap-4 text-white/50 text-sm">
            <span>March 31, 2025</span>
            <span>·</span>
            <span>7 min read</span>
          </div>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-2xl mx-auto px-4 py-12">

        <p className="text-lg text-[#6B6B6B] leading-relaxed mb-8">
          Pick up a bar of soap from any Indian supermarket and read the label. Chances are you&apos;ll find words like &quot;syndet,&quot; &quot;sodium lauryl sulfate,&quot; or a long list of ingredients you can&apos;t place. The term &quot;soap&quot; is used loosely — legally, a product can only be called soap if it&apos;s made from the saponification of oils and fats. Most commercial bars don&apos;t qualify. Here&apos;s what you&apos;re actually buying and why it matters.
        </p>

        <h2 className="text-2xl font-bold text-[#1C1C1C] mt-10 mb-4">What Makes Something &quot;Real Soap&quot;</h2>
        <p className="text-[#6B6B6B] leading-relaxed mb-6">
          True soap is the product of saponification: mixing oils or fats (like coconut oil, shea butter, or olive oil) with an alkali (usually sodium hydroxide — lye). The chemical reaction transforms both completely. The lye is consumed in the process; what remains is glycerine-rich soap that cleanses without stripping the skin&apos;s natural acid mantle.
        </p>
        <p className="text-[#6B6B6B] leading-relaxed mb-6">
          Cold process and hot process soaps made this way retain the glycerine that is generated during saponification. Glycerine is a humectant — it draws moisture from the air to your skin. This is why handcrafted soaps feel moisturising compared to commercial bars, which have had the glycerine extracted (because glycerine is more valuable as a standalone cosmetic ingredient than it is left in the soap).
        </p>

        <h2 className="text-2xl font-bold text-[#1C1C1C] mt-10 mb-4">What Is a &quot;Syndet Bar&quot;?</h2>
        <p className="text-[#6B6B6B] leading-relaxed mb-6">
          &quot;Syndet&quot; stands for synthetic detergent. Most commercial bars — Dove, Lux, Dettol, Lifebuoy — are syndet bars. They are made from synthetic surfactants rather than saponified oils. This isn&apos;t inherently evil: syndets can be formulated to be gentle. But many are not, and their ingredient lists often include substances that have legitimate concerns attached.
        </p>

        <h2 className="text-2xl font-bold text-[#1C1C1C] mt-10 mb-4">Sodium Lauryl Sulfate (SLS): The Foaming Agent</h2>
        <p className="text-[#6B6B6B] leading-relaxed mb-4">
          SLS is the surfactant responsible for the satisfying foam in most cleansers, shampoos, and toothpastes. It&apos;s effective at removing oil — sometimes too effective. The research on SLS is fairly clear:
        </p>
        <ul className="space-y-2 mb-6 pl-0">
          <li className="flex items-start gap-2 text-[#6B6B6B]">
            <span className="text-[#C4622D] font-bold mt-0.5">—</span>
            <span>SLS disrupts the skin&apos;s lipid barrier, reducing its ability to retain moisture. This is why skin feels tight and dry after washing with SLS-containing products.</span>
          </li>
          <li className="flex items-start gap-2 text-[#6B6B6B]">
            <span className="text-[#C4622D] font-bold mt-0.5">—</span>
            <span>In people prone to eczema or dermatitis, SLS can trigger or worsen flare-ups by compromising barrier function.</span>
          </li>
          <li className="flex items-start gap-2 text-[#6B6B6B]">
            <span className="text-[#C4622D] font-bold mt-0.5">—</span>
            <span>Oily skin produces more sebum after SLS use because the skin is trying to compensate for what was stripped — a frustrating feedback loop.</span>
          </li>
        </ul>
        <p className="text-[#6B6B6B] leading-relaxed mb-6">
          SLES (sodium laureth sulfate) is a milder variant — it&apos;s been ethoxylated to reduce irritation — but it can contain trace amounts of 1,4-dioxane, a potential carcinogen, depending on manufacturing quality.
        </p>

        <h2 className="text-2xl font-bold text-[#1C1C1C] mt-10 mb-4">Parabens: The Preservative Debate</h2>
        <p className="text-[#6B6B6B] leading-relaxed mb-6">
          Parabens (methylparaben, propylparaben, butylparaben) are used to extend shelf life in cosmetics. They&apos;re effective and cheap. The concern: parabens are weakly estrogenic — they can bind to oestrogen receptors in the body, though at very low potency. The evidence on whether cosmetic-level paraben exposure has meaningful health effects is genuinely contested in the scientific literature. The precautionary principle suggests avoiding them, particularly for products used daily on large skin surface areas. The EU has restricted certain parabens in cosmetics; India has not yet done so, but consumer demand for paraben-free products has grown significantly.
        </p>

        <h2 className="text-2xl font-bold text-[#1C1C1C] mt-10 mb-4">Artificial Fragrance: The Hidden Ingredient</h2>
        <p className="text-[#6B6B6B] leading-relaxed mb-6">
          &quot;Fragrance&quot; or &quot;parfum&quot; on an ingredient list is a black box. Companies aren&apos;t required to disclose what&apos;s in a fragrance because it&apos;s considered proprietary. A single &quot;fragrance&quot; ingredient can contain dozens of individual chemicals, some of which are known allergens (linalool, limonene, citronellol) or sensitisers. For people with sensitive skin or allergies, fragrance is one of the most common triggers of contact dermatitis. Natural soaps scented with essential oils don&apos;t have this problem — you can look up any essential oil&apos;s safety profile individually.
        </p>

        <h2 className="text-2xl font-bold text-[#1C1C1C] mt-10 mb-4">How to Read a Soap Ingredient List</h2>
        <p className="text-[#6B6B6B] leading-relaxed mb-4">
          Ingredients are listed in descending order of concentration. Here&apos;s what to look for:
        </p>
        <div className="space-y-3 mb-8">
          {[
            {
              label: 'Good signs',
              color: '#2D5016',
              items: ['"Sodium" + oil name (e.g., sodium cocoate, sodium olivate) — these are saponified oils, the base of real soap', 'Glycerin listed high up — means they kept the natural glycerine in', 'Essential oils rather than "fragrance" or "parfum"', 'Short ingredient list you can mostly understand'],
            },
            {
              label: 'Watch out for',
              color: '#C4622D',
              items: ['Sodium lauryl sulfate or SLES near the top', '"Fragrance" or "parfum" without further specification', 'Methylparaben, propylparaben, butylparaben', 'PEG compounds (can carry trace contaminants)', 'Long lists of synthetic polymers and film-formers'],
            },
          ].map(({ label, color, items }) => (
            <div key={label} className="bg-white rounded-2xl p-5 border border-[#EDE6D6]">
              <p className="font-bold mb-3" style={{ color }}>{label}</p>
              <ul className="space-y-2">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-[#6B6B6B] text-sm">
                    <span style={{ color }} className="mt-0.5 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-[#1C1C1C] mt-10 mb-4">The Bottom Line</h2>
        <p className="text-[#6B6B6B] leading-relaxed mb-6">
          Switching to natural soap isn&apos;t about fear. It&apos;s about preference for simpler, better-understood ingredients — and for the skin benefits that come from keeping glycerine in the soap and using real botanical ingredients rather than synthetic approximations. Real soap made from natural oils with no added preservatives or synthetic surfactants is gentler on the skin barrier, better for sensitive skin, and — when formulated with active botanicals like charcoal or turmeric — genuinely effective for specific skin concerns.
        </p>
        <p className="text-[#6B6B6B] leading-relaxed mb-8">
          The trade-off is shelf life (natural soaps typically last 12–18 months vs 2–3 years for commercial bars) and sometimes price. But for a product you use on your body twice a day, every day, it&apos;s a trade-off worth considering.
        </p>

        {/* CTA */}
        <div className="mt-12 bg-[#2D5016] rounded-3xl p-8 text-center">
          <p className="text-[#9BCB6A] text-sm font-bold uppercase tracking-widest mb-3">Make the Switch</p>
          <h3 className="text-2xl font-bold text-white mb-3">Hardin Organics Natural Soaps</h3>
          <p className="text-white/60 mb-6 max-w-sm mx-auto">
            Real saponified oils. Natural glycerine retained. Essential oil fragrance only. No SLS, no parabens, no synthetic fragrance. Handcrafted in India.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#C4622D] text-white font-bold px-8 py-3.5 rounded-full hover:bg-[#D4734A] transition-colors"
            >
              Shop All Natural Soaps →
            </Link>
            <span className="text-white/50 text-sm">From ₹199 · Free shipping above ₹399</span>
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
