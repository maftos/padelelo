
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MMRData {
  team1_avg_mmr: number;
  team2_avg_mmr: number;
  team1_expected_win_rate: number;
  team2_expected_win_rate: number;
  team1_win_mmr_change_amount: number;
  team2_win_mmr_change_amount: number;
  selectedPartnerId: string;
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

export function useMMRCalculation(userId: string | undefined) {
  const [matchId, setMatchId] = useState<string | null>(null);
  const [mmrData, setMmrData] = useState<MMRData | null>(null);
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
      
      // Create a closed booking first
      const { data: bookingData, error: bookingError } = await supabase.rpc('create_booking_closed', {
        p_user_a_id: userId!,
        p_user_ids: [player1, team1Player2Id, player2, player3, player4].filter(p => p !== team1Player2Id && p !== player1).slice(0, 2).concat([team1Player2Id]),
        p_venue_id: '', // Will need to be provided or made optional
        p_start_time: new Date(date).toISOString(),
        p_fee: 0,
        p_description: 'MMR calculation preview'
      });

      if (bookingError) {
        console.error('Booking creation error:', bookingError);
        throw bookingError;
      }

      // Type assertion for the booking data
      const typedBookingData = bookingData as unknown as BookingResponse;
      const bookingId = typedBookingData?.booking_id;
      if (!bookingId) {
        throw new Error('No booking ID returned from create_booking_closed');
      }

      const { data: newMatch, error: matchError } = await supabase
        .from('matches')
        .insert({
          booking_id: bookingId,
          created_by: userId!,
          status: 'PENDING'
        })
        .select()
        .single();

      if (matchError) {
        console.error('Match creation error:', matchError);
        throw matchError;
      }

      const createdMatchId = newMatch.match_id;
      setMatchId(createdMatchId);

      // Insert match players
      const otherPlayers = [player2, player3, player4].filter(p => p !== team1Player2Id && p !== player1);
      const matchPlayers = [
        { match_id: createdMatchId, player_id: player1, team_number: 1, position: 'left' },
        { match_id: createdMatchId, player_id: team1Player2Id, team_number: 1, position: 'right' },
        { match_id: createdMatchId, player_id: otherPlayers[0], team_number: 2, position: 'left' },
        { match_id: createdMatchId, player_id: otherPlayers[1], team_number: 2, position: 'right' }
      ];

      const { error: playersError } = await supabase
        .from('match_players')
        .insert(matchPlayers);

      if (playersError) {
        console.error('Match players error:', playersError);
        throw playersError;
      }

      const { data: mmrCalcData, error: mmrError } = await supabase.rpc('calculate_mmr_change', {
        match_id: createdMatchId
      });

      if (mmrError) {
        console.error('MMR calculation error:', mmrError);
        throw mmrError;
      }

      if (!mmrCalcData || (Array.isArray(mmrCalcData) && mmrCalcData.length === 0)) {
        throw new Error('No MMR data returned from calculate_mmr_change');
      }

      const mmrResult = Array.isArray(mmrCalcData) ? mmrCalcData[0] : mmrCalcData;
      setMmrData({...mmrResult, selectedPartnerId: team1Player2Id});
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
