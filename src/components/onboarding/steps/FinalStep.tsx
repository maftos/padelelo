import { useEffect } from "react";
import { OnboardingData } from "@/hooks/use-onboarding-state";

interface FinalStepProps {
  data: OnboardingData;
  onComplete: () => void;
  isSubmitting: boolean;
}

export const FinalStep = ({ onComplete }: FinalStepProps) => {
  // Auto-complete when this step is reached since onboarding is already done
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1500); // Show success message briefly before redirecting

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex-1 flex flex-col justify-center items-center space-y-8">
      <div className="text-center space-y-4 animate-fade-in">
        <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center animate-scale-in">
          <span className="text-2xl">🎉</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">You're all set!</h1>
          <p className="text-muted-foreground text-lg">
            Welcome to PadelELO!
          </p>
        </div>
      </div>
    </div>
  );
};