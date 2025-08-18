
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { User, ChevronLeft } from "lucide-react";

export const NameStep = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();

  // Load cached data on mount
  useEffect(() => {
    const cachedFirstName = localStorage.getItem("onboarding_first_name");
    const cachedLastName = localStorage.getItem("onboarding_last_name");
    if (cachedFirstName) setFirstName(cachedFirstName);
    if (cachedLastName) setLastName(cachedLastName);
  }, []);

  const handleNext = () => {
    if (firstName.trim() && lastName.trim()) {
      localStorage.setItem("onboarding_first_name", firstName.trim());
      localStorage.setItem("onboarding_last_name", lastName.trim());
      navigate("/onboarding/step-3");
    }
  };

  return (
    <OnboardingLayout currentStep={2} totalSteps={6}>
      <div className="flex flex-col min-h-[calc(100vh-200px)] pb-20 sm:pb-0">
        <div className="flex items-center justify-center relative mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/onboarding/step-1")}
            className="absolute left-0 hover:bg-accent/50"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">What's your name?</h1>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full space-y-6">
            <div className="space-y-2">
              <Label htmlFor="first_name" className="text-base font-medium">
                First name
              </Label>
              <Input
                id="first_name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                className="h-12"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="last_name" className="text-base font-medium">
                Last name
              </Label>
              <Input
                id="last_name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                className="h-12"
              />
            </div>
          </div>
        </div>

        {/* Mobile sticky CTA */}
        <div className="sm:hidden fixed inset-x-0 bottom-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
          <div className="container mx-auto max-w-md px-4 py-3">
            <Button
              className="w-full h-12 text-base font-semibold"
              onClick={handleNext}
              disabled={!firstName.trim() || !lastName.trim()}
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
            disabled={!firstName.trim() || !lastName.trim()}
          >
            Next
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
};
