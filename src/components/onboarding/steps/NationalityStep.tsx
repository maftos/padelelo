
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, ChevronLeft, ChevronDown } from "lucide-react";
import { countries } from "@/lib/countries";
import { NationalityBottomDrawer } from "../NationalityBottomDrawer";
import { useIsMobile } from "@/hooks/use-mobile";

// Create country data with names and flags
const countryData = countries.map(country => ({
  code: country.code,
  name: new Intl.DisplayNames(['en'], { type: 'region' }).of(country.code) || country.code,
  flag: country.flag
}));

export const NationalityStep = () => {
  const [value, setValue] = useState("MU"); // Preset to Mauritius (ISO code)
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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

  const selectedCountry = countryData.find(country => country.code === value);

  const openDrawer = () => {
    if (isMobile) {
      setDrawerOpen(true);
    }
  };

  return (
    <OnboardingLayout 
      currentStep={3} 
      totalSteps={6}
      onNext={handleNext}
    >
      <div className="flex-1 flex flex-col justify-center space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Where are you from?</h1>
          <p className="text-muted-foreground">Help us customize your experience</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-base font-medium">
              Nationality
            </Label>
            {isMobile ? (
              <Button
                variant="outline"
                className="w-full h-12 justify-between text-left"
                onClick={openDrawer}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{selectedCountry?.flag}</span>
                  <span className="text-base">{selectedCountry?.name || "Select your country..."}</span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            ) : (
              <Select value={value} onValueChange={handleValueChange}>
                <SelectTrigger className="h-12">
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
            )}
          </div>
        </div>

        {/* Mobile Bottom Drawer */}
        <NationalityBottomDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          selectedCountryCode={value}
          onSelectCountry={handleValueChange}
        />
      </div>
    </OnboardingLayout>
  );
};
