
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";
import { countries } from "@/lib/countries";
import { NationalityBottomDrawer } from "../NationalityBottomDrawer";
import { useIsMobile } from "@/hooks/use-mobile";

// Create country data with names and flags
const countryData = countries.map(country => ({
  code: country.code,
  name: new Intl.DisplayNames(['en'], { type: 'region' }).of(country.code) || country.code,
  flag: country.flag
}));

interface NationalityStepProps {
  nationality: string;
  onNationalityChange: (nationality: string) => void;
  onNext: () => void;
  canGoNext: boolean;
}

export const NationalityStep = ({ nationality, onNationalityChange, onNext, canGoNext }: NationalityStepProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleValueChange = (newCode: string) => {
    onNationalityChange(newCode);
  };

  const selectedCountry = countryData.find(country => country.code === nationality);

  const openDrawer = () => {
    if (isMobile) {
      setDrawerOpen(true);
    }
  };

  return (
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
            <Select value={nationality} onValueChange={handleValueChange}>
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
        selectedCountryCode={nationality}
        onSelectCountry={handleValueChange}
      />
    </div>
  );
};
