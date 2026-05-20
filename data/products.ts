export interface ProductSize {
  label: string;
  price: number;
  originalPrice?: number;
  badge?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  badge: string | null;
  skinTypes: string[];
  concerns: string[];
  ingredients: string[];
  sizes: ProductSize[];
  images: string[];
  description: string;
  longDescription: string;
  howToUse: string[];
  inStock: boolean;
  stockCount: number;
  flipkartUrl?: string;
  amazonUrl?: string;
}

export const products: Product[] = [
  {
    id: "charcoal-soap",
    slug: "activated-charcoal-soap",
    name: "Activated Charcoal Soap",
    tagline: "Deep Cleansing • Anti-Acne • Pore Minimizing",
    price: 149,
    originalPrice: 199,
    rating: 4.8,
    reviewCount: 847,
    badge: "BESTSELLER",
    skinTypes: ["Oily", "Combination", "Acne-Prone"],
    concerns: ["Acne & Breakouts", "Blackheads & Pores", "Excess Oil"],
    ingredients: ["Activated Charcoal", "Shea Butter", "Tea Tree Oil", "Coconut Oil"],
    sizes: [
      { label: "Pack of 1", price: 149, originalPrice: 199 },
      { label: "Pack of 3", price: 399, originalPrice: 597, badge: "Most Popular" },
      { label: "Pack of 6", price: 749, originalPrice: 1194 },
      { label: "Pack of 9", price: 1049, originalPrice: 1791 },
      { label: "Pack of 12", price: 1299, originalPrice: 2388 },
    ],
    images: [
      "/images/charcoal-1.png",
      "/images/charcoal-2.png",
      "/images/charcoal-3.png",
      "/images/charcoal-4.png",
    ],
    description:
      "Our Activated Charcoal Soap acts like a magnet for your skin — drawing out toxins, excess oil, and impurities deep within your pores. Handcrafted in small batches with pure activated charcoal and skin-loving shea butter.",
    longDescription:
      "Activated Charcoal has been used for centuries as a powerful detoxifier. When applied to the skin, its porous structure acts like a magnet — attracting and absorbing toxins, bacteria, dirt, oil, and other micro-particles that sit on the surface or deep within your pores. Unlike regular soaps that just cleanse the surface, our charcoal soap goes deep. Combined with Tea Tree Oil's natural antibacterial properties and Shea Butter's moisturizing richness, this soap cleanses deeply without stripping your skin dry. Handcrafted in small batches to ensure quality, every bar is a labor of love.",
    howToUse: [
      "Wet your face or body with lukewarm water",
      "Lather the soap between your palms or directly on skin",
      "Gently massage in circular motions for 30-60 seconds",
      "Rinse thoroughly with cool water",
      "Pat dry and follow with a moisturizer",
      "Use 1-2 times daily for best results",
    ],
    inStock: true,
    stockCount: 23,
    flipkartUrl: "https://www.flipkart.com/search?q=hardin+organics+charcoal+soap",
  },
  {
    id: "saffron-haldi-chandan",
    slug: "saffron-haldi-chandan-soap",
    name: "Saffron Haldi Chandan Soap",
    tagline: "Brightening • Anti-Aging • Glow Boosting",
    price: 149,
    originalPrice: 199,
    rating: 4.9,
    reviewCount: 612,
    badge: null,
    skinTypes: ["All Skin Types", "Dry", "Normal", "Mature"],
    concerns: ["Dull Skin", "Pigmentation", "Anti-Aging", "Uneven Tone"],
    ingredients: ["Saffron", "Turmeric (Haldi)", "Sandalwood (Chandan)", "Rose Water"],
    sizes: [
      { label: "Pack of 1", price: 149, originalPrice: 199 },
      { label: "Pack of 3", price: 399, originalPrice: 597, badge: "Most Popular" },
      { label: "Pack of 6", price: 749, originalPrice: 1194 },
      { label: "Pack of 9", price: 1049, originalPrice: 1791 },
      { label: "Pack of 12", price: 1299, originalPrice: 2388 },
    ],
    images: [
      "/images/haldi-1.png",
      "/images/haldi-2.png",
      "/images/haldi-4.png",
      "/images/haldi-5.png",
    ],
    description:
      "An ancient Ayurvedic recipe reimagined for modern skin. The golden trio of Saffron, Haldi, and Chandan brightens dull skin, fades dark spots, and leaves you with a natural, healthy glow.",
    longDescription:
      "For thousands of years, Indian women have used Saffron, Haldi, and Chandan as the holy trinity of skincare. Saffron (Kesar) brightens the complexion and reduces dark spots. Turmeric (Haldi) fights inflammation, bacteria, and hyperpigmentation with its curcumin content. Sandalwood (Chandan) soothes, cools, and adds a natural glow while its woody fragrance elevates your bathing ritual. Together, combined with Rose Water and nourishing base oils, this soap is your daily skin brightening ritual. Safe for all skin types, it is gentle enough for sensitive skin yet effective enough to show visible results in 4-6 weeks of regular use.",
    howToUse: [
      "Wet your face with lukewarm water",
      "Create a rich lather and apply gently",
      "Leave on for 60 seconds for maximum benefit",
      "Rinse with cool water to close pores",
      "Use daily morning and night for best results",
      "Follow with a light moisturizer or face oil",
    ],
    inStock: true,
    stockCount: 15,
    flipkartUrl: "https://www.flipkart.com/search?q=hardin+organics+haldi+chandan+soap",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
