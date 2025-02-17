
import { FC, ReactNode } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";

interface CreateTournamentLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
}

export const CreateTournamentLayout: FC<CreateTournamentLayoutProps> = ({
  children,
  currentStep,
  totalSteps,
  onBack,
}) => {
  const navigate = useNavigate();
  const progress = (currentStep / totalSteps) * 100;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (currentStep > 1) {
      navigate(`/tournament/create-tournament/step-${currentStep - 1}`);
    } else {
      navigate('/tournaments');
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background flex flex-col">
        <div className="container max-w-md mx-auto px-4 py-2">
          <Progress value={progress} className="h-2" />
        </div>
        <div className="flex-1 container max-w-md mx-auto px-4 py-8">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="absolute left-0 top-2"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <div className="space-y-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
