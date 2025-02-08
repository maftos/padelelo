
import { useState } from "react";
import { LeaderboardFilters } from "@/types/leaderboard";

export const useLeaderboardFilters = () => {
  const [filters, setFilters] = useState<LeaderboardFilters>({
    gender: "both",
    friendsOnly: false,
  });

  const handleGenderChange = (value: string) => {
    setFilters(prev => ({ ...prev, gender: value }));
  };

  const handleFriendsOnlyChange = (checked: boolean) => {
    setFilters(prev => ({ ...prev, friendsOnly: checked }));
  };

  return {
    filters,
    handleGenderChange,
    handleFriendsOnlyChange,
  };
};
