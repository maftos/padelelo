
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface SuggestedUser {
  id: string;
  display_name: string;
  profile_photo: string | null;
  mutual_friends_count?: number; // For top mutual friends
  mutual_count?: number; // For users played with
}

interface RpcResponseMutual {
  top_mutual_friends: SuggestedUser[];
}

interface RpcResponsePlayed {
  users_played_with: SuggestedUser[];
}

interface SuggestedFriendsProps {
  userId: string | undefined;
}

export const SuggestedFriends = ({ userId }: SuggestedFriendsProps) => {
  const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set());

  // Query for getting users with mutual friends
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
      return data as RpcResponseMutual;
    },
    enabled: !!userId,
  });

  // Query for getting users played with
  const { data: playedWithData, isLoading: isPlayedLoading } = useQuery({
    queryKey: ['suggestFriendsPlayed', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase.rpc('suggest_users_played_with', {
        user_a_id_public: userId
      });
      
      if (error) {
        console.error('Error fetching played with suggestions:', error);
        throw error;
      }

      console.log('Played with suggestions data:', data);
      return data as RpcResponsePlayed;
    },
    enabled: !!userId,
  });

  const handleSendFriendRequest = async (targetUserId: string) => {
    if (!userId) return;

    setPendingRequests(prev => new Set(prev).add(targetUserId));

    try {
      const { error } = await supabase.rpc('send_friend_request_leaderboard', {
        user_a_id_public: userId,
        user_b_id_public: targetUserId
      });

      if (error) {
        console.error('Error sending friend request:', error);
        toast({
          title: "Error",
          description: "Failed to send friend request. Please try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Friend request sent successfully!"
        });
      }
    } catch (err) {
      console.error('Error sending friend request:', err);
      toast({
        title: "Error",
        description: "Failed to send friend request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setPendingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(targetUserId);
        return newSet;
      });
    }
  };

  if (isPlayedLoading || isMutualLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-muted"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Combine and deduplicate suggestions
  const combinedSuggestions = Array.from(new Set([
    ...(mutualFriendsData?.top_mutual_friends || []),
    ...(playedWithData?.users_played_with || [])
  ].map(user => JSON.stringify(user)))).map(str => JSON.parse(str));

  if (combinedSuggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <UserPlus2 className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">People You May Know</h2>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {combinedSuggestions.map((user) => (
          <Card key={user.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={user.profile_photo || ''} alt={user.display_name} />
                  <AvatarFallback>
                    {user.display_name?.substring(0, 2).toUpperCase() || 'UN'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="font-medium">{user.display_name || 'Unknown User'}</p>
                  {(user.mutual_count !== undefined || user.mutual_friends_count !== undefined) && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-3.5 w-3.5 mr-1" />
                      <span>
                        {user.mutual_count || user.mutual_friends_count} mutual {(user.mutual_count || user.mutual_friends_count) === 1 ? 'friend' : 'friends'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSendFriendRequest(user.id)}
                disabled={pendingRequests.has(user.id)}
              >
                {pendingRequests.has(user.id) ? (
                  "Sending..."
                ) : (
                  <>
                    <UserPlus2 className="h-4 w-4 mr-1" />
                    Add
                  </>
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
