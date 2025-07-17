
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { CommunitySection } from "@/components/home/CommunitySection";
import { ELOSection } from "@/components/home/ELOSection";
import { FAQSection } from "@/components/home/FAQSection";
import { CTASection } from "@/components/home/CTASection";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="space-y-0">
        <HeroSection />
        <FeaturesSection />
        <CommunitySection />
        <ELOSection />
        <FAQSection />
        <CTASection />
      </main>
    </div>
  );
};

export default Home;
