
import { MatchForm } from "@/components/MatchForm";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

const ManageMatches = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Navigation />
      <main className="container py-6 md:py-12 px-4 max-w-7xl mx-auto">
        <div className="space-y-6 md:space-y-8 animate-fade-in">
          {/* Header */}
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent leading-tight">
                My Matches
              </h1>
              <p className="text-muted-foreground text-lg">Manage your pending matches and create new ones</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Match Management</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl p-6">
            <MatchForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageMatches;
