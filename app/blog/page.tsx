import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Skin Care Tips & Natural Beauty Secrets',
  description: 'Expert skin care advice, Ayurvedic beauty secrets, and honest ingredient breakdowns from Hardin Organics. Learn how natural soaps actually work.',
}

const posts = [
  {
    slug: 'activated-charcoal-soap-benefits',
    title: '5 Proven Benefits of Activated Charcoal Soap for Acne-Prone Skin',
    excerpt: 'Activated charcoal works like a magnet — drawing out toxins, excess sebum, and bacteria from clogged pores. Here\'s what the science says and what to actually expect.',
    date: 'April 28, 2025',
    readTime: '5 min read',
    tag: 'Anti-Acne',
    tagColor: '#2D5016',
  },
  {
    slug: 'haldi-chandan-soap-for-glowing-skin',
    title: 'Haldi Chandan Soap: The Ancient Ayurvedic Secret for Glowing Skin',
    excerpt: 'Turmeric, sandalwood, and saffron have been used for centuries in Indian skincare. Here\'s what each ingredient actually does — and why the combination is so powerful.',
    date: 'April 14, 2025',
    readTime: '6 min read',
    tag: 'Glow & Brightening',
    tagColor: '#D4A017',
  },
  {
    slug: 'natural-soap-vs-chemical-soap',
    title: 'Natural Soap vs Chemical Soap: What\'s Really in Your Bar?',
    excerpt: 'Most supermarket soaps aren\'t technically soap at all — they\'re synthetic detergent bars. Here\'s how to read an ingredient label and what to look out for.',
    date: 'March 31, 2025',
    readTime: '7 min read',
    tag: 'Ingredients',
    tagColor: '#C4622D',
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Header */}
      <div className="bg-[#2D5016] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#9BCB6A] text-sm font-bold uppercase tracking-widest mb-3">From Our Journal</p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
            Skin Care Tips &amp; Natural Beauty Secrets
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Honest advice on natural ingredients, Ayurvedic traditions, and building a simpler skincare routine.
          </p>
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-4xl mx-auto px-4 py-14">
        <div className="flex flex-col gap-8">
          {posts.map((post) => (
            <article key={post.slug} className="bg-white rounded-3xl shadow-sm overflow-hidden border border-[#EDE6D6] hover:shadow-md transition-shadow">
              <div className="p-7 sm:p-9">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: post.tagColor }}
                  >
                    {post.tag}
                  </span>
                  <span className="text-xs text-[#6B6B6B]">{post.date}</span>
                  <span className="text-xs text-[#6B6B6B]">·</span>
                  <span className="text-xs text-[#6B6B6B]">{post.readTime}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1C1C1C] mb-3 leading-snug">
                  {post.title}
                </h2>
                <p className="text-[#6B6B6B] leading-relaxed mb-5 text-base">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-[#2D5016] font-semibold text-sm hover:gap-2.5 transition-all"
                >
                  Read More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 bg-[#2D5016] rounded-3xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Ready to switch to natural?</h2>
          <p className="text-white/70 mb-5">Try our handcrafted soaps — no parabens, no SLS, no compromise.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#C4622D] text-white font-bold px-7 py-3.5 rounded-full hover:bg-[#D4734A] transition-colors"
          >
            Shop All Soaps
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
