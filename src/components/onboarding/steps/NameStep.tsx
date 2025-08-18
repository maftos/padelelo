
import { useState, useEffect } from "react";
import { OnboardingLayout } from "../OnboardingLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOnboardingNavigation } from "@/hooks/use-onboarding-navigation";

export const NameStep = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { goToNextStep, transitionState, transitionDirection } = useOnboardingNavigation();

  // Load cached data on mount
  useEffect(() => {
    const cachedFirstName = localStorage.getItem("onboarding_first_name");
    const cachedLastName = localStorage.getItem("onboarding_last_name");
    if (cachedFirstName) setFirstName(cachedFirstName);
    if (cachedLastName) setLastName(cachedLastName);
  }, []);

  const handleNext = () => {
    if (firstName.trim() && lastName.trim() && transitionState !== 'transitioning') {
      localStorage.setItem("onboarding_first_name", firstName.trim());
      localStorage.setItem("onboarding_last_name", lastName.trim());
      goToNextStep(2);
    }
  };

  const isFormValid = firstName.trim() && lastName.trim();

  return (
    <OnboardingLayout 
      currentStep={2} 
      totalSteps={6}
      onNext={handleNext}
      isNextDisabled={!isFormValid}
      transitionState={transitionState}
      transitionDirection={transitionDirection}
    >
      <div className="flex-1 flex flex-col justify-center space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">What's your name?</h1>
          <p className="text-muted-foreground">We'll use this to personalize your profile</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="first_name" className="text-base font-medium">
              First name
            </Label>
            <Input
              id="first_name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              className="h-12 text-base"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name" className="text-base font-medium">
              Last name
            </Label>
            <Input
              id="last_name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              className="h-12 text-base"
            />
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
};
