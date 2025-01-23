import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Trophy, History } from "lucide-react";
import { Link } from "react-router-dom";

export const FeaturesGrid = () => {
  return (
    <div className="grid gap-6 md:grid-cols-3 mb-16">
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
    </div>
  );
};