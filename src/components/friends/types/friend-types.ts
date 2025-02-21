
export interface SuggestedUser {
  id: string;
  display_name: string;
  profile_photo: string | null;
  mutual_friends_count?: number;
  mutual_count?: number;
}

export interface PlayedWithUser extends SuggestedUser {
  mutual_friends_count: number;
}

export interface RpcResponseMutual {
  top_mutual_friends: SuggestedUser[];
}

export interface RpcResponsePlayed {
  users_played_with: PlayedWithUser[];
}
