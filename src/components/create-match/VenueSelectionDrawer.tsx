import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Venue {
  venue_id: string;
  name: string;
}

interface VenueSelectionDrawerProps {
  venues: Venue[];
  selectedVenueId: string;
  onVenueSelect: (venueId: string) => void;
  isLoading?: boolean;
  required?: boolean;
}

export const VenueSelectionDrawer = ({
  venues,
  selectedVenueId,
  onVenueSelect,
  isLoading = false,
  required = false
}: VenueSelectionDrawerProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedVenue = venues.find(v => v.venue_id === selectedVenueId);
  
  const filteredVenues = venues.filter(venue =>
    venue.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVenueSelect = (venueId: string) => {
    onVenueSelect(venueId);
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-14 pt-4 justify-start text-left font-normal"
          disabled={isLoading}
        >
          <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
          <div className="flex flex-col items-start flex-1 min-w-0">
            <span className="text-xs text-muted-foreground">
              Location {required && <span className="text-destructive">*</span>}
            </span>
            <span className="mt-0.5 truncate w-full">
              {isLoading
                ? "Loading venues..."
                : selectedVenue
                ? selectedVenue.name
                : required
                ? "Choose a venue"
                : "Choose a venue (optional)"
              }
            </span>
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh] flex flex-col">
        <DrawerHeader className="border-b border-border pb-4">
          <DrawerTitle className="text-center">
            Select Venue
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="flex-1 overflow-hidden p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search venues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Venues List */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {filteredVenues.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No venues found
              </div>
            ) : (
              filteredVenues.map((venue) => (
                <Button
                  key={venue.venue_id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-between h-auto p-4 text-left",
                    selectedVenueId === venue.venue_id && "bg-primary/10 border border-primary/20"
                  )}
                  onClick={() => handleVenueSelect(venue.venue_id)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{venue.name}</span>
                  </div>
                  {selectedVenueId === venue.venue_id && (
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  )}
                </Button>
              ))
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};