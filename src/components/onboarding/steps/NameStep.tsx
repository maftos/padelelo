
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const NameStep = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (name.trim()) {
      localStorage.setItem("onboarding_name", name.trim());
      navigate("/onboarding/step-3");
    }
  };

  return (
    <OnboardingLayout currentStep={2} totalSteps={6}>
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">What's your name?</h1>
          <p className="text-muted-foreground">This is how others will see you</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="display_name" className="text-base font-medium">Display Name</Label>
            <Input
              id="display_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="h-12 text-base bg-card/50 backdrop-blur-sm border-muted"
            />
          </div>
        </div>

        <Button
          className="w-full h-12 text-base font-semibold"
          onClick={handleNext}
          disabled={!name.trim()}
        >
          Continue
        </Button>
      </div>
    </OnboardingLayout>
  );
};
