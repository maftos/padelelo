
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    <OnboardingLayout currentStep={3} totalSteps={6}>
      <div className="flex flex-col min-h-[calc(100vh-200px)] pb-20 sm:pb-0">
        <div className="flex items-center justify-center relative mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/onboarding/step-2")}
            className="absolute left-0 hover:bg-accent/50"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Where are you from?</h1>
        </div>

        <div className="flex-1">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="text-sm font-medium mb-4">
                Nationality
              </div>
              
              <div className="space-y-2">
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
            </CardContent>
          </Card>
        </div>

        {/* Mobile sticky CTA */}
        <div className="sm:hidden fixed inset-x-0 bottom-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
          <div className="container mx-auto max-w-md px-4 py-3">
            <Button
              className="w-full h-12 text-base font-semibold"
              onClick={handleNext}
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
          >
            Next
          </Button>
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
