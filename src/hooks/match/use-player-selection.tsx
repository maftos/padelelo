
import { useState, useEffect, useMemo } from "react";
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

  const { data: leaderboardData, isLoading: isLoadingPlayers } = useQuery({
    queryKey: ['leaderboard-players', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('users_sorted_by_mmr' as any)
        .select('id, first_name, last_name, profile_photo, current_mmr, nationality, gender')
        .limit(100); // Limit to 100 players for performance

      // Add search filter if query exists
      if (searchQuery.trim()) {
        const searchTerm = `%${searchQuery.trim()}%`;
        query = query.or(`first_name.ilike.${searchTerm},last_name.ilike.${searchTerm}`);
      }

      const { data, error } = await query as any;
      if (error) throw error;
      
      return data || [];
    },
    enabled: true,
  });

  // Create player options with "Me" first, then leaderboard players
  const playerOptions: PlayerOption[] = useMemo(() => {
    const players = leaderboardData || [];
    const options: PlayerOption[] = [];
    
    // Always add "Me" first if user is authenticated
    if (userId) {
      options.push({ id: userId, name: "Me" });
    }
    
    // Add leaderboard players (exclude current user to avoid duplication)
    players
      .filter((player: any) => player.id !== userId)
      .forEach((player: any) => {
        const displayName = `${player.first_name || ''} ${player.last_name || ''}`.trim();
        if (displayName) {
          options.push({
            id: player.id,
            name: displayName,
            profile_photo: player.profile_photo
          });
        }
      });

    return options;
  }, [leaderboardData, userId]);

  const getPlayerName = (playerId: string) => {
    if (playerId === userId) return "Me";
    const player = (leaderboardData || []).find((p: any) => p.id === playerId);
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
    isLoadingFriends: isLoadingPlayers
  };
}
