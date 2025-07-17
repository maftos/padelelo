
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductShowcaseSection } from "@/components/home/ProductShowcaseSection";
import { CommunitySection } from "@/components/home/CommunitySection";
import { ELOSection } from "@/components/home/ELOSection";
import { FAQSection } from "@/components/home/FAQSection";
import { CTASection } from "@/components/home/CTASection";
import { Footer } from "@/components/home/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="space-y-0">
        <HeroSection />
        <ProductShowcaseSection />
        <CommunitySection />
        <ELOSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
