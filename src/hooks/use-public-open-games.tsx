
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface PublicOpenGame {
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
  participants: Array<{
    player_id: string;
    first_name: string;
    last_name: string;
    profile_photo: string;
    current_mmr: number;
    payment_status: string;
    payment_amount: number;
    payment_currency: string;
    payment_date: string;
  }>;
}

export const usePublicOpenGames = (sortBy: string = 'created_at_desc') => {
  const { user } = useAuth();

  // Map sort options to database function parameters
  const getSortParameter = (sortOption: string) => {
    switch (sortOption) {
      case 'newest':
        return 'created_at_desc';
      case 'soonest':
        return 'start_time_asc';
      default:
        return 'created_at_desc';
    }
  };

  const { data: publicOpenGames = [], isLoading, error } = useQuery({
    queryKey: ['public-open-games', sortBy],
    queryFn: async () => {
      const sortParameter = getSortParameter(sortBy);
      
      const { data, error } = await supabase
        .rpc('view_open_bookings', {
          p_user_id: user?.id || '00000000-0000-0000-0000-000000000000',
          p_sort_by: sortParameter
        });

      if (error) throw error;

      // Handle the case where data might be null
      if (!data) return [];

      return (data as unknown) as PublicOpenGame[];
    }
  });

  return {
    publicOpenGames,
    isLoading,
    error
  };
};
