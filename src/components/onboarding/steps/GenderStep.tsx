
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "../OnboardingLayout";
import { Card } from "@/components/ui/card";
import { Male, Female } from "lucide-react";

export const GenderStep = () => {
  const navigate = useNavigate();

  const handleSelect = (gender: string) => {
    localStorage.setItem("onboarding_gender", gender);
    navigate("/onboarding/step-2");
  };

  return (
    <OnboardingLayout currentStep={1} totalSteps={6} showBack={false}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-center">Welcome to PadelELO!</h1>

        <div className="grid gap-4">
          <Card
            className="p-6 cursor-pointer transition-all hover:border-primary/50"
            onClick={() => handleSelect("MALE")}
          >
            <div className="flex items-center gap-4">
              <Male className="h-6 w-6" />
              <div className="font-medium">Male</div>
            </div>
          </Card>

          <Card
            className="p-6 cursor-pointer transition-all hover:border-primary/50"
            onClick={() => handleSelect("FEMALE")}
          >
            <div className="flex items-center gap-4">
              <Female className="h-6 w-6" />
              <div className="font-medium">Female</div>
            </div>
          </Card>
        </div>
      </div>
    </OnboardingLayout>
  );
};
