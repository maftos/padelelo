import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "../OnboardingLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const PasswordStep = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (password.trim()) {
      localStorage.setItem("onboarding_password", password);
      navigate("/onboarding/final");
    }
  };

  const isPasswordValid = password.length >= 6;

  return (
    <OnboardingLayout 
      currentStep={5} 
      totalSteps={6}
      onNext={handleNext}
      isNextDisabled={!isPasswordValid}
    >
      <div className="flex-1 flex flex-col justify-center space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Set your password</h1>
          <p className="text-muted-foreground">Keep your account secure</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-base font-medium">
              Choose a secure password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="h-12 text-base"
              autoFocus
            />
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
};