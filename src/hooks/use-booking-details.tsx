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
      const { data: response, error: bookingError } = await supabase
        .rpc('view_booking' as any, { 
          p_user_id: user.id, 
          p_booking_id: bookingId 
        });

      if (bookingError) throw bookingError;
      if (!response) throw new Error('Booking not found');

      // The function returns JSON, so we need to properly parse and transform it
      const bookingData = response as any;
      
      // Transform the response to match our BookingDetails interface
      const bookingDetails: BookingDetails = {
        booking_id: bookingData.booking_id,
        venue_id: bookingData.venue_id,
        venue_name: bookingData.venue_name,
        start_time: bookingData.start_time,
        title: bookingData.title || '',
        description: bookingData.description || '',
        status: bookingData.status,
        player_count: bookingData.player_count || 0,
        created_at: bookingData.created_at,
        created_by: bookingData.created_by,
        is_creator: bookingData.is_creator || false,
        booking_fee_per_player: bookingData.booking_fee_per_player,
        participants: bookingData.participants || [],
        applications: bookingData.applications || []
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