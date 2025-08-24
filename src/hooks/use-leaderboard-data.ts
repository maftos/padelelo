
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LeaderboardPlayer } from "@/types/leaderboard";

interface UseLeaderboardDataProps {
  page?: number;
  limit?: number;
}

export const useLeaderboardData = ({ page = 1, limit = 25 }: UseLeaderboardDataProps = {}) => {
  const offset = (page - 1) * limit;
  
  return useQuery({
    queryKey: ['leaderboard', page, limit],
    queryFn: async () => {
      const { data, error, count } = await supabase
        .from('users_sorted_by_mmr' as any)
        .select('id, first_name, last_name, profile_photo, current_mmr, nationality, gender', { count: 'exact' })
        .range(offset, offset + limit - 1) as any;

      if (error) throw error;
      
      // Transform the data to match LeaderboardPlayer interface
      const players = data?.map((user: any) => ({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_photo: user.profile_photo,
        current_mmr: user.current_mmr || 0,
        nationality: user.nationality,
        gender: user.gender
      })) as LeaderboardPlayer[] || [];
      
      return {
        players,
        totalCount: count || 0,
        currentPage: page,
        totalPages: Math.ceil((count || 0) / limit)
      };
    },
  });
};
