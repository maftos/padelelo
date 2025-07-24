import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface BookingDetails {
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
  booking_fee_per_player?: number;
  participants: Array<{
    player_id: string;
    first_name: string;
    last_name: string;
    profile_photo: string;
    current_mmr?: number;
  }>;
  applications?: Array<{
    id: string;
    player_id: string;
    first_name: string;
    last_name: string;
    profile_photo: string;
    current_mmr: number;
    status: string;
    message: string;
    created_at: string;
    updated_at: string;
  }>;
}

export const useBookingDetails = (bookingId: string | undefined) => {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['booking-details', bookingId, user?.id],
    queryFn: async () => {
      if (!user?.id || !bookingId) throw new Error('User not authenticated or booking ID missing');

      // Use the public.view_booking function
      const { data: bookingResponse, error: bookingError } = await supabase
        .rpc('view_booking' as any, { 
          p_user_id: user.id, 
          p_booking_id: bookingId 
        });

      if (bookingError) throw bookingError;
      if (!bookingResponse) throw new Error('Booking not found');

      // The function returns JSON with a specific structure
      const response = bookingResponse as any;
      
      if (!response.success || !response.booking) {
        throw new Error('Booking not found');
      }

      // Transform the response to match our BookingDetails interface
      const bookingDetails: BookingDetails = {
        booking_id: response.booking.booking_id,
        venue_id: response.booking.venue_id,
        venue_name: response.booking.venue_name,
        start_time: response.booking.start_time,
        title: response.booking.title || '',
        description: response.booking.description || '',
        status: response.booking.status,
        player_count: response.player_count || response.players?.length || 0,
        created_at: response.booking.created_at,
        created_by: response.booking.created_by,
        is_creator: response.user_context?.is_creator || false,
        booking_fee_per_player: response.booking.booking_fee_per_player,
        participants: response.players?.map((player: any) => ({
          player_id: player.user_id,
          first_name: player.first_name || '',
          last_name: player.last_name || '',
          profile_photo: player.profile_photo || '',
          current_mmr: player.current_mmr
        })) || []
      };

      return bookingDetails;
    },
    enabled: !!user?.id && !!bookingId
  });

  return {
    booking: data,
    isLoading,
    error
  };
};