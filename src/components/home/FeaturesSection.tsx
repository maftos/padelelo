import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Users, Trophy, Calendar, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Connect with Players",
    description: "Find and connect with padel players at your skill level",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    link: "/friends"
  },
  {
    icon: Trophy,
    title: "Track Your Ranking",
    description: "See where you stand with our advanced ELO rating system",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    link: "/leaderboard"
  },
  {
    icon: Calendar,
    title: "Book Matches",
    description: "Schedule games at your favorite courts easily",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    link: "/matches"
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Analyze your game with detailed match statistics",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    link: "/matches"
  }
];

export const FeaturesSection = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Excel
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            PadelELO provides all the tools you need to improve your game and connect with the community
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group overflow-hidden border-border bg-card hover:bg-card/80 transition-all duration-300">
              <Link to={feature.link}>
                <div className="aspect-[16/9] relative overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-background/20" />
                  <div className="absolute top-4 left-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-foreground/70 mb-4">
                    {feature.description}
                  </p>
                  <Button variant="ghost" className="text-primary hover:text-primary/80 p-0 h-auto">
                    Learn more →
                  </Button>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};