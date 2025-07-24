import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Users, MessageCircle, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const CommunitySection = () => {
  const { user } = useAuth();
  
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 sm:mb-6">
              Join Our Thriving{" "}
              <span className="text-primary">Padel Community</span>
            </h2>
            <p className="text-base sm:text-lg text-foreground/70 mb-6 sm:mb-8">
              Connect with passionate players, improve your skills, and be part of Mauritius's fastest-growing padel community. From beginners to pros, everyone has a place here.
            </p>
            
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Find Your Tribe</h3>
                  <p className="text-foreground/70">Connect with players at your skill level</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Share & Learn</h3>
                  <p className="text-foreground/70">Exchange tips and strategies with the community</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Regular Events</h3>
                  <p className="text-foreground/70">Participate in tournaments and social matches</p>
                </div>
              </div>
            </div>
            
            <Button asChild size="lg" className="text-base px-6 sm:px-8 w-full sm:w-auto">
              <Link to={user ? "/manage-bookings" : "/signup"}>
                Join Community
              </Link>
            </Button>
          </div>
          
          {/* Image */}
          <div className="relative order-1 lg:order-2">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Padel community playing together"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating Cards */}
            <Card className="absolute bottom-4 left-4 sm:-bottom-4 sm:-left-4 p-4 bg-card border-border shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-lg font-bold text-foreground">500+</div>
                  <div className="text-sm text-foreground/70">Active Members</div>
                </div>
              </div>
            </Card>
            
            <Card className="absolute top-4 right-4 sm:-top-4 sm:-right-4 p-4 bg-card border-border shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-lg font-bold text-foreground">50+</div>
                  <div className="text-sm text-foreground/70">Weekly Matches</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};