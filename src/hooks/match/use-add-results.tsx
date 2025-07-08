import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Matchup {
  id: string;
  team1: [string, string];
  team2: [string, string];
}

interface SetScore {
  setNumber: number;
  team1Score: number;
  team2Score: number;
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
      // For each matchup, create a match record and set scores
      for (const matchup of matchups) {
        const setScores = allSetScores[matchup.id] || [];
        
        if (setScores.length === 0) {
          toast.error(`No sets recorded for one of the matches`);
          setIsSubmitting(false);
          return false;
        }

        // Create match record using the create_match function
        const { data: matchIdData, error: matchError } = await supabase.rpc('create_match', {
          user_a_id: matchup.team1[0], // Use first player as creator
          team1_player1_id: matchup.team1[0],
          team1_player2_id: matchup.team1[1],
          team2_player1_id: matchup.team2[0],
          team2_player2_id: matchup.team2[1]
        });

        if (matchError) {
          console.error('Error creating match:', matchError);
          toast.error("Failed to create match record");
          setIsSubmitting(false);
          return false;
        }

        const createdMatchId = matchIdData;

        // Add set scores
        for (const setScore of setScores) {
          const { error: setError } = await supabase
            .from('match_sets')
            .insert({
              match_id: createdMatchId,
              set_number: setScore.setNumber,
              team1_score: setScore.team1Score,
              team2_score: setScore.team2Score
            });

          if (setError) {
            console.error('Error adding set score:', setError);
            toast.error("Failed to save set scores");
            setIsSubmitting(false);
            return false;
          }
        }

        // Calculate overall match winner and complete the match
        const team1SetWins = setScores.filter(set => set.team1Score > set.team2Score).length;
        const team2SetWins = setScores.filter(set => set.team2Score > set.team1Score).length;
        
        const team1MatchScore = team1SetWins;
        const team2MatchScore = team2SetWins;

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

        // Complete the match
        const { error: completeError } = await supabase.rpc('complete_match', {
          i_match_id: createdMatchId,
          new_team1_score: team1MatchScore,
          new_team2_score: team2MatchScore,
          team1_win_mmr_change_amount: mmrData[0]?.team1_win_mmr_change_amount || 20,
          team2_win_mmr_change_amount: mmrData[0]?.team2_win_mmr_change_amount || 20,
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