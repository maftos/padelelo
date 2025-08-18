import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Lock } from "lucide-react";

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
    <OnboardingLayout currentStep={5} totalSteps={6}>
      <div className="flex flex-col min-h-[calc(100vh-200px)] pb-20 sm:pb-0">
        <div className="flex items-center justify-center relative mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/onboarding/step-4")}
            className="absolute left-0 hover:bg-accent/50"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Set your password</h1>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 text-sm font-medium mb-4">
                <Lock className="h-4 w-4" />
                Password
              </div>
              
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
                  className="h-12"
                />
                <p className="text-sm text-muted-foreground">
                  Minimum 6 characters. You can always change it later.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile sticky CTA */}
        <div className="sm:hidden fixed inset-x-0 bottom-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
          <div className="container mx-auto max-w-md px-4 py-3">
            <Button
              className="w-full h-12 text-base font-semibold"
              onClick={handleNext}
              disabled={!isPasswordValid}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Desktop CTA */}
        <div className="hidden sm:block pt-4">
          <Button
            className="w-full h-12 text-base font-semibold"
            onClick={handleNext}
            disabled={!isPasswordValid}
          >
            Next
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
};