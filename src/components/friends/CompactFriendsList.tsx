import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Friend {
  friend_id: string;
  first_name: string;
  last_name: string;
  profile_photo: string | null;
  created_at: string;
  current_mmr: number;
}

interface CompactFriendsListProps {
  userId: string | undefined;
}

export const CompactFriendsList = ({ userId }: CompactFriendsListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { data: friends, isLoading, error } = useQuery({
    queryKey: ['friends', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      console.log('Fetching friends for user:', userId);
      const { data, error } = await supabase.rpc('get_my_friends', {
        p_user_a_id: userId
      });
      
      if (error) {
        console.error('Error fetching friends:', error);
        throw error;
      }
      
      console.log('Friends data:', data);
      return data as unknown as Friend[];
    },
    enabled: !!userId,
  });

  const handleFriendClick = (friendId: string) => {
    navigate(`/profile/${friendId}`);
  };

  if (error) {
    console.error('Error in CompactFriendsList component:', error);
    return (
      <div className="text-red-500">
        Error loading friends: {(error as Error).message}
      </div>
    );
  }

  const filteredFriends = friends?.filter(friend => {
    const displayName = `${friend.first_name || ''} ${friend.last_name || ''}`.trim();
    return displayName.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];

  if (!friends?.length && !isLoading) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">My Friends</h2>
        {friends && friends.length > 0 && (
          <span className="text-sm text-muted-foreground">({friends.length})</span>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search friends..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
              <div className="h-8 w-8 rounded-full bg-muted"></div>
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-muted rounded w-3/4"></div>
                <div className="h-2 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : !filteredFriends.length ? (
        <div className="text-center text-muted-foreground py-6">
          {searchQuery ? "No friends found matching your search" : "No friends found"}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredFriends.map((friend) => {
            const displayName = `${friend.first_name || ''} ${friend.last_name || ''}`.trim();
            return (
              <div 
                key={friend.friend_id}
                onClick={() => handleFriendClick(friend.friend_id)}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/70 transition-colors cursor-pointer group"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={friend.profile_photo || ''} alt={displayName} />
                  <AvatarFallback className="text-xs">
                    {displayName.substring(0, 2).toUpperCase() || 'FR'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                    {displayName}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{friend.current_mmr} MMR</span>
                    <span>•</span>
                    <span>Friend since {new Date(friend.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};