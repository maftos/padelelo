
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface WizardData {
  selectedPlayers: string[];
  venueId: string;
  location: string;
  matchDate: string;
  matchTime: string;
  feePerPlayer: string;
  gameDescription: string;
}

export function useBookingSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { profile } = useUserProfile();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const submitBooking = async (wizardData: WizardData) => {
    if (!profile?.id) {
      toast.error("You must be logged in to create a booking");
      return false;
    }

    setIsSubmitting(true);

    try {
      const isOpenGame = wizardData.selectedPlayers.length < 4;
      
      if (isOpenGame) {
        // Use create_booking_open for incomplete bookings
        const startDateTime = new Date(`${wizardData.matchDate}T${wizardData.matchTime}`);
        
        const { data, error } = await supabase.rpc('create_booking_open' as any, {
          p_user_ids: wizardData.selectedPlayers,
          p_venue_id: wizardData.venueId,
          p_start_time: startDateTime.toISOString(),
          p_fee: parseFloat(wizardData.feePerPlayer) || 0,
          p_description: wizardData.gameDescription || null
        });

        if (error) {
          console.error('Error creating open booking:', error);
          toast.error("Failed to create open booking");
          return false;
        }

        toast.success("Open game published successfully!");
        queryClient.invalidateQueries({ queryKey: ['active-bookings-count'] });
        queryClient.invalidateQueries({ queryKey: ['open-bookings-count'] });
        navigate("/manage-bookings");
        return true;
      } else {
        // Use create_booking_closed for complete bookings (closed games)
        const startDateTime = new Date(`${wizardData.matchDate}T${wizardData.matchTime}`);
        
        // Create optimistic booking for immediate UI feedback
        const optimisticBooking = {
          booking_id: `optimistic-${Date.now()}`,
          venue_name: wizardData.location,
          start_time: startDateTime.toISOString(),
          status: 'CLOSED',
          participants: wizardData.selectedPlayers.map((playerId) => ({
            player_id: playerId,
            first_name: 'Loading...',
            last_name: '',
            profile_photo: ''
          })),
          _isOptimistic: true
        };

        // Optimistically update the query cache
        queryClient.setQueryData(['confirmed-bookings', profile.id], (oldData: any) => {
          return oldData ? [optimisticBooking, ...oldData] : [optimisticBooking];
        });

        const { data, error } = await supabase.rpc('create_booking_closed' as any, {
          p_user_ids: wizardData.selectedPlayers,
          p_venue_id: wizardData.venueId,
          p_start_time: startDateTime.toISOString(),
          p_fee: parseFloat(wizardData.feePerPlayer) || 0,
          p_description: wizardData.gameDescription || null
        });

        if (error) {
          console.error('Error creating closed booking:', error);
          // Remove optimistic update on error
          queryClient.setQueryData(['confirmed-bookings', profile.id], (oldData: any) => {
            return oldData ? oldData.filter((booking: any) => booking.booking_id !== optimisticBooking.booking_id) : [];
          });
          toast.error("Failed to create booking");
          return false;
        }

        toast.success("Booking created successfully!");
        
        // Invalidate to get real data from server
        queryClient.invalidateQueries({ queryKey: ['confirmed-bookings'] });
        queryClient.invalidateQueries({ queryKey: ['active-bookings-count'] });
        
        navigate("/manage-bookings");
        return true;
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast.error("An unexpected error occurred");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitBooking,
    isSubmitting
  };
}
