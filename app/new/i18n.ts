export type Lang = "en" | "hi" | "ta" | "te" | "bn";

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हिं" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "bn", label: "বাং" },
];

interface Dict {
  kicker: string;
  headline1: string;
  headline2: string;
  ratingSuffix: string;
  badges: [string, string, string, string];
  freeShipping: string;
  buyPrefix: string;
  deliveryMetro: string; // {city} placeholder
  deliveryDefault: string; // {city} placeholder
  langLabel: string;
}

export const DICT: Record<Lang, Dict> = {
  en: {
    kicker: "Handcrafted in India · No Parabens · No SLS",
    headline1: "Better Ingredients.",
    headline2: "Better Skin.",
    ratingSuffix: "Verified Reviews",
    badges: ["Handmade in India", "No Parabens, No SLS", "Cruelty-Free", "COD Available"],
    freeShipping: "Free shipping on orders above ₹399",
    buyPrefix: "Buy",
    deliveryMetro: "Ships to {city} in 1–2 days",
    deliveryDefault: "Ships to {city} in 3–5 days",
    langLabel: "Language",
  },
  hi: {
    kicker: "भारत में हस्तनिर्मित · कोई पैराबेन नहीं · कोई SLS नहीं",
    headline1: "बेहतर सामग्री।",
    headline2: "बेहतर त्वचा।",
    ratingSuffix: "सत्यापित समीक्षाएं",
    badges: ["भारत में हस्तनिर्मित", "कोई पैराबेन नहीं, कोई SLS नहीं", "क्रूरता-मुक्त", "COD उपलब्ध"],
    freeShipping: "₹399 से ऊपर के ऑर्डर पर मुफ़्त शिपिंग",
    buyPrefix: "खरीदें",
    deliveryMetro: "{city} में 1–2 दिनों में डिलीवरी",
    deliveryDefault: "{city} में 3–5 दिनों में डिलीवरी",
    langLabel: "भाषा",
  },
  ta: {
    kicker: "இந்தியாவில் கையால் தயாரிக்கப்பட்டது · பாராபென் இல்லை · SLS இல்லை",
    headline1: "சிறந்த பொருட்கள்.",
    headline2: "சிறந்த சருமம்.",
    ratingSuffix: "சரிபார்க்கப்பட்ட மதிப்புரைகள்",
    badges: ["இந்தியாவில் கையால் தயாரிக்கப்பட்டது", "பாராபென் இல்லை, SLS இல்லை", "கொடூரமற்றது", "COD கிடைக்கிறது"],
    freeShipping: "₹399க்கு மேல் ஆர்டர்களுக்கு இலவச டெலிவரி",
    buyPrefix: "வாங்கு",
    deliveryMetro: "{city}க்கு 1–2 நாட்களில் டெலிவரி",
    deliveryDefault: "{city}க்கு 3–5 நாட்களில் டெலிவரி",
    langLabel: "மொழி",
  },
  te: {
    kicker: "భారతదేశంలో చేతితో తయారు · పారాబెన్స్ లేవు · SLS లేదు",
    headline1: "మెరుగైన పదార్థాలు.",
    headline2: "మెరుగైన చర్మం.",
    ratingSuffix: "ధృవీకరించిన సమీక్షలు",
    badges: ["భారతదేశంలో చేతితో తయారు", "పారాబెన్స్ లేవు, SLS లేదు", "క్రూరత్వం-రహిత", "COD అందుబాటులో ఉంది"],
    freeShipping: "₹399 పైన ఆర్డర్లకు ఉచిత షిప్పింగ్",
    buyPrefix: "కొనుగోలు చేయండి",
    deliveryMetro: "{city}కి 1–2 రోజుల్లో డెలివరీ",
    deliveryDefault: "{city}కి 3–5 రోజుల్లో డెలివరీ",
    langLabel: "భాష",
  },
  bn: {
    kicker: "ভারতে হস্তনির্মিত · কোনো প্যারাবেন নেই · কোনো SLS নেই",
    headline1: "উন্নত উপাদান।",
    headline2: "উন্নত ত্বক।",
    ratingSuffix: "যাচাইকৃত পর্যালোচনা",
    badges: ["ভারতে হস্তনির্মিত", "কোনো প্যারাবেন নেই, কোনো SLS নেই", "নিষ্ঠুরতামুক্ত", "COD উপলব্ধ"],
    freeShipping: "₹399 এর বেশি অর্ডারে বিনামূল্যে শিপিং",
    buyPrefix: "কিনুন",
    deliveryMetro: "{city}-এ 1–2 দিনে ডেলিভারি",
    deliveryDefault: "{city}-এ 3–5 দিনে ডেলিভারি",
    langLabel: "ভাষা",
  },
};

interface ProductCopy {
  name: string;
  kicker: string;
}

// Product-facing copy only — deliberately kept out of data/products.ts
// (a shared file used by the main site) to keep localization scoped to /new.
export const PRODUCT_COPY: Record<Lang, { charcoal: ProductCopy; haldi: ProductCopy }> = {
  en: {
    charcoal: { name: "Activated Charcoal Soap", kicker: "Deep Cleansing" },
    haldi: { name: "Saffron Haldi Chandan Soap", kicker: "Brightening" },
  },
  hi: {
    charcoal: { name: "चारकोल साबुन", kicker: "गहरी सफाई" },
    haldi: { name: "हल्दी चंदन साबुन", kicker: "निखार" },
  },
  ta: {
    charcoal: { name: "சார்கோல் சோப்", kicker: "ஆழ்ந்த சுத்தம்" },
    haldi: { name: "மஞ்சள் சந்தனம் சோப்", kicker: "பிரகாசம்" },
  },
  te: {
    charcoal: { name: "చార్కోల్ సబ్బు", kicker: "లోతైన శుభ్రత" },
    haldi: { name: "పసుపు చందనం సబ్బు", kicker: "మెరుపు" },
  },
  bn: {
    charcoal: { name: "চারকোল সাবান", kicker: "গভীর পরিষ্কার" },
    haldi: { name: "হলুদ চন্দন সাবান", kicker: "উজ্জ্বলতা" },
  },
};

const METRO_CITIES = [
  "delhi", "new delhi", "mumbai", "bangalore", "bengaluru", "hyderabad",
  "chennai", "pune", "kolkata", "ahmedabad", "gurgaon", "gurugram", "noida",
];

export function deliveryMessage(lang: Lang, city: string | null): string | null {
  if (!city) return null;
  const d = DICT[lang];
  const template = METRO_CITIES.includes(city.toLowerCase()) ? d.deliveryMetro : d.deliveryDefault;
  return template.replace("{city}", city);
}

export function parseAcceptLanguage(header: string | null): Lang {
  if (!header) return "en";
  const supported: Lang[] = ["hi", "ta", "te", "bn"];
  const first = header.split(",")[0]?.trim().toLowerCase().slice(0, 2);
  return (supported as string[]).includes(first) ? (first as Lang) : "en";
}
