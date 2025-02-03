import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <div className="relative h-[500px] rounded-xl overflow-hidden mb-12 shadow-2xl">
      <img
        src="https://skocnzoyobnoyyegfzdt.supabase.co/storage/v1/object/public/ui-assets/home_banner.jpg"
        alt="Padel Court"
        className="w-full h-full object-cover brightness-50"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-transparent flex items-center">
        <div className="p-8 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight">
            Elevate Your <span className="text-primary">Padel Game</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 mb-8">
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
  );
};