
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const NameStep = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (firstName.trim() && lastName.trim()) {
      localStorage.setItem("onboarding_first_name", firstName.trim());
      localStorage.setItem("onboarding_last_name", lastName.trim());
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
            <Label htmlFor="first_name" className="text-base font-medium">First Name</Label>
            <Input
              id="first_name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              className="h-12 text-base bg-card/50 backdrop-blur-sm border-muted"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="last_name" className="text-base font-medium">Last Name</Label>
            <Input
              id="last_name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              className="h-12 text-base bg-card/50 backdrop-blur-sm border-muted"
            />
          </div>
        </div>

        <Button
          className="w-full h-12 text-base font-semibold"
          onClick={handleNext}
          disabled={!firstName.trim() || !lastName.trim()}
        >
          Next
        </Button>
      </div>
    </OnboardingLayout>
  );
};
