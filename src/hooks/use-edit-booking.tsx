import { supabase } from "@/integrations/supabase/client";

interface EditBookingParams {
  p_user_id: string;
  p_booking_id: string;
  p_player_ids: string[];
  p_title?: string | null;
  p_description?: string | null;
  p_venue_id?: string | null;
  p_start_time?: string | null;
  p_end_time?: string | null;
  p_booking_fee_per_player?: number | null;
}

export const useEditBooking = () => {
  const editBooking = async (params: EditBookingParams) => {
    try {
      console.log('edit_booking params:', params);
      
      // Use the underlying supabase client to call the function directly
      // Pass player_ids array directly - Supabase RPC will handle JSONB conversion
      const response = await supabase.rpc('edit_booking' as any, params);
      console.log('edit_booking response:', response);
      return response;
    } catch (error) {
      console.error('Error calling edit_booking:', error);
      throw error;
    }
  };

  return { editBooking };
};