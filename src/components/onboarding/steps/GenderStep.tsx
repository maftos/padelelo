
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "../OnboardingLayout";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";

export const GenderStep = () => {
  const navigate = useNavigate();

  const handleSelect = (gender: string) => {
    localStorage.setItem("onboarding_gender", gender);
    navigate("/onboarding/step-2");
  };

  return (
    <OnboardingLayout currentStep={1} totalSteps={6} showBack={false}>
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to PadelELO!</h1>
        <p className="text-muted-foreground">Let's get your profile set up</p>
      </div>

      <div className="flex flex-col space-y-4 w-full">
        <Card
          className="p-6 cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:scale-[1.02] w-full bg-card/50 backdrop-blur-sm"
          onClick={() => handleSelect("MALE")}
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div className="font-semibold text-lg">Male</div>
          </div>
        </Card>

        <Card
          className="p-6 cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:scale-[1.02] w-full bg-card/50 backdrop-blur-sm"
          onClick={() => handleSelect("FEMALE")}
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div className="font-semibold text-lg">Female</div>
          </div>
        </Card>
      </div>
    </OnboardingLayout>
  );
};
