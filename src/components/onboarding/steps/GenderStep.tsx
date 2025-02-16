
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "../OnboardingLayout";
import { Card } from "@/components/ui/card";
import { UserCircle2 } from "lucide-react";

export const GenderStep = () => {
  const navigate = useNavigate();

  const handleSelect = (gender: string) => {
    localStorage.setItem("onboarding_gender", gender);
    navigate("/onboarding/step-2");
  };

  return (
    <OnboardingLayout currentStep={1} totalSteps={6} showBack={false}>
      <h1 className="text-2xl font-bold text-center pl-8 pr-8">Welcome to PadelELO!</h1>

      <div className="flex flex-col items-center space-y-4 w-full">
        <Card
          className="p-6 cursor-pointer transition-all hover:border-primary/50 w-full"
          onClick={() => handleSelect("MALE")}
        >
          <div className="flex items-center gap-4">
            <UserCircle2 className="h-6 w-6 text-blue-500" />
            <div className="font-medium">Male</div>
          </div>
        </Card>

        <Card
          className="p-6 cursor-pointer transition-all hover:border-primary/50 w-full"
          onClick={() => handleSelect("FEMALE")}
        >
          <div className="flex items-center gap-4">
            <UserCircle2 className="h-6 w-6 text-pink-500" />
            <div className="font-medium">Female</div>
          </div>
        </Card>
      </div>
    </OnboardingLayout>
  );
};
