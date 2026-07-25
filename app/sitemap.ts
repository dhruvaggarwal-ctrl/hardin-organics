import { MetadataRoute } from 'next'

// lastModified values are the last real content-change dates for each page
// (not request time — a fake "always today" date isn't a real freshness signal).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://hardinorganics.com', lastModified: '2026-05-20', changeFrequency: 'weekly', priority: 1 },
    { url: 'https://hardinorganics.com/shop', lastModified: '2026-05-19', changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://hardinorganics.com/product/activated-charcoal-soap', lastModified: '2026-05-20', changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://hardinorganics.com/product/saffron-haldi-chandan-soap', lastModified: '2026-05-20', changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://hardinorganics.com/about', lastModified: '2026-05-15', changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://hardinorganics.com/blog', lastModified: '2026-05-15', changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://hardinorganics.com/blog/activated-charcoal-soap-benefits', lastModified: '2025-04-28', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://hardinorganics.com/blog/haldi-chandan-soap-for-glowing-skin', lastModified: '2025-04-14', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://hardinorganics.com/blog/natural-soap-vs-chemical-soap', lastModified: '2025-03-31', changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://hardinorganics.com/skin-quiz', lastModified: '2026-05-15', changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://hardinorganics.com/bogo', lastModified: '2026-05-27', changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://hardinorganics.com/lp/acne', lastModified: '2026-05-21', changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://hardinorganics.com/lp/glow', lastModified: '2026-05-21', changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://hardinorganics.com/lp/combo', lastModified: '2026-05-21', changeFrequency: 'weekly', priority: 0.7 },
  ]
}
