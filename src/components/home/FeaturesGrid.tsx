import { Users, Trophy, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

export const FeaturesGrid = () => {
  return (
    <div className="grid gap-6 md:grid-cols-3 mb-16">
      <Card className="p-6 space-y-4 hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur border-accent">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Users className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold">Friends</h2>
        <p className="text-muted-foreground">
          Connect with other players, build your network, and find partners for matches.
        </p>
        <Button asChild variant="outline">
          <Link to="/friends">View Friends</Link>
        </Button>
      </Card>

      <Card className="p-6 space-y-4 hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur border-accent">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Trophy className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold">Leaderboard</h2>
        <p className="text-muted-foreground">
          Track your progress and see how you rank against other players in the community.
        </p>
        <Button asChild variant="outline">
          <Link to="/leaderboard">View Rankings</Link>
        </Button>
      </Card>

      <Card className="p-6 space-y-4 hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur border-accent">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <History className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold">Match History</h2>
        <p className="text-muted-foreground">
          Review your past matches, analyze your performance, and track your improvement.
        </p>
        <Button asChild variant="outline">
          <Link to="/matches">View Matches</Link>
        </Button>
      </Card>
    </div>
  );
};