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

      // Use the get_bookings_closed function to get proper data
      const { data, error } = await supabase.rpc('get_bookings_closed', {
        p_user_id: user.id
      });

      if (error) throw error;

      // Type assertion for the JSON array response
      const bookings = Array.isArray(data) ? data : [];
      
      // Transform the data to match ConfirmedBooking interface
      return bookings.map((booking: any) => ({
        booking_id: booking.booking_id,
        start_time: booking.start_time,
        venue_name: booking.venue_name || 'Unknown Venue',
        status: booking.status,
        participants: booking.participants?.map((participant: any) => ({
          player_id: participant.player_id,
          first_name: participant.first_name,
          last_name: participant.last_name,
          profile_photo: participant.profile_photo
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