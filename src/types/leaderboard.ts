
export interface LeaderboardPlayer {
  id: string;
  display_name: string;
  profile_photo: string | null;
  current_mmr: number;
  nationality: string | null;
  gender: string | null;
}

export interface LeaderboardFilters {
  gender: string;
  friendsOnly: boolean;
}
