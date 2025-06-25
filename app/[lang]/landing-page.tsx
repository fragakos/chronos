"use client";
import HeroSection from "../../components/landing/hero-section";
import FeaturesSection from "../../components/landing/features-section";
import CTASection from "../../components/landing/cta-section";
import { type getDictionary } from "@/get-dictionary";
import { type Locale } from "@/i18n-config";

const LandingPage = ({
  dictionary,
  currentLang,
}: {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  currentLang: Locale;
}) => {
  return (
    <div className="min-h-screen">
      <HeroSection dictionary={dictionary} currentLang={currentLang} />
      <FeaturesSection dictionary={dictionary} />
      <CTASection dictionary={dictionary} currentLang={currentLang} />
    </div>
  );
};

export default LandingPage;
