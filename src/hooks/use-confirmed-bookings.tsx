import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ConfirmedBooking {
  booking_id: string;
  start_time: string;
  venue_name: string;
  status: string;
  participants: Array<{
    player_id: string;
    first_name: string;
    last_name: string;
    profile_photo: string;
  }>;
}

export const useConfirmedBookings = () => {
  const { user } = useAuth();

  const { data: confirmedBookings = [], isLoading, error } = useQuery({
    queryKey: ['confirmed-bookings', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          booking_id,
          start_time,
          venues!inner(name),
          status,
          booking_players!inner(
            player_id,
            users!inner(
              id,
              first_name,
              last_name,
              profile_photo
            )
          )
        `)
        .eq('booking_players.player_id', user.id)
        .eq('status', 'CLOSED');

      if (error) throw error;

      // Transform the data to match ConfirmedBooking interface
      return (data || []).map((booking: any) => ({
        booking_id: booking.booking_id,
        start_time: booking.start_time,
        venue_name: booking.venues?.name || 'Unknown Venue',
        status: booking.status,
        participants: booking.booking_players?.map((bp: any) => ({
          player_id: bp.users.id,
          first_name: bp.users.first_name,
          last_name: bp.users.last_name,
          profile_photo: bp.users.profile_photo
        })) || []
      })) as ConfirmedBooking[];
    },
    enabled: !!user?.id
  });

  return {
    confirmedBookings,
    isLoading,
    error
  };
};