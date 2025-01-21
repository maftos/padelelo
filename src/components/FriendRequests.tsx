import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface FriendRequest {
  friend_id: string;
  profile_photo: string | null;
  display_name: string;
  gender: string;
  current_mmr: number;
}

export const FriendRequests = () => {
  const { userId } = useUserProfile();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['friendRequests', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase.rpc('view_friend_requests', {
        user_a_id_public: userId
      });

      if (error) throw error;
      return data as FriendRequest[];
    },
    enabled: !!userId,
  });

  const handleRequestResponse = async (friendshipId: string, accept: boolean) => {
    try {
      const { error } = await supabase.rpc('respond_friend_request', {
        user_a_id_public: userId,
        friendship_id: friendshipId,
        accept: accept
      });

      if (error) throw error;

      toast({
        title: accept ? "Friend Request Accepted" : "Friend Request Ignored",
        description: accept ? "You are now friends!" : "Friend request has been ignored",
      });

      // Refresh both friend requests and friends lists
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <div>Loading requests...</div>;
  if (!requests?.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Friend Requests</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {requests.map((request) => (
          <Card key={request.friend_id} className="p-4">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar>
                <AvatarImage src={request.profile_photo || ''} />
                <AvatarFallback>
                  {request.display_name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{request.display_name}</p>
                <p className="text-sm text-muted-foreground">MMR: {request.current_mmr}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                className="flex-1" 
                onClick={() => handleRequestResponse(request.friend_id, true)}
              >
                Accept
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => handleRequestResponse(request.friend_id, false)}
              >
                Ignore
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};