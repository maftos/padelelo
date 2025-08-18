
import { FC, ReactNode } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useOnboardingNavigation, TransitionDirection, TransitionState } from "@/hooks/use-onboarding-navigation";

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  showBack?: boolean;
  nextButton?: ReactNode;
  onNext?: () => void;
  isNextDisabled?: boolean;
  transitionState?: TransitionState;
  transitionDirection?: TransitionDirection;
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
  transitionState = 'idle',
  transitionDirection = 'forward',
}) => {
  const { goToPreviousStep } = useOnboardingNavigation();
  const progress = (currentStep / totalSteps) * 100;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (currentStep > 1) {
      goToPreviousStep(currentStep);
    }
  };

  // Determine animation classes based on transition state and direction
  const getAnimationClass = () => {
    if (transitionState === 'transitioning') {
      return transitionDirection === 'forward' 
        ? 'animate-slide-out-to-left' 
        : 'animate-slide-out-to-right';
    }
    return transitionDirection === 'forward' 
      ? 'animate-slide-in-from-right' 
      : 'animate-slide-in-from-left';
  };

  const showBackButton = showBack && currentStep > 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex flex-col relative overflow-hidden">
      {/* Progress bar */}
      <div className="container max-w-md mx-auto px-4 py-6">
        <Progress value={progress} className="h-1 bg-muted/50" />
      </div>

      {/* Main content area */}
      <div className="flex-1 container max-w-md mx-auto px-4 flex flex-col pb-20">
        <div className={`flex-1 w-full ${getAnimationClass()}`}>
          <div className="h-full flex flex-col w-full">
            {children}
          </div>
        </div>
      </div>

      {/* Bottom action bar - Fixed to bottom for mobile */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t">
        <div className="container max-w-md mx-auto px-4 py-4">
          <div className={`w-full flex items-center gap-3 ${!showBackButton ? 'justify-center' : ''}`}>
            {/* Back button */}
            {showBackButton ? (
              <Button
                variant="outline"
                size="icon"
                onClick={handleBack}
                className="h-12 w-12 rounded-lg border-2 border-border hover:bg-muted/50 transition-all duration-200"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            ) : null}

            {/* Next button */}
            <div className={showBackButton ? "flex-1" : "w-full"}>
              {nextButton ? (
                nextButton
              ) : onNext ? (
                <Button 
                  onClick={onNext}
                  disabled={isNextDisabled}
                  className="w-full h-12 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-40"
                >
                  Continue
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
