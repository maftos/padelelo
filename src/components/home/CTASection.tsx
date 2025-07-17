import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Play, Users } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Ready to Join the{" "}
          <span className="text-primary">Community?</span>
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Start tracking your progress and connecting with players today.
        </p>
        
        <Button asChild size="lg" className="text-base px-8 py-3">
          <Link to="/signup">
            Sign Up Now
          </Link>
        </Button>
      </div>
    </section>
  );
};