import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { countries, countryNames } from "@/lib/countries";

interface CountryCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (dialCode: string) => void;
  selectedCode: string;
}

export const CountryCodeModal = ({
  open,
  onOpenChange,
  onSelect,
  selectedCode,
}: CountryCodeModalProps) => {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Select Country Code</DialogTitle>
        </DialogHeader>
        
        <div className="px-6 pb-4">
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

        <ScrollArea className="flex-1 px-6 max-h-[400px]">
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
        </ScrollArea>

        <DialogFooter className="p-6 pt-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};