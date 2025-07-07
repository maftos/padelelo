
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ClipboardEdit, TrendingUp, History } from "lucide-react";

export const AboutStep = () => {
  const navigate = useNavigate();

  return (
    <OnboardingLayout currentStep={5} totalSteps={6}>
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to PadelELO</h1>
          <p className="text-muted-foreground">Here's what you can do on our platform</p>
        </div>

        <div className="space-y-4">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-muted hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ClipboardEdit className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">Register Matches</h3>
                <p className="text-muted-foreground">
                  Keep track of all your matches and results
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-muted hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">Increase your Rating</h3>
                <p className="text-muted-foreground">
                  Win matches to climb the leaderboard
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-muted hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <History className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">Track your History</h3>
                <p className="text-muted-foreground">
                  View your progress and statistics over time
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Button
          className="w-full h-12 text-base font-semibold"
          onClick={() => navigate("/onboarding/final")}
        >
          Continue
        </Button>
      </div>
    </OnboardingLayout>
  );
};
