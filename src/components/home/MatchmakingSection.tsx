import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChartLine } from "lucide-react";
import { Link } from "react-router-dom";

export const MatchmakingSection = () => {
  return (
    <section className="mb-16">
      <Card className="p-8 space-y-6 bg-secondary/20 backdrop-blur">
        <div className="flex items-center gap-3">
          <ChartLine className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">Smart Matchmaking</h2>
        </div>
        <p className="text-lg text-muted-foreground">
          Our advanced ELO rating system ensures fair and competitive matches by analyzing player performance 
          and skill levels. The system adapts to your gameplay, making sure you're always matched with 
          players who will help you improve.
        </p>
        <Button asChild variant="default" size="lg">
          <Link to="/matchmaking-math">Learn More About Our Rating System →</Link>
        </Button>
      </Card>
    </section>
  );
};