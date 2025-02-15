
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
      navigate(`/onboarding/step${currentStep - 1}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-4 py-2">
        <Progress value={progress} className="h-2" />
      </div>
      {showBack && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4"
          onClick={handleBack}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      )}
      <div className="flex-1 container max-w-md mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
};
