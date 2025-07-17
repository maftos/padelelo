
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Play, Users, TrendingUp } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/lovable-uploads/ace216a4-b3e4-429e-8b4a-cf1184626be1.png"
          alt="Padel courts at sports facility"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Elevate Your{" "}
            <span className="text-primary">Padel Game</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Join Mauritius's premier padel community. Track your progress, connect with players, and compete at your level.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
            <Button asChild size="lg" className="text-base px-6 sm:px-8 py-3 w-full sm:w-auto">
              <Link to="/signup">
                Start Playing
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base px-6 sm:px-8 py-3 border-white/40 text-white hover:bg-white/20 hover:border-white/60 w-full sm:w-auto">
              <Link to="/leaderboard">
                View Rankings
              </Link>
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-sm sm:max-w-md mx-auto px-4">
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">500+</div>
              <div className="text-xs sm:text-sm text-gray-300">Active Players</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">2,000+</div>
              <div className="text-xs sm:text-sm text-gray-300">Matches Played</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">15+</div>
              <div className="text-xs sm:text-sm text-gray-300">Courts</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
