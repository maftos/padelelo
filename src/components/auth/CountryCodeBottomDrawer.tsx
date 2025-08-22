import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { countries, countryNames } from "@/lib/countries";

interface CountryCodeBottomDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (dialCode: string) => void;
  selectedCode: string;
}

export const CountryCodeBottomDrawer = ({
  open,
  onOpenChange,
  onSelect,
  selectedCode,
}: CountryCodeBottomDrawerProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCountries = countries.filter((country) => {
    const countryName = countryNames[country.code]?.toLowerCase() || "";
    const search = searchQuery.toLowerCase();
    
    return (
      countryName.includes(search) ||
      country.code.toLowerCase().includes(search) ||
      country.dial_code.includes(search)
    );
  });

  const handleSelect = (dialCode: string) => {
    onSelect(dialCode);
    onOpenChange(false);
    setSearchQuery(""); // Reset search when closing
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[85vh] flex flex-col">
        <DrawerHeader className="flex-shrink-0">
          <DrawerTitle>Select Country Code</DrawerTitle>
        </DrawerHeader>
        
        <div className="px-4 pb-4 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          <div className="space-y-1 pb-4">
            {filteredCountries.map((country) => {
              const countryName = countryNames[country.code] || country.code;
              const isSelected = country.dial_code === selectedCode;
              
              return (
                <Button
                  key={`${country.code}-${country.dial_code}`}
                  variant={isSelected ? "secondary" : "ghost"}
                  className="w-full justify-start h-auto py-3 px-4 text-left"
                  onClick={() => handleSelect(country.dial_code)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <span className="text-xl">{country.flag}</span>
                    <span className="font-medium min-w-[60px]">{country.dial_code}</span>
                    <span className="text-sm text-muted-foreground truncate">
                      {countryName}
                    </span>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        <DrawerFooter className="flex-shrink-0">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};