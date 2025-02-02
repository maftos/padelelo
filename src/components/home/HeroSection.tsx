import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";

export const HeroSection = () => {
  return (
    <div className="relative h-screen rounded-xl overflow-hidden mb-12 shadow-2xl animate-fade-in">
      <img
        src="https://skocnzoyobnoyyegfzdt.supabase.co/storage/v1/object/public/ui-assets/home_banner.jpg"
        alt="Padel Court"
        className="absolute inset-0 w-full h-full object-cover brightness-50 z-0"
      />
      <div className="absolute inset-0 z-10">
        <HeroGeometric 
          badge="PadelELO Mauritius"
          title1="Elevate Your"
          title2="Padel Game"
        />
      </div>
      <div className="absolute bottom-12 left-0 right-0 z-20 flex justify-center gap-4">
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 animate-bounce-subtle">
          <Link to="/register-match">Start Playing</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="border-foreground/20 text-foreground hover:bg-foreground/10">
          <Link to="/leaderboard">View Rankings</Link>
        </Button>
      </div>
    </div>
  );
};