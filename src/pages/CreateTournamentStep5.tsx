
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateTournamentLayout } from "@/components/tournament/CreateTournamentLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Venue {
  id: string;
  display_name: string;
}

interface VenueResponse {
  venue_id: string;
  name: string;
}

export default function CreateTournamentStep5() {
  const [venueId, setVenueId] = useState<string>("");
  const navigate = useNavigate();

  const { data: venues, isLoading } = useQuery({
    queryKey: ['venues'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_venues');
      if (error) throw error;
      // Transform the response data to match our Venue interface
      return (data as VenueResponse[]).map((venue): Venue => ({
        id: venue.venue_id,
        display_name: venue.name
      }));
    }
  });

  const handleNext = () => {
    if (venueId) {
      localStorage.setItem("tournament_venue_id", venueId);
      navigate("/tournament/create-tournament/step-6");
    }
  };

  return (
    <CreateTournamentLayout currentStep={5} totalSteps={7}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-center">Select Venue</h1>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="venue">Venue</Label>
            <Select value={venueId} onValueChange={setVenueId}>
              <SelectTrigger id="venue">
                <SelectValue placeholder="Select venue" />
              </SelectTrigger>
              <SelectContent>
                {venues?.map((venue) => (
                  <SelectItem key={venue.id} value={venue.id}>
                    {venue.display_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          className="w-full"
          onClick={handleNext}
          disabled={!venueId || isLoading}
        >
          Continue
        </Button>
      </div>
    </CreateTournamentLayout>
  );
}
