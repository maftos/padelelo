
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LeaderboardPlayer } from "@/types/leaderboard";

export const useFriendRequests = (userId: string | undefined) => {
  const [selectedPlayer, setSelectedPlayer] = useState<LeaderboardPlayer | null>(null);

  const handleSendFriendRequest = async () => {
    if (!userId || !selectedPlayer) return { error: null };

    const { error } = await supabase.rpc('send_friend_request_leaderboard', {
      user_a_id_public: userId,
      user_b_id_public: selectedPlayer.id
    });
    
    return { error };
  };

  return {
    selectedPlayer,
    setSelectedPlayer,
    handleSendFriendRequest,
  };
};
