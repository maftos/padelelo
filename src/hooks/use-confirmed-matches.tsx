
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ConfirmedMatch {
  match_id: string;
  match_date: string;
  venue_name: string;
  status: string;
  team1_player1_id: string;
  team1_player1_name: string;
  team1_player1_photo: string;
  team1_player2_id: string;
  team1_player2_name: string;
  team1_player2_photo: string;
  team2_player1_id: string;
  team2_player1_name: string;
  team2_player1_photo: string;
  team2_player2_id: string;
  team2_player2_name: string;
  team2_player2_photo: string;
  team1_total_score: number;
  team2_total_score: number;
  sets: Array<{
    set_number: number;
    team1_score: number;
    team2_score: number;
  }>;
  user_mmr_change: number;
  user_old_mmr: number;
  user_new_mmr: number;
  change_type: string;
}

export const useConfirmedMatches = () => {
  const { user } = useAuth();

  const { data: confirmedMatches = [], isLoading, error } = useQuery({
    queryKey: ['confirmed-matches', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      // Use raw SQL to call the function since it's not in the types
      const { data: rawData, error: sqlError } = await supabase.rpc('get_my_matches' as any, {
        user_a_id: user.id,
        page_number: 1,
        page_size: 50
      });

      if (sqlError) throw sqlError;
      if (!rawData) return [];

      // Transform the nested response into flat match records
      const matches: ConfirmedMatch[] = [];
      const bookingsData = rawData as any[];
      
      if (Array.isArray(bookingsData)) {
        for (const booking of bookingsData) {
          if (booking.matches && Array.isArray(booking.matches)) {
            for (const match of booking.matches) {
              // Calculate total scores from sets
              const team1_total_score = match.sets?.reduce((sum: number, set: any) => sum + (set.team1_score || 0), 0) || 0;
              const team2_total_score = match.sets?.reduce((sum: number, set: any) => sum + (set.team2_score || 0), 0) || 0;
              
              // Get user's MMR change from the first set (assuming consistent per match)
              const firstSetRating = match.sets?.[0]?.rating_change;
              const user_mmr_change = firstSetRating?.change_amount || 0;
              const change_type = firstSetRating?.change_type || (user_mmr_change > 0 ? 'WIN' : 'LOSS');

              matches.push({
                match_id: match.match_id,
                match_date: booking.start_time,
                venue_name: booking.venue_name || 'Unknown Venue',
                status: 'COMPLETED',
                team1_player1_id: match.team1?.player1?.id || '',
                team1_player1_name: `${match.team1?.player1?.first_name || ''} ${match.team1?.player1?.last_name || ''}`.trim(),
                team1_player1_photo: match.team1?.player1?.profile_photo || '',
                team1_player2_id: match.team1?.player2?.id || '',
                team1_player2_name: `${match.team1?.player2?.first_name || ''} ${match.team1?.player2?.last_name || ''}`.trim(),
                team1_player2_photo: match.team1?.player2?.profile_photo || '',
                team2_player1_id: match.team2?.player1?.id || '',
                team2_player1_name: `${match.team2?.player1?.first_name || ''} ${match.team2?.player1?.last_name || ''}`.trim(),
                team2_player1_photo: match.team2?.player1?.profile_photo || '',
                team2_player2_id: match.team2?.player2?.id || '',
                team2_player2_name: `${match.team2?.player2?.first_name || ''} ${match.team2?.player2?.last_name || ''}`.trim(),
                team2_player2_photo: match.team2?.player2?.profile_photo || '',
                team1_total_score,
                team2_total_score,
                sets: match.sets?.map((set: any) => ({
                  set_number: set.set_number,
                  team1_score: set.team1_score,
                  team2_score: set.team2_score
                })) || [],
                user_mmr_change,
                user_old_mmr: 0, // Will be calculated from ratings history if needed
                user_new_mmr: 0, // Will be calculated from ratings history if needed
                change_type
              });
            }
          }
        }
      }

      return matches;
    },
    enabled: !!user?.id
  });

  return {
    confirmedMatches,
    isLoading,
    error
  };
};
