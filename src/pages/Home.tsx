import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesGrid } from "@/components/home/FeaturesGrid";
import { QASection } from "@/components/home/QASection";
import { MatchmakingSection } from "@/components/home/MatchmakingSection";
import { ReleaseNotesSection } from "@/components/home/ReleaseNotesSection";
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
        <ReleaseNotesSection />
        <section className="mb-16 relative">
          <div className="absolute inset-0 bg-accent/50 rounded-2xl backdrop-blur-sm -z-10" />
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-8">Coming Soon</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg bg-card/50 backdrop-blur border-accent">
                <h3 className="text-xl font-semibold mb-4">Advanced Statistics</h3>
                <p className="text-muted-foreground">Detailed analytics and visualization of match history and performance metrics.</p>
              </div>
              <div className="p-6 rounded-lg bg-card/50 backdrop-blur border-accent">
                <h3 className="text-xl font-semibold mb-4">Tournament System</h3>
                <p className="text-muted-foreground">Organize and participate in tournaments with automatic bracket generation.</p>
              </div>
              <div className="p-6 rounded-lg bg-card/50 backdrop-blur border-accent">
                <h3 className="text-xl font-semibold mb-4">Mobile App</h3>
                <p className="text-muted-foreground">Native mobile application for iOS and Android platforms.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;