import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { TrendingUp, Target, BarChart3 } from "lucide-react";

export const ELOSection = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="ELO rating system visualization"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* ELO Progress Card */}
            <Card className="absolute -bottom-6 -right-6 p-6 bg-card border-border shadow-xl max-w-xs">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-foreground/70">Your ELO</div>
                    <div className="text-xl font-bold text-foreground">1,247</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/70">Progress to next level</span>
                    <span className="text-primary font-medium">73%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '73%' }} />
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Content */}
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Smart{" "}
              <span className="text-primary">ELO Rating</span>{" "}
              System
            </h2>
            <p className="text-lg text-foreground/70 mb-8">
              Our advanced ELO rating system adapts to your skill level, ensuring fair and competitive matches. Track your progress and see how you stack up against the community.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Fair Matchmaking</h3>
                  <p className="text-foreground/70">Get matched with players at your skill level for the most enjoyable games</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Track Progress</h3>
                  <p className="text-foreground/70">Watch your rating improve as you develop your skills and win more matches</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Detailed Analytics</h3>
                  <p className="text-foreground/70">Get insights into your performance with comprehensive match statistics</p>
                </div>
              </div>
            </div>
            
            <Button asChild size="lg" variant="outline" className="text-base px-8 border-primary/30 text-primary hover:bg-primary/10">
              <Link to="/matchmaking-math">
                Learn How It Works
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};