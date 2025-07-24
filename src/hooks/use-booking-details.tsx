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

      // Get booking data with venue and participants
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .select(`
          *,
          venues!inner(name)
        `)
        .eq('booking_id', bookingId)
        .single();

      if (bookingError) throw bookingError;
      if (!bookingData) throw new Error('Booking not found');

      // Get participants
      const { data: participants, error: participantsError } = await supabase
        .from('booking_players')
        .select(`
          player_id,
          users!inner(
            id,
            first_name,
            last_name,
            profile_photo,
            current_mmr
          )
        `)
        .eq('booking_id', bookingId);

      if (participantsError) throw participantsError;

      // Transform the data to match our interface
      const bookingDetails: BookingDetails = {
        booking_id: bookingData.booking_id,
        venue_id: bookingData.venue_id,
        venue_name: (bookingData.venues as any).name,
        start_time: bookingData.start_time,
        title: bookingData.title || '',
        description: bookingData.description || '',
        status: bookingData.status,
        player_count: participants?.length || 0,
        created_at: bookingData.created_at,
        created_by: bookingData.created_by,
        is_creator: bookingData.created_by === user.id,
        booking_fee_per_player: (bookingData as any).booking_fee_total ? (bookingData as any).booking_fee_total / 4 : undefined,
        participants: participants?.map((bp: any) => ({
          player_id: bp.users.id,
          first_name: bp.users.first_name || '',
          last_name: bp.users.last_name || '',
          profile_photo: bp.users.profile_photo || '',
          current_mmr: bp.users.current_mmr
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