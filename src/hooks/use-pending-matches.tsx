
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
  created_at: string;
}

export function usePendingMatches() {
  const { userId } = useUserProfile();
  const queryClient = useQueryClient();

  const { data: pendingMatches = [], isLoading } = useQuery({
    queryKey: ['pending-matches', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('status', 'PENDING')
        .or(`team1_player1_id.eq.${userId},team1_player2_id.eq.${userId},team2_player1_id.eq.${userId},team2_player2_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PendingMatch[];
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
