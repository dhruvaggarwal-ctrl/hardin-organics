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
import { ExitIntentPopup } from "@/components/home/ExitIntentPopup";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SocialProofBar />
      <ConcernSection />
      <BestsellerSection />
      <IngredientComparisonTable />
      <BrandStorySection />
      <IngredientsSection />
      <ReviewsSection />
      <FounderSection />
      <InstagramSection />
      <BundleSection />
      <SkinQuizSection />
      <ExitIntentPopup />
    </>
  );
}
