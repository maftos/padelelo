
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesGrid } from "@/components/home/FeaturesGrid";
import { QASection } from "@/components/home/QASection";
import { MatchmakingSection } from "@/components/home/MatchmakingSection";
import { Footer } from "@/components/home/Footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { getOrganizationSchema, getWebSiteSchema } from "@/utils/structuredData";

const Home = () => {
  const structuredData = [
    getOrganizationSchema(),
    getWebSiteSchema()
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="PadelELO - Mauritius Padel Rankings & Match Tracking"
        description="Join the premier padel community in Mauritius. Track matches, climb rankings, find tournaments, and connect with players. Advanced MMR system for fair matchmaking."
        canonicalUrl="/"
        structuredData={structuredData}
        keywords="padel mauritius, padel rankings, match tracking, MMR system, padel tournaments, padel courts, mauritius sports"
      />
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
