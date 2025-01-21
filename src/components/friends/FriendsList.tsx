import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

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
  const { data: friends, isLoading, error } = useQuery({
    queryKey: ['friends', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      console.log('Fetching friends for user:', userId);
      const { data, error } = await supabase.rpc('view_my_friends', {
        i_user_id: userId
      });
      
      if (error) {
        console.error('Error fetching friends:', error);
        throw error;
      }
      
      console.log('Friends data:', data);
      return data as Friend[];
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

  if (isLoading) {
    return (
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
    );
  }

  if (!friends?.length) {
    return (
      <div className="text-center text-muted-foreground py-4">
        No friends found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {friends.map((friend) => (
        <div 
          key={friend.friend_id}
          className="flex items-center space-x-4 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
        >
          <Avatar>
            <AvatarImage src={friend.profile_photo || ''} alt={friend.display_name} />
            <AvatarFallback>
              {friend.display_name.substring(0, 2).toUpperCase()}
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
  );
};