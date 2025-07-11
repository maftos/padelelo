
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Matchup {
  id: string;
  team1: [string, string];
  team2: [string, string];
}

interface SetScore {
  order: number;
  team1_score: number;
  team2_score: number;
}

interface QueuedResult {
  id: string;
  team1: [string, string];
  team2: [string, string];
  sets: SetScore[];
}

interface BookingData {
  booking_id: string;
  venue_id: string;
  start_time: string;
  title: string;
  description: string;
  status: string;
  participants: Array<{
    player_id: string;
    first_name: string;
    last_name: string;
    profile_photo: string;
    current_mmr: number;
  }>;
}

// Response type for the add_booking_scores function
interface AddBookingScoresResponse {
  success: boolean;
  message?: string;
  matches_processed?: number;
}

export function useAddResults(bookingData: BookingData) {
  const [matchups, setMatchups] = useState<Matchup[]>([]);
  const [queuedResults, setQueuedResults] = useState<QueuedResult[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addResult = (result: QueuedResult) => {
    setQueuedResults(prev => [...prev, result]);
  };

  const removeResult = (resultId: string) => {
    setQueuedResults(prev => prev.filter(r => r.id !== resultId));
  };

  const submitResults = async () => {
    setIsSubmitting(true);
    
    try {
      // Transform queued results into the format expected by add_booking_scores
      const matches = queuedResults.map(result => ({
        team1: result.team1,
        team2: result.team2,
        sets: result.sets
      }));

      // Cast to the correct type for the RPC call
      const payload = {
        matches: matches
      } as any; // Cast to any to satisfy Json type requirement

      console.log('Submitting payload to add_booking_scores:', payload);

      // Call the add_booking_scores function
      const { data, error } = await supabase.rpc('add_booking_scores', {
        p_user_id: bookingData.participants[0]?.player_id, // Use first participant as submitter
        p_booking_id: bookingData.booking_id,
        p_scores: payload
      });

      if (error) {
        console.error('Error submitting scores:', error);
        toast.error("Failed to save results: " + error.message);
        setIsSubmitting(false);
        return false;
      }

      console.log('Scores submitted successfully:', data);
      
      // Cast the response to our expected type
      const response = data as AddBookingScoresResponse;
      
      if (response && response.success) {
        toast.success(`Successfully saved ${matches.length} match${matches.length > 1 ? 'es' : ''}!`);
        setIsSubmitting(false);
        return true;
      } else {
        toast.error(response?.message || "Failed to save results");
        setIsSubmitting(false);
        return false;
      }
    } catch (error) {
      console.error('Error submitting results:', error);
      toast.error("Failed to save results");
      setIsSubmitting(false);
      return false;
    }
  };

  return {
    matchups,
    setMatchups,
    queuedResults,
    addResult,
    removeResult,
    submitResults,
    isSubmitting,
    bookingData
  };
}
