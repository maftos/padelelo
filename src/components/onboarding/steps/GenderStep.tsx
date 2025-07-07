
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
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to PadelELO!</h1>
          <p className="text-muted-foreground">Let's get your profile set up</p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium mb-4">
              <User className="h-4 w-4" />
              Gender Selection <span className="text-destructive">*</span>
            </div>
            
            <div className="grid gap-3">
              <Card
                className={`p-4 cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-md ${
                  selectedGender === "MALE" ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => handleSelect("MALE")}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="font-medium">Male</div>
                </div>
              </Card>

              <Card
                className={`p-4 cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-md ${
                  selectedGender === "FEMALE" ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => handleSelect("FEMALE")}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="font-medium">Female</div>
                </div>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </OnboardingLayout>
  );
};
