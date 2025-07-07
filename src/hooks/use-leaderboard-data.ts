
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LeaderboardPlayer } from "@/types/leaderboard";

export const useLeaderboardData = () => {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, first_name, last_name, profile_photo, current_mmr, nationality, gender')
        .order('current_mmr', { ascending: false })
        .limit(25);

      if (error) throw error;
      
      // Transform the data to match LeaderboardPlayer interface
      return data?.map(user => ({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_photo: user.profile_photo,
        current_mmr: user.current_mmr || 0,
        nationality: user.nationality,
        gender: user.gender
      })) as LeaderboardPlayer[] || [];
    },
  });
};
