
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardEdit, TrendingUp, History, Info } from "lucide-react";

export const AboutStep = () => {
  const navigate = useNavigate();

  return (
    <OnboardingLayout currentStep={5} totalSteps={6}>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to PadelELO</h1>
          <p className="text-muted-foreground">Here's what you can do on our platform</p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg border">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <ClipboardEdit className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">Open Games</h3>
                  <p className="text-sm text-muted-foreground">
                    Find a last minute player replacement
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg border">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">Leaderboard</h3>
                  <p className="text-sm text-muted-foreground">
                    Compete against other players of your level
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg border">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <History className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">Tournaments</h3>
                  <p className="text-sm text-muted-foreground">
                    Join a local tournament in your area
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
