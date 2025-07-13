
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesGrid } from "@/components/home/FeaturesGrid";
import { QASection } from "@/components/home/QASection";
import { MatchmakingSection } from "@/components/home/MatchmakingSection";
import { Footer } from "@/components/home/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container py-8 px-4 space-y-8 animate-fade-in">
        <HeroSection />
        <FeaturesGrid />
        <MatchmakingSection />
        <QASection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
