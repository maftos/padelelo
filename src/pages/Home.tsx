
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
        <div className="p-4 bg-secondary/20 rounded-lg text-center">
          <p className="text-lg">
            PadelELO is currently invite-only. To join, please contact an existing member from our{" "}
            <a href="/leaderboard" className="text-primary hover:underline">leaderboard</a>.
          </p>
        </div>
        <FeaturesGrid />
        <MatchmakingSection />
        <QASection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
