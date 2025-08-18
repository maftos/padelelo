
import { FC, ReactNode } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  showBack?: boolean;
  nextButton?: ReactNode;
  onNext?: () => void;
  isNextDisabled?: boolean;
}

export const OnboardingLayout: FC<OnboardingLayoutProps> = ({
  children,
  currentStep,
  totalSteps,
  onBack,
  showBack = true,
  nextButton,
  onNext,
  isNextDisabled = false,
}) => {
  const navigate = useNavigate();
  const progress = (currentStep / totalSteps) * 100;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (currentStep > 1) {
      navigate(`/onboarding/step-${currentStep - 1}`);
    }
  };

  const showBackButton = showBack && currentStep > 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex flex-col relative overflow-hidden">
      {/* Step indicator */}
      <div className="absolute top-4 left-4 text-sm font-medium text-muted-foreground z-10">
        {currentStep} of {totalSteps}
      </div>

      {/* Progress bar */}
      <div className="container max-w-md mx-auto px-4 py-6">
        <Progress value={progress} className="h-1 bg-muted/50" />
      </div>

      {/* Main content area */}
      <div className="flex-1 container max-w-md mx-auto px-4 flex flex-col">
        <div className="flex-1 animate-slide-in-from-right">
          <div className="h-full flex flex-col">
            {children}
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="pb-6 pt-4">
          <div className="flex items-center justify-between">
            {/* Back button */}
            {showBackButton ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="h-12 w-12 rounded-full hover:bg-muted/50 transition-all duration-200"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            ) : (
              <div className="h-12 w-12" />
            )}

            {/* Next button */}
            <div className="flex-1 flex justify-end">
              {nextButton ? (
                nextButton
              ) : onNext ? (
                <Button 
                  onClick={onNext}
                  disabled={isNextDisabled}
                  className="h-12 px-8 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-40"
                >
                  Next
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
