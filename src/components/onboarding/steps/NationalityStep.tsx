
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countries } from "@/lib/countries";

export const NationalityStep = () => {
  const [nationality, setNationality] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (nationality) {
      localStorage.setItem("onboarding_nationality", nationality);
      navigate("/onboarding/step-4");
    }
  };

  return (
    <OnboardingLayout currentStep={3} totalSteps={6}>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Where are you from?</h1>
          <p className="text-muted-foreground">Select your nationality</p>
        </div>

        <Select onValueChange={setNationality} value={nationality}>
          <SelectTrigger>
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                <span className="mr-2">{country.flag}</span>
                {country.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          className="w-full"
          onClick={handleNext}
          disabled={!nationality}
        >
          Continue
        </Button>
      </div>
    </OnboardingLayout>
  );
};
