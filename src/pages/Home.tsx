import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Trophy, History, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container py-8 px-4 space-y-8">
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
          {/* Banner Section */}
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <img
              src="/ui-assets/home_banner.jpg"
              alt="Padel Court"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
              <div className="p-8">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                  Welcome to PadelELO Mauritius
                </h1>
                <p className="text-lg text-white/90 max-w-xl mb-6">
                  Join the fastest growing padel community in Mauritius
                </p>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link to="/register-match">Register Your First Match</Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Features Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Friends</h2>
              <p className="text-muted-foreground">
                Connect with fellow padel players, build your network, and find partners for your next match.
              </p>
              <Button asChild variant="link" className="p-0">
                <Link to="/friends">Find Friends →</Link>
              </Button>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Leaderboard</h2>
              <p className="text-muted-foreground">
                Access Mauritius's first ELO rating system for padel. Track your progress and compete with the best.
              </p>
              <Button asChild variant="link" className="p-0">
                <Link to="/leaderboard">View Rankings →</Link>
              </Button>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <History className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Match History</h2>
              <p className="text-muted-foreground">
                Review your match history, analyze your performance, and track your improvement over time.
              </p>
              <Button asChild variant="link" className="p-0">
                <Link to="/matches">View History →</Link>
              </Button>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Feedback</h2>
              <p className="text-muted-foreground">
                Help us improve the platform by sharing your suggestions and feedback with the community.
              </p>
              <Button asChild variant="link" className="p-0">
                <Link to="/future-improvements">Share Feedback →</Link>
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;