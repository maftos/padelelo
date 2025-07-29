
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Matchup {
  id: string;
  team1: [string, string];
  team2: [string, string];
  team1Score?: number;
  team2Score?: number;
}

interface SetScore {
  setNumber: number;
  team1Score: number;
  team2Score: number;
}

interface BookingResponse {
  booking_id: string;
  venue_id: string;
  start_time: string;
  title: string;
  description: string;
  status: string;
  creator: string;
  players: string[];
}

export function useAddResults(bookingId: string, userId: string) {
  const [matchups, setMatchups] = useState<Matchup[]>([]);
  const [allSetScores, setAllSetScores] = useState<{ [matchupId: string]: SetScore[] }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setScores = (matchupId: string, setScores: SetScore[]) => {
    setAllSetScores(prev => ({
      ...prev,
      [matchupId]: setScores
    }));
  };

  const submitResults = async (matchupsToSubmit: Matchup[]) => {
    setIsSubmitting(true);
    
    try {
      // Validate that all matchups have scores
      for (const matchup of matchupsToSubmit) {
        if (!matchup.team1Score && matchup.team1Score !== 0 || !matchup.team2Score && matchup.team2Score !== 0) {
          toast.error(`Please enter scores for all matches`);
          setIsSubmitting(false);
          return false;
        }
      }

      // Transform matchups to the expected payload format for add_booking_scores
      const scoresPayload = {
        sets: matchupsToSubmit.map((matchup, index) => ({
          order: index + 1,
          team1: matchup.team1,
          team2: matchup.team2,
          team1_score: matchup.team1Score!,
          team2_score: matchup.team2Score!
        }))
      };

      // Call add_booking_scores function
      const { data, error } = await supabase.rpc('add_booking_scores', {
        p_user_id: userId,
        p_booking_id: bookingId,
        p_scores: scoresPayload
      });

      if (error) {
        console.error('Error adding booking scores:', error);
        toast.error("Failed to save scores");
        setIsSubmitting(false);
        return false;
      }

      // Check if the response indicates success
      if (data && typeof data === 'object' && 'success' in data && !data.success) {
        const errorMessage = 'message' in data && typeof data.message === 'string' 
          ? data.message 
          : "Failed to save scores";
        toast.error(errorMessage);
        setIsSubmitting(false);
        return false;
      }

      toast.success(`Successfully saved ${matchupsToSubmit.length} match${matchupsToSubmit.length > 1 ? 'es' : ''}!`);
      setIsSubmitting(false);
      return true;
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
    allSetScores,
    setScores,
    submitResults,
    isSubmitting
  };
}
