
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

export function useAddResults(matchId: string) {
  const [matchups, setMatchups] = useState<Matchup[]>([]);
  const [allSetScores, setAllSetScores] = useState<{ [matchupId: string]: SetScore[] }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setScores = (matchupId: string, setScores: SetScore[]) => {
    setAllSetScores(prev => ({
      ...prev,
      [matchupId]: setScores
    }));
  };

  const submitResults = async () => {
    setIsSubmitting(true);
    
    try {
      // For each matchup, create a booking and match record
      for (const matchup of matchups) {
        if (!matchup.team1Score && matchup.team1Score !== 0 || !matchup.team2Score && matchup.team2Score !== 0) {
          toast.error(`Please enter scores for all matches`);
          setIsSubmitting(false);
          return false;
        }

        // Create a closed booking for this specific match
        const { data: bookingData, error: bookingError } = await supabase.rpc('create_booking_closed', {
          p_user_a_id: matchup.team1[0], // Use first player as creator
          p_user_ids: [matchup.team1[0], matchup.team1[1], matchup.team2[0], matchup.team2[1]],
          p_venue_id: '', // We'll need to get this from context or make it optional
          p_start_time: new Date().toISOString(), // Current time for now
          p_fee: 0,
          p_title: 'Match Result',
          p_description: 'Match result entry'
        });

        if (bookingError) {
          console.error('Error creating booking:', bookingError);
          toast.error("Failed to create booking for match");
          setIsSubmitting(false);
          return false;
        }

        // Type assertion for the booking data
        const typedBookingData = bookingData as unknown as BookingResponse;
        const bookingId = typedBookingData?.booking_id;
        if (!bookingId) {
          toast.error("Failed to get booking ID");
          setIsSubmitting(false);
          return false;
        }

        // Create a match record linked to this booking
        const { data: newMatch, error: matchError } = await supabase
          .from('matches')
          .insert({
            booking_id: bookingId,
            created_by: matchup.team1[0],
            status: 'PENDING'
          })
          .select()
          .single();

        if (matchError) {
          console.error('Error creating match:', matchError);
          toast.error("Failed to create match record");
          setIsSubmitting(false);
          return false;
        }

        const createdMatchId = newMatch.match_id;

        // Insert match players
        const matchPlayers = [
          { match_id: createdMatchId, player_id: matchup.team1[0], team_number: 1, position: 'left' },
          { match_id: createdMatchId, player_id: matchup.team1[1], team_number: 1, position: 'right' },
          { match_id: createdMatchId, player_id: matchup.team2[0], team_number: 2, position: 'left' },
          { match_id: createdMatchId, player_id: matchup.team2[1], team_number: 2, position: 'right' }
        ];

        const { error: playersError } = await supabase
          .from('match_players')
          .insert(matchPlayers);

        if (playersError) {
          console.error('Error adding match players:', playersError);
          toast.error("Failed to add match players");
          setIsSubmitting(false);
          return false;
        }

        // Add single set score (treating each match as one set)
        const { error: setError } = await supabase
          .from('match_sets')
          .insert({
            match_id: createdMatchId,
            set_number: 1,
            team1_score: matchup.team1Score!,
            team2_score: matchup.team2Score!
          });

        if (setError) {
          console.error('Error adding set score:', setError);
          toast.error("Failed to save set scores");
          setIsSubmitting(false);
          return false;
        }

        // Calculate MMR change
        const { data: mmrData, error: mmrError } = await supabase.rpc('calculate_mmr_change', {
          match_id: createdMatchId
        });

        if (mmrError) {
          console.error('Error calculating MMR:', mmrError);
          toast.error("Failed to calculate MMR changes");
          setIsSubmitting(false);
          return false;
        }

        // Use the scores directly as match scores
        const team1MatchScore = matchup.team1Score!;
        const team2MatchScore = matchup.team2Score!;

        // Get MMR change amounts from the first result
        const mmrResult = Array.isArray(mmrData) ? mmrData[0] : mmrData;
        const team1WinMmrChange = mmrResult?.team1_win_mmr_change_amount || 20;
        const team2WinMmrChange = mmrResult?.team2_win_mmr_change_amount || 20;

        // Complete the match
        const { error: completeError } = await supabase.rpc('complete_match', {
          i_match_id: createdMatchId,
          new_team1_score: team1MatchScore,
          new_team2_score: team2MatchScore,
          team1_win_mmr_change_amount: team1WinMmrChange,
          team2_win_mmr_change_amount: team2WinMmrChange,
          user_a_id: matchup.team1[0]
        });

        if (completeError) {
          console.error('Error completing match:', completeError);
          toast.error("Failed to complete match");
          setIsSubmitting(false);
          return false;
        }
      }

      toast.success(`Successfully saved ${matchups.length} match${matchups.length > 1 ? 'es' : ''}!`);
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
