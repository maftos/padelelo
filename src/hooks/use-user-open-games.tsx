
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "./use-user-profile";

export interface UserOpenGame {
  match_id: string;
  team1_player1_id: string;
  team1_player2_id: string | null;
  team2_player1_id: string | null;
  team2_player2_id: string | null;
  match_date: string;
  location: string | null;
  created_at: string;
  status: string;
}

export function useUserOpenGames() {
  const { userId } = useUserProfile();

  // Using mock data for now - games where user is a participant but not all spots are filled
  const mockOpenGames: UserOpenGame[] = [
    {
      match_id: "open-1",
      team1_player1_id: userId || "",
      team1_player2_id: null,
      team2_player1_id: null,
      team2_player2_id: null,
      match_date: "2024-01-18T18:00:00Z",
      location: "venue1",
      created_at: "2024-01-10T10:00:00Z",
      status: "INCOMPLETE"
    }
  ];

  const { data: openGames = [], isLoading } = useQuery({
    queryKey: ['user-open-games', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      // Return mock data for now
      return mockOpenGames;
    },
    enabled: !!userId,
  });

  return {
    openGames,
    isLoading
  };
}
