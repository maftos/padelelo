
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "./use-user-profile";

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

export function useOpenGames() {
  const { userId } = useUserProfile();

  const { data: openGames = [], isLoading } = useQuery({
    queryKey: ['open-games', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase.rpc('get_bookings_open', {
        p_user_id: userId
      });

      if (error) {
        console.error('Error fetching open games:', error);
        throw error;
      }

      return (data as unknown) as OpenGame[];
    },
    enabled: !!userId,
  });

  return {
    openGames,
    isLoading
  };
}
