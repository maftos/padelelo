
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { TournamentFormData } from "@/hooks/tournament/use-tournament-form";

interface TournamentVenueProps {
  formData: TournamentFormData;
  onChange: (data: Partial<TournamentFormData>) => void;
  venues: { venue_id: string; name: string; }[];
}

export function TournamentVenue({ formData, onChange, venues }: TournamentVenueProps) {
  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-4 h-5 w-5 text-gray-400 pointer-events-none z-10" />
      <Select
        value={formData.venue}
        onValueChange={(value) => onChange({ venue: value })}
        required
      >
        <SelectTrigger className="h-14 pt-4 pl-10">
          <SelectValue placeholder=" " />
        </SelectTrigger>
        <SelectContent>
          {venues.map((venue) => (
            <SelectItem key={venue.venue_id} value={venue.venue_id}>
              {venue.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <label className="absolute left-10 top-2 text-xs text-gray-500 z-10">
        Location
      </label>
    </div>
  );
}
