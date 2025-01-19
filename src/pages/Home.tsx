import { Navigation } from "@/components/Navigation";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container py-8 px-4 space-y-8">
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
          {/* Banner Section */}
          <div className="relative h-[300px] rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1632831795809-4666f02c8b63?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
              alt="Padel Court"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
              <div className="p-8">
                <h1 className="text-4xl font-bold tracking-tight text-white mb-4">
                  Welcome to MatchPadel Mauritius
                </h1>
                <p className="text-lg text-white/90 max-w-xl">
                  Join the fastest growing padel community in Mauritius
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <section className="space-y-4 p-6 rounded-lg bg-accent text-accent-foreground">
              <h2 className="text-2xl font-semibold text-primary">Smart Matchmaking</h2>
              <p className="text-muted-foreground">
                Our advanced MMR system ensures fair and competitive matches, 
                connecting you with players of similar skill levels.
              </p>
            </section>

            <section className="space-y-4 p-6 rounded-lg bg-accent text-accent-foreground">
              <h2 className="text-2xl font-semibold text-primary">Community Growth</h2>
              <p className="text-muted-foreground">
                Connect with fellow padel enthusiasts, track your progress, 
                and be part of Mauritius's thriving padel ecosystem.
              </p>
            </section>

            <section className="space-y-4 p-6 rounded-lg bg-accent text-accent-foreground">
              <h2 className="text-2xl font-semibold text-primary">Fair Rankings</h2>
              <p className="text-muted-foreground">
                Climb the leaderboard through our transparent ranking system, 
                designed to reflect your true skill level.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;