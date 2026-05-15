export interface Review {
  id: string;
  name: string;
  city: string;
  rating: number;
  date: string;
  title: string;
  text: string;
  product: string;
  productSlug: string;
  verified: boolean;
  hasPhoto: boolean;
  photo?: string;
}

export const reviews: Review[] = [
  {
    id: "r1",
    name: "Priya Sharma",
    city: "Delhi",
    rating: 5,
    date: "March 15, 2024",
    title: "My skin has never felt this clean!",
    text: "I've been using the charcoal soap for 3 weeks and honestly meri skin ka texture completely badal gaya hai. The blackheads on my nose are almost gone. Highly recommend to anyone with oily skin!",
    product: "Activated Charcoal Soap",
    productSlug: "activated-charcoal-soap",
    verified: true,
    hasPhoto: true,
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
  },
  {
    id: "r2",
    name: "Kavya Reddy",
    city: "Bangalore",
    rating: 5,
    date: "February 28, 2024",
    title: "The glow is REAL",
    text: "Ordered the Saffron Haldi Chandan soap on a whim and oh my god — my skin literally glows now. Colleagues keep asking what I'm doing differently. No filter needed on my videos anymore lol 😂 Will definitely reorder!",
    product: "Saffron Haldi Chandan Soap",
    productSlug: "saffron-haldi-chandan-soap",
    verified: true,
    hasPhoto: false,
  },
  {
    id: "r3",
    name: "Anjali Singh",
    city: "Mumbai",
    rating: 5,
    date: "March 2, 2024",
    title: "Best decision I made for my skin",
    text: "Tried the combo pack and honestly it's the best value. The charcoal one in morning, saffron one at night — my skin has never been this happy. Breakouts are down by 80% in just 4 weeks. Thank you Hardin Organics!",
    product: "Combo Pack",
    productSlug: "combo-pack",
    verified: true,
    hasPhoto: true,
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
  },
  {
    id: "r4",
    name: "Sneha Patel",
    city: "Ahmedabad",
    rating: 4,
    date: "March 8, 2024",
    title: "Good product, takes time to show results",
    text: "I was skeptical at first honestly. But after 2 weeks of consistent use, I can see my skin is less oily and the dark spots are fading. Packaging is beautiful and the soap smells amazing — very natural fragrance. Good quality product!",
    product: "Activated Charcoal Soap",
    productSlug: "activated-charcoal-soap",
    verified: true,
    hasPhoto: false,
  },
  {
    id: "r5",
    name: "Meera Krishnan",
    city: "Chennai",
    rating: 5,
    date: "January 20, 2024",
    title: "Replaced my entire skincare routine!",
    text: "I used to spend 3000+ on skincare every month. Switched to Hardin Organics saffron soap and honestly my skin is better than ever. Sabse zyaada acha ye hai ki ingredients sab natural hain. Even my dermatologist was impressed!",
    product: "Saffron Haldi Chandan Soap",
    productSlug: "saffron-haldi-chandan-soap",
    verified: true,
    hasPhoto: false,
  },
  {
    id: "r6",
    name: "Ritu Agarwal",
    city: "Jaipur",
    rating: 5,
    date: "February 10, 2024",
    title: "Gifted this to my whole family!",
    text: "Ordered 5 combo packs to gift to my sisters, mom and friends. Everyone loved it! The packaging is so premium — looks like a luxury product but at such an affordable price. Will definitely order again. 10/10 would recommend!",
    product: "Combo Pack",
    productSlug: "combo-pack",
    verified: true,
    hasPhoto: true,
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
  },
  {
    id: "r7",
    name: "Deepa Nair",
    city: "Kochi",
    rating: 5,
    date: "March 18, 2024",
    title: "Sensitive skin ka best friend!",
    text: "I have very sensitive skin and most soaps give me rashes. But this saffron soap is so gentle! No irritation at all, and my skin feels moisturized after washing — which never happens with other soaps. Thank you for making something that actually works for sensitive skin.",
    product: "Saffron Haldi Chandan Soap",
    productSlug: "saffron-haldi-chandan-soap",
    verified: true,
    hasPhoto: false,
  },
  {
    id: "r8",
    name: "Pooja Mishra",
    city: "Lucknow",
    rating: 4,
    date: "February 5, 2024",
    title: "Amazing for acne-prone skin",
    text: "Been struggling with hormonal acne for years. The charcoal soap has really helped control breakouts. I still get some but they're much smaller and heal faster. Delivery was also super fast — got it in 2 days! Will continue using.",
    product: "Activated Charcoal Soap",
    productSlug: "activated-charcoal-soap",
    verified: true,
    hasPhoto: false,
  },
  {
    id: "r9",
    name: "Simran Kaur",
    city: "Chandigarh",
    rating: 5,
    date: "January 12, 2024",
    title: "Finally found something that works!",
    text: "Tried so many products before this. Chemical se bhari soaps, expensive face washes — nothing worked. This charcoal soap cleared my skin in 3 weeks. Simple ingredients, no fancy chemicals, and it works better than everything I've tried. Hooked for life!",
    product: "Activated Charcoal Soap",
    productSlug: "activated-charcoal-soap",
    verified: true,
    hasPhoto: true,
    photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80",
  },
  {
    id: "r10",
    name: "Vidya Rao",
    city: "Hyderabad",
    rating: 5,
    date: "March 22, 2024",
    title: "Traditional ingredients, modern results",
    text: "Haldi and chandan — my dadi used to make face packs with these. Hardin Organics put them in a soap and it works magically. My pigmentation from sun damage is visibly lighter. The brand really understands Indian skin. So proud to support an Indian brand!",
    product: "Saffron Haldi Chandan Soap",
    productSlug: "saffron-haldi-chandan-soap",
    verified: true,
    hasPhoto: false,
  },
  {
    id: "r11",
    name: "Nidhi Gupta",
    city: "Pune",
    rating: 5,
    date: "February 18, 2024",
    title: "Value for money is unmatched",
    text: "At ₹399 for two soaps with FREE shipping, this is an absolute steal. Each bar lasts me about 6 weeks easily. Compared to the ₹600+ I was spending on chemical-laden products from big brands, this is way better — both for my skin and my wallet!",
    product: "Combo Pack",
    productSlug: "combo-pack",
    verified: true,
    hasPhoto: false,
  },
  {
    id: "r12",
    name: "Tanya Verma",
    city: "Noida",
    rating: 5,
    date: "March 1, 2024",
    title: "My morning routine is now a ritual",
    text: "Something about the smell and lather of this charcoal soap makes my morning shower feel like a spa experience. It's hard to explain but washing my face with this just feels luxurious. And my skin shows it — clear, glowing, and fresh all day. Totally obsessed!",
    product: "Activated Charcoal Soap",
    productSlug: "activated-charcoal-soap",
    verified: true,
    hasPhoto: false,
  },
];

export function getReviewsByProduct(slug: string): Review[] {
  return reviews.filter((r) => r.productSlug === slug);
}

export function getAverageRating(slug: string): number {
  const productReviews = getReviewsByProduct(slug);
  if (productReviews.length === 0) return 0;
  return productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
}
