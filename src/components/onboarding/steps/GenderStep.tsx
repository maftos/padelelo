
import { useState, useEffect } from "react";
import { OnboardingLayout } from "../OnboardingLayout";
import { Card } from "@/components/ui/card";
import { useOnboardingNavigation } from "@/hooks/use-onboarding-navigation";

export const GenderStep = () => {
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const { goToNextStep, transitionState, transitionDirection } = useOnboardingNavigation();

  // Load cached data on mount
  useEffect(() => {
    const cachedGender = localStorage.getItem("onboarding_gender");
    if (cachedGender) setSelectedGender(cachedGender);
  }, []);

  const handleSelect = (gender: string) => {
    if (transitionState === 'transitioning') return;
    
    setSelectedGender(gender);
    localStorage.setItem("onboarding_gender", gender);
  };

  const handleNext = () => {
    if (transitionState !== 'transitioning' && selectedGender) {
      goToNextStep(1);
    }
  };

  return (
    <OnboardingLayout 
      currentStep={1} 
      totalSteps={6} 
      showBack={false}
      onNext={handleNext}
      isNextDisabled={!selectedGender}
      transitionState={transitionState}
      transitionDirection={transitionDirection}
    >
      <div className="flex-1 flex flex-col justify-center space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Tell us about you</h1>
          <p className="text-muted-foreground">This helps us personalize your experience</p>
        </div>

        <div className="w-full max-w-sm mx-auto space-y-4">
          <Card
            className={`p-6 cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:scale-[1.02] ${
              selectedGender === "MALE" ? "border-primary bg-primary/5 shadow-lg" : "hover:bg-accent/50"
            }`}
            onClick={() => handleSelect("MALE")}
          >
            <div className="text-center">
              <div className="font-medium text-lg">Male</div>
            </div>
          </Card>

          <Card
            className={`p-6 cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:scale-[1.02] ${
              selectedGender === "FEMALE" ? "border-primary bg-primary/5 shadow-lg" : "hover:bg-accent/50"
            }`}
            onClick={() => handleSelect("FEMALE")}
          >
            <div className="text-center">
              <div className="font-medium text-lg">Female</div>
            </div>
          </Card>
        </div>
      </div>
    </OnboardingLayout>
  );
};
