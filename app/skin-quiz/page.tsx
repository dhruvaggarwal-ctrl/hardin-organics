import type { Metadata } from "next";
import { SkinQuizSection } from "@/components/home/SkinQuizSection";

export const metadata: Metadata = {
  title: "Skin Quiz — Find Your Perfect Soap",
  description:
    "Answer 3 quick questions and get a personalized organic soap recommendation for your skin type and concerns. Free, instant, no email required.",
};

// This page auto-opens the quiz modal immediately
export default function SkinQuizPage() {
  return (
    <div className="min-h-screen">
      <SkinQuizSection autoOpen={true} />
    </div>
  );
}
