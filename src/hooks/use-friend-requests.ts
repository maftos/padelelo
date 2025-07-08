
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LeaderboardPlayer } from "@/types/leaderboard";

export const useFriendRequests = (userId: string | undefined) => {
  const [selectedPlayer, setSelectedPlayer] = useState<LeaderboardPlayer | null>(null);

  const handleSendFriendRequest = async () => {
    if (!userId || !selectedPlayer) return { error: null };

    const { error } = await supabase
      .from('friendships')
      .insert({
        user_id: userId,
        friend_id: selectedPlayer.id,
        status: 'INVITED'
      });
    
    return { error };
  };

  return {
    selectedPlayer,
    setSelectedPlayer,
    handleSendFriendRequest,
  };
};
