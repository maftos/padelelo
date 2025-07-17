import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Play, Users } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative">
          {/* Background Image */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
              alt="Padel court ready for play"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-background/70" />
          </div>
          
          {/* Content */}
          <div className="relative z-10 py-16 sm:py-24 px-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Ready to Take Your Game{" "}
              <span className="text-primary">to the Next Level?</span>
            </h2>
            <p className="text-lg sm:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
              Join thousands of players who are already improving their skills and building lasting friendships through padel.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-base px-8 py-3">
                <Link to="/signup">
                  <Play className="w-5 h-5 mr-2" />
                  Start Your Journey
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base px-8 py-3 border-foreground/30 text-foreground hover:bg-foreground/10">
                <Link to="/friends">
                  <Users className="w-5 h-5 mr-2" />
                  Find Players
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};