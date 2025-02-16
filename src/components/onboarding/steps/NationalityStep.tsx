
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "../OnboardingLayout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      <h1 className="text-2xl font-bold text-center mb-6">Where are you from?</h1>

      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select country..." />
        </SelectTrigger>
        <SelectContent>
          {countryData.map((country) => (
            <SelectItem key={country.code} value={country.name}>
              <span className="flex items-center gap-2">
                <span>{country.flag}</span>
                <span>{country.name}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </OnboardingLayout>
  );
};
