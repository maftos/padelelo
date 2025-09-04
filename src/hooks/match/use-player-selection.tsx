
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/use-user-profile";

const STORAGE_KEY = "last_match_players";

export interface PlayerOption {
  id: string;
  name: string;
  profile_photo?: string;
}

export function usePlayerSelection() {
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [player3, setPlayer3] = useState("");
  const [player4, setPlayer4] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { userId } = useUserProfile();

  // Load last selected players from localStorage
  useEffect(() => {
    const savedPlayers = localStorage.getItem(STORAGE_KEY);
    if (savedPlayers) {
      const { player1, player2, player3, player4 } = JSON.parse(savedPlayers);
      setPlayer1(player1 || "");
      setPlayer2(player2 || "");
      setPlayer3(player3 || "");
      setPlayer4(player4 || "");
    }
  }, []);

  // Save selected players to localStorage whenever they change
  useEffect(() => {
    if (player1 || player2 || player3 || player4) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ player1, player2, player3, player4 })
      );
    }
  }, [player1, player2, player3, player4]);

  const { data: leaderboardPlayers = [], isLoading: isLoadingFriends } = useQuery({
    queryKey: ['leaderboard-players', userId],
    queryFn: async () => {
      if (!userId) return [];
      try {
        const { data, error } = await supabase
          .from('users_sorted_by_mmr' as any)
          .select('id, first_name, last_name, profile_photo, current_mmr')
          .neq('id', userId); // Exclude current user from the list
          
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching leaderboard players:', error);
        throw error;
      }
    },
    enabled: !!userId,
  });

  // Filter player options based on search query
  const playerOptions: PlayerOption[] = [
    { id: userId || "current-user", name: "Me" },
    ...((leaderboardPlayers as any[]) || [])
      .filter((player: any) => {
        const displayName = `${player.first_name || ''} ${player.last_name || ''}`.trim();
        return displayName.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .map((player: any) => ({
        id: player.id,
        name: `${player.first_name || ''} ${player.last_name || ''}`.trim(),
        profile_photo: player.profile_photo
      }))
  ];

  const getPlayerName = (playerId: string) => {
    if (playerId === userId) return "Me";
    const player = ((leaderboardPlayers as any[]) || []).find((p: any) => p.id === playerId);
    return player ? `${player.first_name || ''} ${player.last_name || ''}`.trim() : "Unknown";
  };

  return {
    player1,
    setPlayer1,
    player2,
    setPlayer2,
    player3,
    setPlayer3,
    player4,
    setPlayer4,
    searchQuery,
    setSearchQuery,
    playerOptions,
    getPlayerName,
    isLoadingFriends
  };
}
