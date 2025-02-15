
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ClipboardEdit, TrendingUp, History } from "lucide-react";

export const AboutStep = () => {
  const navigate = useNavigate();

  return (
    <OnboardingLayout currentStep={5} totalSteps={6}>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Welcome to PadelELO</h1>
          <p className="text-muted-foreground">Here's what you can do</p>
        </div>

        <div className="space-y-4">
          <Card className="p-4 space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <ClipboardEdit className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Register Matches</h3>
                <p className="text-sm text-muted-foreground">
                  Keep track of all your matches
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Increase your Rating</h3>
                <p className="text-sm text-muted-foreground">
                  Win matches to climb the leaderboard
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <History className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Track your History</h3>
                <p className="text-sm text-muted-foreground">
                  View your progress over time
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Button
          className="w-full"
          onClick={() => navigate("/onboarding/final")}
        >
          Continue
        </Button>
      </div>
    </OnboardingLayout>
  );
};
