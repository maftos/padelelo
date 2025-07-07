
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

interface Friend {
  friend_id: string;
  display_name: string;
  profile_photo: string | null;
  created_at: string;
}

interface FriendsListProps {
  userId: string | undefined;
}

export const FriendsList = ({ userId }: FriendsListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

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

  if (error) {
    console.error('Error in FriendsList component:', error);
    return (
      <div className="text-red-500">
        Error loading friends: {(error as Error).message}
      </div>
    );
  }

  const filteredFriends = friends?.filter(friend =>
    friend.display_name?.toLowerCase()?.includes(searchQuery.toLowerCase()) || false
  ) || [];

  return (
    <div className="space-y-6">
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
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-muted"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : !filteredFriends.length ? (
        <div className="text-center text-muted-foreground py-4">
          {searchQuery ? "No friends found matching your search" : "No friends found"}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFriends.map((friend) => (
            <div 
              key={friend.friend_id}
              className="flex items-center space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer bg-background shadow-sm"
            >
              <Avatar>
                <AvatarImage src={friend.profile_photo || ''} alt={friend.display_name} />
                <AvatarFallback>
                  {friend.display_name?.substring(0, 2).toUpperCase() || 'FR'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{friend.display_name}</p>
                <p className="text-xs text-muted-foreground">
                  Friend since {new Date(friend.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
