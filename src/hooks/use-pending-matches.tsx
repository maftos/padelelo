
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUserProfile } from "./use-user-profile";

export interface PendingMatch {
  match_id: string;
  team1_player1_id: string;
  team1_player2_id: string;
  team2_player1_id: string;
  team2_player2_id: string;
  match_date: string;
}

export function usePendingMatches() {
  const { userId } = useUserProfile();
  const queryClient = useQueryClient();

  // Using mock data for now - only 2 matches
  const mockPendingMatches: PendingMatch[] = [
    {
      match_id: "1",
      team1_player1_id: userId || "",
      team1_player2_id: "player2",
      team2_player1_id: "player3", 
      team2_player2_id: "player4",
      match_date: "2024-01-15T14:00:00Z"
    },
    {
      match_id: "2", 
      team1_player1_id: userId || "",
      team1_player2_id: "player5",
      team2_player1_id: "player6",
      team2_player2_id: "player7", 
      match_date: "2024-01-16T16:30:00Z"
    }
  ];

  const { data: pendingMatches = [], isLoading } = useQuery({
    queryKey: ['pending-matches', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      // Return mock data for now
      return mockPendingMatches;
    },
    enabled: !!userId,
  });

  const deletePendingMatch = useMutation({
    mutationFn: async (matchId: string) => {
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('match_id', matchId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-matches'] });
      toast.success("Match deleted successfully");
    },
    onError: (error) => {
      console.error('Error deleting match:', error);
      toast.error("Failed to delete match");
    },
  });

  return {
    pendingMatches,
    isLoading,
    deletePendingMatch: deletePendingMatch.mutate,
    isDeletingMatch: deletePendingMatch.isPending
  };
}
