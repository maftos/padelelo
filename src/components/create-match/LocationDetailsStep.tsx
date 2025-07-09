
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, DollarSign } from "lucide-react";
import { DateTimePickers } from "./DateTimePickers";
import { StepHeader } from "./StepHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

interface Venue {
  venue_id: string;
  name: string;
  region?: string;
}

export const LocationDetailsStep = ({ data, hasAllPlayers, onDataChange }: LocationDetailsStepProps) => {
  // Fetch venues from database
  const { data: venuesResponse = [], isLoading: isLoadingVenues } = useQuery({
    queryKey: ['venues'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_all_venues');
      if (error) {
        console.error('Error fetching venues:', error);
        throw error;
      }
      return data;
    }
  });

  // Convert the JSON response to Venue array with proper type checking
  const venues: Venue[] = Array.isArray(venuesResponse) ? 
    venuesResponse.map((venue: any) => ({
      venue_id: venue?.venue_id || '',
      name: venue?.name || '',
      region: venue?.region || 'Other'
    })).filter((venue: Venue) => venue.venue_id && venue.name) : [];

  console.log('Venues loaded:', venues); // Debug log to check if venues are loaded

  const requiresDetails = !hasAllPlayers;

  // Group venues by region
  const venuesByRegion = venues.reduce((acc, venue) => {
    const region = venue.region || 'Other';
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(venue);
    return acc;
  }, {} as Record<string, Venue[]>);

  const regionOrder = ['North', 'South', 'East', 'West', 'Central', 'Other'];
  const sortedRegions = regionOrder.filter(region => venuesByRegion[region]?.length > 0);

  return (
    <div className="space-y-6">
      <StepHeader 
        title="Match Details"
        description="Set location, date, time, and fee details"
        showOpenGameBadge={!hasAllPlayers}
      />

      {/* Location */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <MapPin className="h-4 w-4" />
          Location {requiresDetails && <span className="text-destructive">*</span>}
        </div>
        <Select 
          value={data.venueId} 
          onValueChange={(value) => {
            const selectedVenue = venues.find(v => v.venue_id === value);
            onDataChange({ 
              venueId: value, 
              location: selectedVenue?.name || "" 
            });
          }}
          disabled={isLoadingVenues}
        >
          <SelectTrigger>
            <SelectValue placeholder={
              isLoadingVenues 
                ? "Loading venues..." 
                : venues.length === 0
                  ? "No venues available"
                  : requiresDetails 
                    ? "Choose a venue" 
                    : "Choose a venue (optional)"
            } />
          </SelectTrigger>
          <SelectContent>
            {sortedRegions.length > 0 ? (
              sortedRegions.map((region) => (
                <div key={region}>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {region}
                  </div>
                  {venuesByRegion[region].map((venue) => (
                    <SelectItem key={venue.venue_id} value={venue.venue_id}>
                      {venue.name}
                    </SelectItem>
                  ))}
                </div>
              ))
            ) : (
              <SelectItem value="no-venues" disabled>
                No venues available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Date & Time */}
      <DateTimePickers
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
          Fee per Player
        </div>
        <Input
          value={data.feePerPlayer}
          onChange={(e) => onDataChange({ feePerPlayer: e.target.value })}
          placeholder="Enter fee amount (optional)"
        />
      </div>
    </div>
  );
};
