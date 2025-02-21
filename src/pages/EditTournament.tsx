
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navigation } from "@/components/Navigation";
import { PageContainer } from "@/components/layouts/PageContainer";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";

interface Venue {
  venue_id: string;
  name: string;
}

type BracketType = "SINGLE_ELIM";

interface Tournament {
  tournament_id: string;
  max_participants: number;
  venue_id: string;
  start_date: string;
  end_date: string;
  bracket_type: BracketType;
}

export default function EditTournament() {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);

  // Step 1: Maximum Players
  const [maxPlayers, setMaxPlayers] = useState<string>("");

  // Step 2: Venue
  const [selectedVenue, setSelectedVenue] = useState<string>("");

  // Step 3: Dates and Times
  const [startDate, setStartDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  // Fetch tournament data
  const { data: tournament } = useQuery({
    queryKey: ['tournament', tournamentId, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('view_tournament', {
        p_tournament_id: tournamentId,
        p_user_a_id: user?.id || null
      });

      if (error) throw error;
      return data as Tournament;
    },
    enabled: !!tournamentId && !!user?.id
  });

  // Update form when tournament data is loaded
  useEffect(() => {
    if (tournament) {
      const startDateTime = new Date(tournament.start_date);
      const endDateTime = tournament.end_date ? new Date(tournament.end_date) : null;

      setMaxPlayers(tournament.max_participants?.toString() || "");
      setSelectedVenue(tournament.venue_id || "");
      setStartDate(startDateTime.toISOString().split('T')[0]);
      setStartTime(startDateTime.toTimeString().slice(0, 5));
      if (endDateTime) {
        setEndDate(endDateTime.toISOString().split('T')[0]);
        setEndTime(endDateTime.toTimeString().slice(0, 5));
      }
    }
  }, [tournament]);

  // Fetch venues
  useEffect(() => {
    const fetchVenues = async () => {
      const { data, error } = await supabase.rpc('get_venues');
      if (error) {
        toast.error("Failed to load venues");
        return;
      }
      // Properly type the data
      const typedData = data as unknown as Venue[];
      setVenues(typedData || []);
    };
    fetchVenues();
  }, []);

  const handleNext = () => {
    if (currentStep === 1 && !maxPlayers) {
      toast.error("Please enter maximum number of players");
      return;
    }
    if (currentStep === 2 && !selectedVenue) {
      toast.error("Please select a venue");
      return;
    }
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate(`/tournaments/${tournamentId}`);
    }
  };

  const handleSubmit = async () => {
    if (!user?.id || !tournamentId) {
      toast.error("You must be logged in to edit a tournament");
      return;
    }

    // Validate all required fields
    if (!maxPlayers || !selectedVenue || !startDate || !startTime || !endDate || !endTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      // Combine date and time strings into ISO string with UTC+4
      const startDateTime = new Date(`${startDate}T${startTime}+04:00`).toISOString();
      const endDateTime = new Date(`${endDate}T${endTime}+04:00`).toISOString();

      const updates = {
        max_players: parseInt(maxPlayers),
        venue_id: selectedVenue,
        start_date: startDateTime,
        end_date: endDateTime,
      };

      const { error } = await supabase.rpc('edit_tournament', {
        p_tournament_id: tournamentId,
        p_user_a_id: user.id,
        p_updates: updates
      });

      if (error) throw error;

      toast.success("Tournament updated successfully!");
      navigate(`/tournaments/${tournamentId}`);
    } catch (error) {
      console.error('Error updating tournament:', error);
      toast.error("Failed to update tournament");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <Label htmlFor="maxPlayers">Maximum Number of Players</Label>
            <Input
              id="maxPlayers"
              type="number"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(e.target.value)}
              placeholder="Enter maximum number of players"
              min="2"
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <Label htmlFor="venue">Tournament Venue</Label>
            <Select value={selectedVenue} onValueChange={setSelectedVenue}>
              <SelectTrigger id="venue">
                <SelectValue placeholder="Select venue" />
              </SelectTrigger>
              <SelectContent>
                {venues.map((venue) => (
                  <SelectItem key={venue.venue_id} value={venue.venue_id}>
                    {venue.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navigation />
      <PageContainer>
        <div className="max-w-md mx-auto px-4 py-8">
          <Progress value={(currentStep / 3) * 100} className="mb-8" />
          
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-center">
              {currentStep === 1 && "How many players?"}
              {currentStep === 2 && "Where will it be held?"}
              {currentStep === 3 && "When will it start and end?"}
            </h1>

            {renderStep()}

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              {currentStep < 3 ? (
                <Button onClick={handleNext}>Next</Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
