import { HeroSection } from "@/components/home/HeroSection";
import { SocialProofBar } from "@/components/home/SocialProofBar";
import { ConcernSection } from "@/components/home/ConcernSection";
import { BestsellerSection } from "@/components/home/BestsellerSection";
import { IngredientComparisonTable } from "@/components/home/IngredientComparisonTable";
import { BrandStorySection } from "@/components/home/BrandStorySection";
import { IngredientsSection } from "@/components/home/IngredientsSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { FounderSection } from "@/components/home/FounderSection";
import { InstagramSection } from "@/components/home/InstagramSection";
import { BundleSection } from "@/components/home/BundleSection";
import { SkinQuizSection } from "@/components/home/SkinQuizSection";
import { AvailableOnSection } from "@/components/home/AvailableOnSection";
import { ExitIntentPopup } from "@/components/home/ExitIntentPopup";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SocialProofBar />
      <ConcernSection />
      <BestsellerSection />
      <AvailableOnSection />
      <IngredientComparisonTable />
      <BrandStorySection />
      <IngredientsSection />
      <ReviewsSection />
      <FounderSection />
      <InstagramSection />
      <BundleSection />
      <SkinQuizSection />
      <ExitIntentPopup />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://hardinorganics.com/#organization",
                "name": "Hardin Organics",
                "url": "https://hardinorganics.com",
                "logo": "https://hardinorganics.com/images/hardin-logo.png",
                "sameAs": ["https://www.instagram.com/hardin_organics/", "https://www.instagram.com/hardin_soaps/"],
                "contactPoint": { "@type": "ContactPoint", "telephone": "+91-98719-00959", "contactType": "customer service", "availableLanguage": ["English", "Hindi"] }
              },
              {
                "@type": "WebSite",
                "@id": "https://hardinorganics.com/#website",
                "url": "https://hardinorganics.com",
                "name": "Hardin Organics",
                "potentialAction": { "@type": "SearchAction", "target": "https://hardinorganics.com/shop?q={search_term_string}", "query-input": "required name=search_term_string" }
              }
            ]
          })
        }}
      />
    </>
  );
}
