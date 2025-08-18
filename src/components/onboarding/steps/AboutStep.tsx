
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardEdit, TrendingUp, History, Info, ChevronLeft } from "lucide-react";
import openGamesImage from "@/assets/onboarding-open-games.jpg";
import leaderboardImage from "@/assets/onboarding-leaderboard.jpg";
import tournamentsImage from "@/assets/onboarding-tournaments.jpg";

export const AboutStep = () => {
  const navigate = useNavigate();

  return (
    <OnboardingLayout currentStep={5} totalSteps={6}>
      <div className="flex flex-col min-h-[calc(100vh-200px)] pb-20 sm:pb-0">
        <div className="flex items-center justify-center relative mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/onboarding/step-4")}
            className="absolute left-0 hover:bg-accent/50"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to PadelELO</h1>
        </div>

        <div className="flex-1">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div 
                  className="relative flex items-center gap-4 p-6 rounded-lg border overflow-hidden bg-cover bg-center"
                  style={{ backgroundImage: `url(${openGamesImage})` }}
                >
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
                  <div className="relative z-10 h-10 w-10 rounded-full bg-primary/20 backdrop-blur flex items-center justify-center">
                    <ClipboardEdit className="h-5 w-5 text-primary" />
                  </div>
                  <div className="relative z-10 space-y-1">
                    <h3 className="font-medium">Open Games</h3>
                    <p className="text-sm text-muted-foreground">
                      Find a last minute player replacement
                    </p>
                  </div>
                </div>

                <div 
                  className="relative flex items-center gap-4 p-6 rounded-lg border overflow-hidden bg-cover bg-center"
                  style={{ backgroundImage: `url(${leaderboardImage})` }}
                >
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
                  <div className="relative z-10 h-10 w-10 rounded-full bg-primary/20 backdrop-blur flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div className="relative z-10 space-y-1">
                    <h3 className="font-medium">Leaderboard</h3>
                    <p className="text-sm text-muted-foreground">
                      Compete against other players of your level
                    </p>
                  </div>
                </div>

                <div 
                  className="relative flex items-center gap-4 p-6 rounded-lg border overflow-hidden bg-cover bg-center"
                  style={{ backgroundImage: `url(${tournamentsImage})` }}
                >
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
                  <div className="relative z-10 h-10 w-10 rounded-full bg-primary/20 backdrop-blur flex items-center justify-center">
                    <History className="h-5 w-5 text-primary" />
                  </div>
                  <div className="relative z-10 space-y-1">
                    <h3 className="font-medium">Tournaments</h3>
                    <p className="text-sm text-muted-foreground">
                      Join a local tournament in your area
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile sticky CTA */}
        <div className="sm:hidden fixed inset-x-0 bottom-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
          <div className="container mx-auto max-w-md px-4 py-3">
            <Button
              className="w-full h-12 text-base font-semibold"
              onClick={() => navigate("/onboarding/final")}
            >
              Continue
            </Button>
          </div>
        </div>

        {/* Desktop CTA */}
        <div className="hidden sm:block pt-4">
          <Button
            className="w-full h-12 text-base font-semibold"
            onClick={() => navigate("/onboarding/final")}
          >
            Continue
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
};
