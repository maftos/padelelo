
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useMMRCalculation(userId: string | undefined) {
  const [matchId, setMatchId] = useState<string | null>(null);
  const [mmrData, setMmrData] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateMMR = async (
    team1Player2Id: string,
    player1: string,
    player2: string,
    player3: string,
    player4: string,
    date: string
  ) => {
    try {
      setIsCalculating(true);
      
      const { data: matchData, error: matchError } = await supabase.rpc('create_match', {
        user_a_id: userId,
        team1_player1_id: player1,
        team1_player2_id: team1Player2Id,
        team2_player1_id: [player2, player3, player4].find(p => p !== team1Player2Id && p !== player1),
        team2_player2_id: [player2, player3, player4].find(p => p !== team1Player2Id && p !== player1 && p !== [player2, player3, player4].find(p => p !== team1Player2Id && p !== player1)),
        match_date: new Date(date).toISOString()
      });

      if (matchError) {
        console.error('Match creation error:', matchError);
        throw matchError;
      }

      if (!matchData) {
        throw new Error('No match ID returned from create_match');
      }

      setMatchId(matchData);

      const { data: mmrCalcData, error: mmrError } = await supabase.rpc('calculate_mmr_change', {
        match_id: matchData
      });

      if (mmrError) {
        console.error('MMR calculation error:', mmrError);
        throw mmrError;
      }

      if (!mmrCalcData || mmrCalcData.length === 0) {
        throw new Error('No MMR data returned from calculate_mmr_change');
      }

      setMmrData({...mmrCalcData[0], selectedPartnerId: team1Player2Id});
      return true;
    } catch (error) {
      console.error('Error preparing match:', error);
      toast.error("Failed to prepare match. Please try again.");
      return false;
    } finally {
      setIsCalculating(false);
    }
  };

  return {
    matchId,
    mmrData,
    isCalculating,
    calculateMMR
  };
}
