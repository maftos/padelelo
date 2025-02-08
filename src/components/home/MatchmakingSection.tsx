
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChartLine } from "lucide-react";
import { Link } from "react-router-dom";

export const MatchmakingSection = () => {
  return (
    <section className="mb-16">
      <Card className="p-8 space-y-6 bg-secondary/20 backdrop-blur animate-scale-up">
        <div className="flex items-center gap-3">
          <ChartLine className="h-8 w-8 text-primary animate-pulse-subtle" />
          <h2 className="text-3xl font-bold">ELO Rating</h2>
        </div>
        <p className="text-lg text-muted-foreground">
          Our advanced ELO rating system adapts to your level, making sure you're always matched with 
          players who will help you improve.
        </p>
        <Button asChild variant="default" size="lg" className="animate-bounce-subtle">
          <Link to="/matchmaking-math">Learn More →</Link>
        </Button>
      </Card>
    </section>
  );
};
