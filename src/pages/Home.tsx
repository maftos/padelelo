import { Navigation } from "@/components/Navigation";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container py-8 px-4 space-y-8">
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight text-center">
            Welcome to MatchPadel Mauritius
          </h1>
          
          <div className="space-y-6">
            <section className="space-y-2">
              <h2 className="text-2xl font-semibold">Solving Padel Matchmaking</h2>
              <p className="text-muted-foreground">
                We're revolutionizing how padel players in Mauritius connect and play together. 
                Find partners, arrange matches, and grow the padel community.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-2xl font-semibold">Healthy Ecosystem</h2>
              <p className="text-muted-foreground">
                We're building a vibrant, healthy ecosystem for padel enthusiasts. 
                Connect with players, track your progress, and be part of the growing padel community in Mauritius.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-2xl font-semibold">Fair Rankings</h2>
              <p className="text-muted-foreground">
                Our MMR system ensures fair matchmaking. Play with confidence against new opponents, 
                knowing you'll have competitive and enjoyable matches across Mauritius.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;