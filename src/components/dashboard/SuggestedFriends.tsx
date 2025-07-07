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

  const { data: playedWithData, isLoading } = useQuery({
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
          users_played_with: uniqueUsers.slice(0, 3) // Limit to 3 for dashboard
        } as RpcResponsePlayed;
      }
      
      return {
        users_played_with: []
      } as RpcResponsePlayed;
    },
    enabled: !!userId,
  });

  if (isLoading) {
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

  if (playedWithUsers.length === 0) {
    return (
      <div className="text-center py-8">
        <UserPlus2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground text-sm">No suggestions available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {playedWithUsers.map((user) => (
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