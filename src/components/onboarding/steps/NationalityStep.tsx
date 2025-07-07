
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "../OnboardingLayout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { countries } from "@/lib/countries";

// Create country data with names and flags
const countryData = countries.map(country => ({
  code: country.code,
  name: new Intl.DisplayNames(['en'], { type: 'region' }).of(country.code) || country.code,
  flag: country.flag
}));

export const NationalityStep = () => {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const handleValueChange = (newValue: string) => {
    const country = countryData.find(country => country.name === newValue);
    if (country) {
      setValue(newValue);
      localStorage.setItem("onboarding_nationality", country.code);
      navigate("/onboarding/step-4");
    }
  };

  return (
    <OnboardingLayout currentStep={3} totalSteps={6}>
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Where are you from?</h1>
          <p className="text-muted-foreground">Help us connect you with local players</p>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-medium">Country</Label>
          <Select value={value} onValueChange={handleValueChange}>
            <SelectTrigger className="w-full h-12 text-base bg-card/50 backdrop-blur-sm border-muted">
              <SelectValue placeholder="Select your country..." />
            </SelectTrigger>
            <SelectContent className="bg-card/95 backdrop-blur-sm border-muted">
              {countryData.map((country) => (
                <SelectItem key={country.code} value={country.name} className="hover:bg-accent/50">
                  <span className="flex items-center gap-3">
                    <span className="text-lg">{country.flag}</span>
                    <span>{country.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </OnboardingLayout>
  );
};
