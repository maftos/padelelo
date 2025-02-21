
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus2 } from "lucide-react";

interface SuggestedUser {
  user_id: string;
  display_name: string;
  profile_photo: string | null;
  current_mmr: number;
}

interface SuggestedFriendsResponse {
  users_played_with: SuggestedUser[];
  mutual_friends: SuggestedUser[];
}

interface SuggestedFriendsProps {
  userId: string | undefined;
}

export const SuggestedFriends = ({ userId }: SuggestedFriendsProps) => {
  const { data: suggestions, isLoading, error } = useQuery({
    queryKey: ['suggestedFriends', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      console.log('Fetching friend suggestions for user:', userId);
      const { data, error } = await supabase.rpc('suggest_friends', {
        user_a_id_public: userId
      });
      
      if (error) {
        console.error('Error fetching friend suggestions:', error);
        throw error;
      }
      
      console.log('Friend suggestions data:', data);
      return data as SuggestedFriendsResponse;
    },
    enabled: !!userId,
  });

  if (error) {
    console.error('Error in SuggestedFriends component:', error);
    return null;
  }

  if (isLoading) {
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

  if (!suggestions || (!suggestions.users_played_with.length && !suggestions.mutual_friends.length)) {
    return null;
  }

  const renderUserList = (users: SuggestedUser[], title: string) => {
    if (!users.length) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <Card key={user.user_id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={user.profile_photo || ''} alt={user.display_name} />
                  <AvatarFallback>
                    {user.display_name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.display_name}</p>
                  <p className="text-sm text-muted-foreground">MMR: {user.current_mmr}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <UserPlus2 className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">People You May Know</h2>
      </div>
      
      {suggestions.users_played_with.length > 0 && (
        renderUserList(suggestions.users_played_with, "Players You've Matched With")
      )}
      
      {suggestions.mutual_friends.length > 0 && (
        renderUserList(suggestions.mutual_friends, "People Your Friends Know")
      )}
    </div>
  );
};
