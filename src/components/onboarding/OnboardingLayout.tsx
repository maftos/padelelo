import { FC, ReactNode } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  progress: number;
  showBack?: boolean;
  onNext?: () => void;
  onBack?: () => void;
  isNextDisabled?: boolean;
  nextButtonText?: string;
  className?: string;
}

export const OnboardingLayout: FC<OnboardingLayoutProps> = ({
  children,
  currentStep,
  totalSteps,
  progress,
  showBack = true,
  onNext,
  onBack,
  isNextDisabled = false,
  nextButtonText = "Next",
  className = ""
}) => {
  const showBackButton = showBack && currentStep > 1;

  return (
    <div className={`min-h-screen bg-background flex flex-col ${className}`}>
      {/* Progress Bar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container max-w-lg mx-auto px-4 py-6">
        <div className="h-full flex flex-col">
          {children}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border/50">
        <div className="container max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <Button
                variant="outline"
                size="lg"
                onClick={onBack}
                className="flex-shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}
            {onNext && (
              <Button
                onClick={onNext}
                disabled={isNextDisabled}
                size="lg"
                className="flex-1 h-12 rounded-lg font-medium transition-all duration-200"
              >
                {nextButtonText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};