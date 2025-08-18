
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "../OnboardingLayout";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

export const GenderStep = () => {
  const navigate = useNavigate();
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  // Load cached data on mount
  useEffect(() => {
    const cachedGender = localStorage.getItem("onboarding_gender");
    if (cachedGender) setSelectedGender(cachedGender);
  }, []);

  const handleSelect = (gender: string) => {
    setSelectedGender(gender);
    localStorage.setItem("onboarding_gender", gender);
    navigate("/onboarding/step-2");
  };

  return (
    <OnboardingLayout currentStep={1} totalSteps={6} showBack={false}>
      <div className="flex flex-col min-h-[calc(100vh-200px)]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Tell us about you</h1>
        </div>

        <div className="w-full max-w-sm mx-auto space-y-4">
          <Card
            className={`p-6 cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-md ${
              selectedGender === "MALE" ? "border-primary bg-primary/5" : ""
            }`}
            onClick={() => handleSelect("MALE")}
          >
            <div className="text-center">
              <div className="font-medium text-lg">Male</div>
            </div>
          </Card>

          <Card
            className={`p-6 cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-md ${
              selectedGender === "FEMALE" ? "border-primary bg-primary/5" : ""
            }`}
            onClick={() => handleSelect("FEMALE")}
          >
            <div className="text-center">
              <div className="font-medium text-lg">Female</div>
            </div>
          </Card>
        </div>
      </div>
    </OnboardingLayout>
  );
};
