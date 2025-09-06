
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LeaderboardPlayer } from "@/types/leaderboard";

export const useFriendRequests = (userId: string | undefined) => {
  const [selectedPlayer, setSelectedPlayer] = useState<LeaderboardPlayer | null>(null);

  const handleSendFriendRequest = async () => {
    if (!userId || !selectedPlayer) return { error: null };

    const { data, error } = await supabase.rpc('send_friend_request' as any, {
      user_b_id: selectedPlayer.id
    });
    
    return { error };
  };

  return {
    selectedPlayer,
    setSelectedPlayer,
    handleSendFriendRequest,
  };
};
