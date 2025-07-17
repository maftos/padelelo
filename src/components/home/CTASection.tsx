import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Play, Users } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
          Ready to Join the{" "}
          <span className="text-primary">Community?</span>
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 px-4">
          Start tracking your progress and connecting with players today.
        </p>
        
        <Button asChild size="lg" className="text-base px-6 sm:px-8 py-3 w-full sm:w-auto max-w-xs mx-auto">
          <Link to="/signup">
            Sign Up Now
          </Link>
        </Button>
      </div>
    </section>
  );
};