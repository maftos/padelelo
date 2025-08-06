
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ConfirmedBooking {
  booking_id: string;
  start_time: string;
  venue_name: string;
  status: "MMR_CALCULATED" | "SCORE_RECORDED";
  mmr_before?: number;
  mmr_after?: number;
  matches: Array<{
    match_id: string;
    team1_player1_display_name: string;
    team1_player1_profile_photo: string;
    team1_player2_display_name: string;
    team1_player2_profile_photo: string;
    team2_player1_display_name: string;
    team2_player1_profile_photo: string;
    team2_player2_display_name: string;
    team2_player2_profile_photo: string;
    total_team1_score: number;
    total_team2_score: number;
    sets: Array<{
      set_number: number;
      team1_score: number;
      team2_score: number;
      result: "WIN" | "LOSS" | null;
      change_amount: number | null;
    }>;
  }>;
}

export const useConfirmedMatches = (page: number = 1, pageSize: number = 10) => {
  const { user } = useAuth();

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['confirmed-matches', user?.id, page, pageSize],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data: rawData, error: sqlError } = await supabase.rpc('get_my_matches' as any, {
        user_a_id: user.id,
        page_number: page,
        page_size: pageSize
      });

      if (sqlError) throw sqlError;
      if (!rawData) return { bookings: [], pagination: null };

      const result = rawData as any;
      const bookingsData = result.bookings || [];
      
      const bookings: ConfirmedBooking[] = bookingsData.map((booking: any) => {
        // Use the actual status from the API response, mapping API statuses to our interface
        const apiStatus = booking.status;
        const status = apiStatus === 'COMPLETED' ? 'MMR_CALCULATED' : 'SCORE_RECORDED';
        
        const transformedMatches = (booking.matches || []).map((match: any) => {
          // Count wins per team
          let team1_wins = 0;
          let team2_wins = 0;
          
          match.sets?.forEach((set: any) => {
            if (set.team1_score > set.team2_score) team1_wins++;
            else if (set.team2_score > set.team1_score) team2_wins++;
          });

          return {
            match_id: match.match_id,
            team1_player1_display_name: `${match.team1?.player1?.first_name || ''} ${match.team1?.player1?.last_name || ''}`.trim(),
            team1_player1_profile_photo: match.team1?.player1?.profile_photo || '',
            team1_player2_display_name: `${match.team1?.player2?.first_name || ''} ${match.team1?.player2?.last_name || ''}`.trim(),
            team1_player2_profile_photo: match.team1?.player2?.profile_photo || '',
            team2_player1_display_name: `${match.team2?.player1?.first_name || ''} ${match.team2?.player1?.last_name || ''}`.trim(),
            team2_player1_profile_photo: match.team2?.player1?.profile_photo || '',
            team2_player2_display_name: `${match.team2?.player2?.first_name || ''} ${match.team2?.player2?.last_name || ''}`.trim(),
            team2_player2_profile_photo: match.team2?.player2?.profile_photo || '',
            total_team1_score: team1_wins,
            total_team2_score: team2_wins,
            sets: (match.sets || []).map((set: any) => ({
              set_number: set.set_number,
              team1_score: set.team1_score,
              team2_score: set.team2_score,
              result: set.rating_change?.change_type === 'WIN' ? 'WIN' : 
                     set.rating_change?.change_type === 'LOSS' ? 'LOSS' : null,
              change_amount: set.rating_change?.change_amount || null
            }))
          };
        });

        return {
          booking_id: booking.booking_id,
          start_time: booking.start_time,
          venue_name: booking.venue_name || 'Unknown Venue',
          status,
          mmr_before: booking.mmr_before,
          mmr_after: booking.mmr_after,
          matches: transformedMatches
        };
      });

      return {
        bookings,
        pagination: result.pagination
      };
    },
    enabled: !!user?.id
  });

  return {
    confirmedMatches: response?.bookings || [],
    pagination: response?.pagination,
    isLoading,
    error
  };
};
