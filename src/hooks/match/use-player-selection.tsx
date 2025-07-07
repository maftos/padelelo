
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

  const { data: friends = [], isLoading: isLoadingFriends } = useQuery({
    queryKey: ['friends', userId],
    queryFn: async () => {
      if (!userId) return [];
      try {
        const { data, error } = await supabase.rpc('get_my_friends', {
          p_user_a_id: userId
        });
        if (error) throw error;
        return data as unknown as any[];
      } catch (error) {
        console.error('Error fetching friends:', error);
        throw error;
      }
    },
    enabled: !!userId,
  });

  // Filter player options based on search query
  const playerOptions: PlayerOption[] = [
    { id: userId || "current-user", name: "Me" },
    ...((friends as any[]) || [])
      .filter((friend: any) => {
        const displayName = `${friend.first_name || ''} ${friend.last_name || ''}`.trim();
        return displayName.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .map((friend: any) => ({
        id: friend.friend_id,
        name: `${friend.first_name || ''} ${friend.last_name || ''}`.trim(),
        profile_photo: friend.profile_photo
      }))
  ];

  const getPlayerName = (playerId: string) => {
    if (playerId === userId) return "Me";
    const friend = ((friends as any[]) || []).find((f: any) => f.friend_id === playerId);
    return friend ? `${friend.first_name || ''} ${friend.last_name || ''}`.trim() : "Unknown";
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
