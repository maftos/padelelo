import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Trophy, History, MessageSquare, Calculator, Rocket, ClipboardList, Github } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <main className="container py-8 px-4 space-y-32">
        <div className="max-w-7xl mx-auto animate-fade-in">
          <div className="relative h-[500px] rounded-xl overflow-hidden mb-16 shadow-2xl">
            <img
              src="https://skocnzoyobnoyyegfzdt.supabase.co/storage/v1/object/public/ui-assets/home_banner.jpg"
              alt="Padel Court"
              className="w-full h-full object-cover brightness-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-transparent flex items-center">
              <div className="p-8 max-w-2xl">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight">
                  Elevate Your <span className="text-primary">Padel Game</span>
                </h1>
                <p className="text-xl text-foreground/80 mb-8">
                  Join Mauritius's premier padel community. Track your progress, connect with players, and compete at your level.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                    <Link to="/register-match">Start Playing</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-foreground/20 text-foreground hover:bg-foreground/10">
                    <Link to="/leaderboard">View Rankings</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-24">
            <Card className="p-6 space-y-4 hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur border-accent hover:scale-105">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Friends</h2>
              <p className="text-muted-foreground">
                Connect with fellow padel players, build your network, and find partners for your next match.
              </p>
              <Button asChild variant="link" className="p-0 text-primary">
                <Link to="/friends">Find Friends →</Link>
              </Button>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur border-accent hover:scale-105">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Leaderboard</h2>
              <p className="text-muted-foreground">
                Access Mauritius's first ELO rating system for padel. Track your progress and compete with the best.
              </p>
              <Button asChild variant="link" className="p-0 text-primary">
                <Link to="/leaderboard">View Rankings →</Link>
              </Button>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur border-accent hover:scale-105">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <History className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Match History</h2>
              <p className="text-muted-foreground">
                Review your match history, analyze your performance, and track your improvement over time.
              </p>
              <Button asChild variant="link" className="p-0 text-primary">
                <Link to="/matches">View History →</Link>
              </Button>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur border-accent hover:scale-105">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Community</h2>
              <p className="text-muted-foreground">
                Join a thriving community of padel enthusiasts. Share tips, organize matches, and grow together.
              </p>
              <Button asChild variant="link" className="p-0 text-primary">
                <Link to="/friends">Join Now →</Link>
              </Button>
            </Card>
          </div>

          {/* Matchmaking Math Section */}
          <section className="mb-32 relative">
            <div className="absolute inset-0 bg-secondary/20 rounded-2xl backdrop-blur-sm -z-10" />
            <div className="p-12 space-y-8">
              <div className="flex items-center gap-3 mb-8">
                <Calculator className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold">Matchmaking Mathematics</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-8 bg-card/80 backdrop-blur border-accent">
                  <h3 className="text-xl font-semibold mb-4">ELO Rating System</h3>
                  <p className="text-muted-foreground mb-6">
                    Our matchmaking system is based on the ELO rating system, originally developed for chess. 
                    The system calculates expected win rates and adjusts ratings after each match based on the outcome 
                    and the relative skill difference between teams.
                  </p>
                  <pre className="bg-background/50 p-4 rounded-md text-sm overflow-x-auto text-foreground/90">
                    E = 1 / (1 + 10^((R2 - R1)/400))
                  </pre>
                </Card>
                <Card className="p-8 bg-card/80 backdrop-blur border-accent">
                  <h3 className="text-xl font-semibold mb-4">MMR Adjustment</h3>
                  <p className="text-muted-foreground mb-6">
                    After each match, ratings are adjusted using a sophisticated algorithm that takes into account
                    the skill difference between teams and the match outcome.
                  </p>
                  <pre className="bg-background/50 p-4 rounded-md text-sm overflow-x-auto text-foreground/90">
                    New Rating = Old Rating + K * (Actual - Expected)
                  </pre>
                </Card>
              </div>
            </div>
          </section>

          {/* Future Improvements Section */}
          <section className="mb-32 relative">
            <div className="absolute inset-0 bg-accent/50 rounded-2xl backdrop-blur-sm -z-10" />
            <div className="p-12 space-y-8">
              <div className="flex items-center gap-3 mb-8">
                <Rocket className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold">Coming Soon</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="p-6 bg-card/50 backdrop-blur border-accent">
                  <h3 className="text-lg font-semibold mb-2">Advanced Match Statistics</h3>
                  <p className="text-muted-foreground">Detailed analytics and visualization of match history and performance metrics.</p>
                  <p className="text-sm text-primary mt-4">Expected: Q2 2024</p>
                </Card>

                <Card className="p-6 bg-card/50 backdrop-blur border-accent">
                  <h3 className="text-lg font-semibold mb-2">Tournament System</h3>
                  <p className="text-muted-foreground">Organize and participate in tournaments with automatic bracket generation.</p>
                  <p className="text-sm text-primary mt-4">Expected: Q3 2024</p>
                </Card>

                <Card className="p-6 bg-card/50 backdrop-blur border-accent">
                  <h3 className="text-lg font-semibold mb-2">Mobile App</h3>
                  <p className="text-muted-foreground">Native mobile application for iOS and Android.</p>
                  <p className="text-sm text-primary mt-4">Expected: Q4 2024</p>
                </Card>
              </div>
            </div>
          </section>

          {/* Release Notes Section */}
          <section className="mb-32 relative">
            <div className="absolute inset-0 bg-secondary/20 rounded-2xl backdrop-blur-sm -z-10" />
            <div className="p-12">
              <div className="flex items-center gap-3 mb-8">
                <ClipboardList className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold">Latest Updates</h2>
              </div>
              <Card className="p-8 bg-card/50 backdrop-blur border-accent">
                <h3 className="text-xl font-semibold mb-4">Version 1.0.0 - Initial Release</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Launched PadelELO platform</li>
                  <li>Implemented basic matchmaking system</li>
                  <li>Added friend system</li>
                  <li>Introduced MMR calculations</li>
                </ul>
              </Card>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-accent mt-24 bg-card/50 backdrop-blur-sm">
        <div className="container py-12 px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">About</h3>
              <p className="text-muted-foreground">
                PadelELO is Mauritius's premier platform for competitive padel players.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/leaderboard" className="text-muted-foreground hover:text-primary transition-colors">
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link to="/register-match" className="text-muted-foreground hover:text-primary transition-colors">
                    Register Match
                  </Link>
                </li>
                <li>
                  <Link to="/friends" className="text-muted-foreground hover:text-primary transition-colors">
                    Find Friends
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/matchmaking-math" className="text-muted-foreground hover:text-primary transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link to="/future-improvements" className="text-muted-foreground hover:text-primary transition-colors">
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Connect</h3>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Github className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-accent mt-8 pt-8 text-center text-muted-foreground">
            <p>© 2024 PadelELO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;