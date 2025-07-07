import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus2 } from "lucide-react";
import { FriendCard } from "@/components/friends/FriendCard";
import { useFriendRequest } from "@/components/friends/hooks/useFriendRequest";
import { RpcResponseMutual, RpcResponsePlayed, PlayedWithUser } from "@/components/friends/types/friend-types";

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

      console.log('Dashboard mutual friends suggestions data:', data);
      
      const typedData = data as unknown;
      if (typedData && 
          typeof typedData === 'object' && 
          'top_mutual_friends' in typedData && 
          Array.isArray((typedData as any).top_mutual_friends)) {
        const limitedData = {
          top_mutual_friends: (typedData as any).top_mutual_friends.slice(0, 2) // Limit to 2 for dashboard
        };
        return limitedData as RpcResponseMutual;
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

      console.log('Dashboard played with suggestions data:', rpcData);

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
          users_played_with: uniqueUsers.slice(0, 2) // Limit to 2 for dashboard
        } as RpcResponsePlayed;
      }
      
      return {
        users_played_with: []
      } as RpcResponsePlayed;
    },
    enabled: !!userId,
  });

  if (isMutualLoading || isPlayedLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-muted"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-muted rounded w-3/4"></div>
                <div className="h-2 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const playedWithUsers = playedWithData?.users_played_with || [];
  const mutualFriends = mutualFriendsData?.top_mutual_friends || [];
  
  // Combine and limit total suggestions for dashboard
  const allSuggestions = [...playedWithUsers, ...mutualFriends].slice(0, 3);

  if (allSuggestions.length === 0) {
    return (
      <div className="text-center py-6">
        <UserPlus2 className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground text-xs">No suggestions available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {allSuggestions.map((user) => (
        <FriendCard
          key={user.id}
          user={user}
          onSendRequest={handleSendFriendRequest}
          isPending={pendingRequests.has(user.id)}
        />
      ))}
    </div>
  );
};