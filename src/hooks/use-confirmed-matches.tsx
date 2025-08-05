
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

      const { data, error } = await supabase
        .rpc('get_my_completed_matches', {
          user_a_id: user.id,
          page_number: 1,
          page_size: 50
        });

      if (error) throw error;

      // Handle the case where data might be null
      if (!data) return [];

      // get_my_completed_matches returns the matches directly
      return Array.isArray(data) ? data as unknown as ConfirmedMatch[] : [];
    },
    enabled: !!user?.id
  });

  return {
    confirmedMatches,
    isLoading,
    error
  };
};
