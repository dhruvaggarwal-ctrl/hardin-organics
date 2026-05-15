import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://hardinorganics.com', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://hardinorganics.com/shop', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://hardinorganics.com/product/activated-charcoal-soap', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://hardinorganics.com/product/saffron-haldi-chandan-soap', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://hardinorganics.com/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://hardinorganics.com/blog', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://hardinorganics.com/blog/activated-charcoal-soap-benefits', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://hardinorganics.com/blog/haldi-chandan-soap-for-glowing-skin', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://hardinorganics.com/blog/natural-soap-vs-chemical-soap', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://hardinorganics.com/skin-quiz', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://hardinorganics.com/bogo', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ]
}
