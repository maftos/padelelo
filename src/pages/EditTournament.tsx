
import { useAuth } from "@/contexts/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { PageContainer } from "@/components/layouts/PageContainer";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { format } from "date-fns";

export default function EditTournament() {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const TOTAL_STEPS = 3;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    maxPlayers: "",
    selectedVenue: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  });

  const [venues, setVenues] = useState([]);

  // Fetch tournament data
  const { data: tournament, isLoading } = useQuery({
    queryKey: ['tournament', tournamentId, user?.id],
    queryFn: async () => {
      const { data, error } = await (supabase.rpc as any)('view_tournament', {
        p_tournament_id: tournamentId,
        p_user_a_id: user?.id || null
      });

      if (error) throw error;
      return data;
    }
  });

  // Fetch venues
  useEffect(() => {
    const fetchVenues = async () => {
      const { data, error } = await supabase.rpc('get_venues');
      if (error) {
        toast.error("Failed to load venues");
        return;
      }
      setVenues(data);
    };
    fetchVenues();
  }, []);

  // Update form data when tournament data is loaded
  useEffect(() => {
    if (tournament) {
      const startDateTime = new Date(tournament.start_date);
      const endDateTime = tournament.end_date ? new Date(tournament.end_date) : null;

      setFormData({
        maxPlayers: tournament.max_participants?.toString() || "",
        selectedVenue: tournament.venue_id || "",
        startDate: format(startDateTime, "yyyy-MM-dd"),
        startTime: format(startDateTime, "HH:mm"),
        endDate: endDateTime ? format(endDateTime, "yyyy-MM-dd") : "",
        endTime: endDateTime ? format(endDateTime, "HH:mm") : "",
      });
    }
  }, [tournament]);

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
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
    if (!user?.id || !tournament) {
      toast.error("You must be logged in to edit a tournament");
      return;
    }

    setIsSubmitting(true);
    try {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}+04:00`).toISOString();
      const endDateTime = formData.endDate && formData.endTime 
        ? new Date(`${formData.endDate}T${formData.endTime}+04:00`).toISOString()
        : null;

      const updates = {
        max_players: parseInt(formData.maxPlayers),
        venue_id: formData.selectedVenue,
        start_date: startDateTime,
        end_date: endDateTime,
      };

      const { error } = await (supabase.rpc as any)('edit_tournament', {
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
              value={formData.maxPlayers}
              onChange={(e) => setFormData(prev => ({ ...prev, maxPlayers: e.target.value }))}
              placeholder="Enter maximum number of players"
              min="2"
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <Label htmlFor="venue">Tournament Venue</Label>
            <Select 
              value={formData.selectedVenue} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, selectedVenue: value }))}
            >
              <SelectTrigger id="venue">
                <SelectValue placeholder="Select venue" />
              </SelectTrigger>
              <SelectContent>
                {venues.map((venue: any) => (
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
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <>
        <Navigation />
        <PageContainer>
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-pulse">Loading tournament details...</div>
          </div>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <PageContainer>
        <div className="max-w-md mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-center mb-8">Edit Tournament</h1>
          
          <div className="space-y-6">
            {renderStep()}

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              {currentStep < TOTAL_STEPS ? (
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

