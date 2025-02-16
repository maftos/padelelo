
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
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-center">What's your name?</h1>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="display_name">Display Name</Label>
            <Input
              id="display_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
        </div>

        <Button
          className="w-full"
          onClick={handleNext}
          disabled={!name.trim()}
        >
          Continue
        </Button>
      </div>
    </OnboardingLayout>
  );
};
