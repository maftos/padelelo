
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { countries } from "@/lib/countries";

// Create country data with names and flags
const countryData = countries.map(country => ({
  code: country.code,
  name: new Intl.DisplayNames(['en'], { type: 'region' }).of(country.code) || country.code,
  flag: country.flag
}));

export const NationalityStep = () => {
  const [value, setValue] = useState("MU"); // Preset to Mauritius (ISO code)
  const navigate = useNavigate();

  // Load cached data on mount
  useEffect(() => {
    const cachedNationality = localStorage.getItem("onboarding_nationality");
    if (cachedNationality) {
      setValue(cachedNationality);
    } else {
      setValue("MU");
      localStorage.setItem("onboarding_nationality", "MU");
    }
  }, []);

  const handleValueChange = (newCode: string) => {
    setValue(newCode);
    localStorage.setItem("onboarding_nationality", newCode);
  };

  const handleNext = () => {
    // Ensure nationality is saved before proceeding
    localStorage.setItem("onboarding_nationality", value);
    navigate("/onboarding/step-4");
  };

  return (
    <OnboardingLayout currentStep={3} totalSteps={6}>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Where are you from?</h1>
          <p className="text-muted-foreground">Help us connect you with local players</p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium mb-4">
              <Globe className="h-4 w-4" />
              Nationality
            </div>
            
            <div className="space-y-2">
              <Select value={value} onValueChange={handleValueChange}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select your country..." />
                </SelectTrigger>
                <SelectContent className="max-h-60 z-50 bg-background">
                  {countryData.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      <span className="flex items-center gap-2">
                        <span className="text-lg">{country.flag}</span>
                        <span>{country.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Button
          className="w-full h-12 text-base font-semibold"
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </OnboardingLayout>
  );
};
