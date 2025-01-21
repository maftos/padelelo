import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Check, X } from "lucide-react";

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
        title: accept ? "Friend Request Accepted" : "Friend Request Declined",
        description: accept ? "You are now friends!" : "Friend request has been declined",
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-pulse text-muted-foreground">Loading requests...</div>
      </div>
    );
  }

  if (!requests?.length) return null;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <UserPlus className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Friend Requests</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {requests.map((request) => (
          <Card key={request.friend_id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar>
                <AvatarImage src={request.profile_photo || ''} alt={request.display_name} />
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
                className="flex-1 bg-primary hover:bg-primary/90" 
                onClick={() => handleRequestResponse(request.friend_id, true)}
              >
                <Check className="h-4 w-4 mr-2" />
                Accept
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => handleRequestResponse(request.friend_id, false)}
              >
                <X className="h-4 w-4 mr-2" />
                Decline
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};