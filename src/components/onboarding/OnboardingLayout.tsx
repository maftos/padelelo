
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
}

export const OnboardingLayout: FC<OnboardingLayoutProps> = ({
  children,
  currentStep,
  totalSteps,
  onBack,
  showBack = true,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex flex-col">
      <div className="container max-w-md mx-auto px-4 py-6">
        <Progress value={progress} className="h-3 bg-muted" />
      </div>
      <div className="flex-1 container max-w-md mx-auto px-4 py-8">
        <div className="relative animate-fade-in">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="absolute left-0 top-2 hover:bg-accent/50"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}
          <div className="space-y-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
