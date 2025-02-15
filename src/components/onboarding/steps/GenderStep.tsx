
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const GenderStep = () => {
  const [selectedGender, setSelectedGender] = useState<string>("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (selectedGender) {
      localStorage.setItem("onboarding_gender", selectedGender);
      navigate("/onboarding/step-2");
    }
  };

  return (
    <OnboardingLayout currentStep={1} totalSteps={6} showBack={false}>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Welcome to PadelELO!</h1>
          <p className="text-muted-foreground">First, tell us about yourself</p>
        </div>

        <div className="grid gap-4">
          <Card
            className={`p-4 cursor-pointer transition-all ${
              selectedGender === "MALE"
                ? "border-primary"
                : "hover:border-primary/50"
            }`}
            onClick={() => setSelectedGender("MALE")}
          >
            <div className="font-medium">Male</div>
          </Card>

          <Card
            className={`p-4 cursor-pointer transition-all ${
              selectedGender === "FEMALE"
                ? "border-primary"
                : "hover:border-primary/50"
            }`}
            onClick={() => setSelectedGender("FEMALE")}
          >
            <div className="font-medium">Female</div>
          </Card>
        </div>

        <Button
          className="w-full"
          onClick={handleNext}
          disabled={!selectedGender}
        >
          Continue
        </Button>
      </div>
    </OnboardingLayout>
  );
};
