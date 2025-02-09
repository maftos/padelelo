
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Score } from "./use-score-handling";

export function useMatchSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitMatch = async (
    userId: string | undefined,
    matchId: string | null,
    mmrData: any,
    scores: Score[]
  ) => {
    if (!userId) {
      toast.error("You must be logged in to complete a match");
      return false;
    }

    if (!matchId || !mmrData) {
      toast.error("Match data not ready. Please try again.");
      return false;
    }

    const hasEmptyScores = scores.some(score => !score.team1 || !score.team2);
    if (hasEmptyScores) {
      toast.error("Please fill in all score fields");
      return false;
    }

    if (scores[0].team1 === scores[0].team2) {
      toast.error("Scores cannot be equal - there must be a winner!");
      return false;
    }

    try {
      setIsSubmitting(true);
      const { error: completeError } = await supabase.rpc('complete_match', {
        i_match_id: matchId,
        new_team1_score: parseInt(scores[0].team1),
        new_team2_score: parseInt(scores[0].team2),
        team1_win_mmr_change_amount: mmrData.team1_win_mmr_change_amount,
        team2_win_mmr_change_amount: mmrData.team2_win_mmr_change_amount,
        user_a_id: userId
      });

      if (completeError) throw completeError;

      toast.success("Match registered successfully!");
      return true;
    } catch (error) {
      console.error('Error completing match:', error);
      toast.error("Failed to register match. Please try again.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitMatch
  };
}
