
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus2 } from "lucide-react";
import { FriendCard } from "./FriendCard";
import { useFriendRequest } from "./hooks/useFriendRequest";
import { RpcResponseMutual, RpcResponsePlayed, PlayedWithUser } from "./types/friend-types";

interface SuggestedFriendsProps {
  userId: string | undefined;
}

export const SuggestedFriends = ({ userId }: SuggestedFriendsProps) => {
  const { pendingRequests, handleSendFriendRequest } = useFriendRequest(userId);

  const { data: mutualFriendsData, isLoading: isMutualLoading } = useQuery({
    queryKey: ['suggestFriendsMutual', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase.rpc('suggest_friends_top_mutual', {
        user_a_id_public: userId
      });
      
      if (error) {
        console.error('Error fetching mutual friends suggestions:', error);
        throw error;
      }

      console.log('Mutual friends suggestions data:', data);
      
      const typedData = data as unknown;
      if (typedData && 
          typeof typedData === 'object' && 
          'top_mutual_friends' in typedData && 
          Array.isArray((typedData as any).top_mutual_friends)) {
        return typedData as RpcResponseMutual;
      }
      
      return { top_mutual_friends: [] } as RpcResponseMutual;
    },
    enabled: !!userId,
  });

  const { data: playedWithData, isLoading: isPlayedLoading } = useQuery({
    queryKey: ['suggestFriendsPlayed', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data: rpcData, error } = await supabase.rpc('suggest_users_played_with', {
        user_a_id_public: userId
      });
      
      if (error) {
        console.error('Error fetching played with suggestions:', error);
        throw error;
      }

      console.log('Played with suggestions data:', rpcData);
      
      const typedData = rpcData as unknown;
      if (typedData && 
          typeof typedData === 'object' && 
          'users_played_with' in typedData && 
          Array.isArray((typedData as any).users_played_with)) {
        const validData = typedData as { users_played_with: PlayedWithUser[] };
        const uniqueUsers = Array.from(
          new Map(validData.users_played_with.map(user => [user.id, user])).values()
        );
        
        return {
          users_played_with: uniqueUsers
        } as RpcResponsePlayed;
      }
      
      return {
        users_played_with: []
      } as RpcResponsePlayed;
    },
    enabled: !!userId,
  });

  if (isPlayedLoading || isMutualLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-muted"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const playedWithUsers = playedWithData?.users_played_with || [];
  const playedWithIds = new Set(playedWithUsers.map(user => user.id));
  const suggestedUsers = mutualFriendsData?.top_mutual_friends.filter(
    user => !playedWithIds.has(user.id)
  ) || [];

  if (playedWithUsers.length === 0 && suggestedUsers.length === 0) {
    return null;
  }

  return (
    <div className="space-y-10 animate-fade-in">
      {playedWithUsers.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <UserPlus2 className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Played With</h2>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {playedWithUsers.map((user) => (
              <FriendCard
                key={user.id}
                user={user}
                onSendRequest={handleSendFriendRequest}
                isPending={pendingRequests.has(user.id)}
              />
            ))}
          </div>
        </div>
      )}

      {suggestedUsers.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <UserPlus2 className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Suggested Friends</h2>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {suggestedUsers.map((user) => (
              <FriendCard
                key={user.id}
                user={user}
                onSendRequest={handleSendFriendRequest}
                isPending={pendingRequests.has(user.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
