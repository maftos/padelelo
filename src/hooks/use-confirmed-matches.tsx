
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ConfirmedMatch {
  booking_id: string;
  venue_id: string;
  venue_name: string;
  start_time: string;
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

export const useConfirmedMatches = () => {
  const { user } = useAuth();

  const { data: confirmedMatches = [], isLoading, error } = useQuery({
    queryKey: ['confirmed-matches', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .rpc('get_bookings_closed', {
          p_user_id: user.id
        });

      if (error) throw error;

      // Handle the case where data might be null
      if (!data) return [];

      // Extract bookings from the response structure
      const responseData = data as any;
      if (responseData?.bookings && Array.isArray(responseData.bookings)) {
        return responseData.bookings;
      }

      return [];
    },
    enabled: !!user?.id
  });

  return {
    confirmedMatches,
    isLoading,
    error
  };
};
