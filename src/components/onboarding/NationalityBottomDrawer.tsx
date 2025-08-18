import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { countries } from "@/lib/countries";

interface Country {
  code: string;
  name: string;
  flag: string;
}

interface NationalityBottomDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedCountryCode: string;
  onSelectCountry: (countryCode: string) => void;
}

export const NationalityBottomDrawer = ({
  open,
  onClose,
  selectedCountryCode,
  onSelectCountry,
}: NationalityBottomDrawerProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Create country data with names and flags
  const countryData: Country[] = useMemo(() => 
    countries.map(country => ({
      code: country.code,
      name: new Intl.DisplayNames(['en'], { type: 'region' }).of(country.code) || country.code,
      flag: country.flag
    })).sort((a, b) => a.name.localeCompare(b.name)), 
    []
  );

  // Filter countries based on search term
  const filteredCountries = useMemo(() => {
    if (!searchTerm) return countryData;
    return countryData.filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [countryData, searchTerm]);

  const handleSelectCountry = (countryCode: string) => {
    onSelectCountry(countryCode);
    onClose();
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="h-[85vh] flex flex-col">
        <DrawerHeader className="border-b border-border pb-4">
          <DrawerTitle className="text-center">Select your country</DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 flex flex-col min-h-0">
          {/* Search Input */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 h-12"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Countries List */}
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              <div className="p-2">
                {filteredCountries.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No countries found
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredCountries.map((country) => (
                      <Button
                        key={country.code}
                        variant={selectedCountryCode === country.code ? "secondary" : "ghost"}
                        className="w-full h-14 justify-start p-4 text-left"
                        onClick={() => handleSelectCountry(country.code)}
                      >
                        <span className="text-2xl mr-3">{country.flag}</span>
                        <span className="text-base">{country.name}</span>
                        {selectedCountryCode === country.code && (
                          <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
                        )}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};