
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, DollarSign } from "lucide-react";
import { DateTimeDrawers } from "./DateTimeDrawers";
import { VenueSelectionDrawer } from "./VenueSelectionDrawer";
import { StepHeader } from "./StepHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

interface LocationDetailsData {
  venueId: string;
  location: string;
  matchDate: string;
  matchTime: string;
  feePerPlayer: string;
}

interface LocationDetailsStepProps {
  data: LocationDetailsData;
  hasAllPlayers: boolean;
  onDataChange: (data: Partial<LocationDetailsData>) => void;
}

export const LocationDetailsStep = ({ data, hasAllPlayers, onDataChange }: LocationDetailsStepProps) => {
  const isMobile = useIsMobile();
  
  // Fetch venues from database
  const { data: venuesResult, isLoading: isLoadingVenues } = useQuery({
    queryKey: ['venues'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_all_venues');
      if (error) {
        console.error('Error fetching venues:', error);
        throw error;
      }
      return data as { venues: Array<{ venue_id: string; name: string }> };
    }
  });

  const venues = venuesResult?.venues || [];

  const requiresDetails = !hasAllPlayers;

  return (
    <div className="space-y-6">
      <StepHeader 
        title="Match Details"
        description="Set location, date, time, and fee details"
        showOpenGameBadge={!hasAllPlayers}
      />

      {/* Location */}
      <div className="space-y-3">
        {!isMobile && (
          <div className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="h-4 w-4" />
            Location {requiresDetails && <span className="text-destructive">*</span>}
          </div>
        )}
        
        {isMobile && (
          <div className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="h-4 w-4" />
            Booking Details
          </div>
        )}
        
        {isMobile ? (
          <VenueSelectionDrawer
            venues={venues}
            selectedVenueId={data.venueId}
            onVenueSelect={(venueId) => {
              onDataChange({ 
                venueId: venueId, 
                location: venueId
              });
            }}
            isLoading={isLoadingVenues}
            required={requiresDetails}
          />
        ) : (
          <Select 
            value={data.venueId} 
            onValueChange={(value) => {
              onDataChange({ 
                venueId: value, 
                location: value
              });
            }}
            disabled={isLoadingVenues}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                isLoadingVenues 
                  ? "Loading venues..." 
                  : requiresDetails 
                    ? "Choose a venue" 
                    : "Choose a venue (optional)"
              } />
            </SelectTrigger>
            <SelectContent>
              {venues.map((venue) => (
                <SelectItem key={venue.venue_id} value={venue.venue_id}>
                  {venue.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Date & Time */}
      <DateTimeDrawers
        date={data.matchDate}
        time={data.matchTime}
        onDateChange={(date) => onDataChange({ matchDate: date })}
        onTimeChange={(time) => onDataChange({ matchTime: time })}
        required={requiresDetails}
      />

      {/* Fee Per Player */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <DollarSign className="h-4 w-4" />
          Fee per Player {requiresDetails && <span className="text-destructive">*</span>}
        </div>
        <Input
          value={data.feePerPlayer}
          onChange={(e) => onDataChange({ feePerPlayer: e.target.value })}
          placeholder={requiresDetails ? "Enter fee amount" : "Enter fee amount (optional)"}
        />
      </div>
    </div>
  );
};
