
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface OpenGame {
  booking_id: string;
  venue_id: string;
  venue_name: string;
  start_time: string;
  title: string;
  description: string;
  status: string;
  player_count: number;
  created_at: string;
  created_by: string;
  is_creator: boolean;
  participants: Array<{
    player_id: string;
    first_name: string;
    last_name: string;
    profile_photo: string;
  }>;
}

export const useOpenGames = () => {
  const { user } = useAuth();

  const { data: openGames = [], isLoading, error } = useQuery({
    queryKey: ['open-games', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .rpc('get_bookings_open', {
          p_user_id: user.id
        });

      if (error) throw error;

      // Handle the case where data might be null
      if (!data) return [];

      // Assert the type since we know the structure from the function
      return (data as unknown) as OpenGame[];
    },
    enabled: !!user?.id
  });

  return {
    openGames,
    isLoading,
    error
  };
};
