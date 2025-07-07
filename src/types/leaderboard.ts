
export interface LeaderboardPlayer {
  id: string;
  first_name: string | null;
  last_name: string | null;
  profile_photo: string | null;
  current_mmr: number;
  nationality: string | null;
  gender: string | null;
}

export interface LeaderboardFilters {
  gender: string;
  friendsOnly: boolean;
}
