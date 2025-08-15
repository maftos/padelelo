import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { UserPlus, Check, X } from "lucide-react";

interface FriendRequest {
  friend_id: string;
  profile_photo: string | null;
  display_name: string;
  gender: string;
  current_mmr: number;
  id: number;  // This is the friendship_id from the database
}

export const FriendRequests = () => {
  const { userId } = useUserProfile();
  
  const queryClient = useQueryClient();

  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['friendRequests', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      console.log('Fetching friend requests for user:', userId);
      const { data, error } = await supabase.rpc('view_friend_requests');
      
      if (error) {
        console.error('Error fetching friend requests:', error);
        throw error;
      }
      
      console.log('Friend requests data:', data);
      // Handle the new JSON response format
      return ((data as any)?.friend_requests || []) as FriendRequest[];
    },
    enabled: !!userId,
  });

  const handleRequestResponse = async (friendId: string, accept: boolean) => {
    try {
      if (!userId) {
        console.error('Missing user ID');
        throw new Error('User ID is required');
      }

      console.log('Responding to friend request:', { userId, friendId, accept });
      
      const { data, error } = await supabase.rpc('respond_friend_request', {
        user_a_id: userId,
        user_b_id: friendId,
        accept: accept
      } as any);

      if (error) {
        console.error('Error responding to friend request:', error);
        throw error;
      }

      const result = data as any;
      if (result && typeof result === 'object' && 'success' in result && result.success === false) {
        console.warn('Friend request response returned failure:', result);
        toast.error(result.message || 'Failed to respond to friend request');
        return;
      }

      toast.success(accept ? "Friend request accepted! You are now friends!" : "Friend request declined");

      // Invalidate both friend requests and friends lists
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    } catch (error: any) {
      console.error('Error in handleRequestResponse:', error);
      toast.error(`Error: ${error.message}`);
    }
  };

  if (error) {
    console.error('Error in FriendRequests component:', error);
    return (
      <div className="text-red-500">
        Error loading friend requests: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-muted"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-9 bg-muted rounded flex-1"></div>
                <div className="h-9 bg-muted rounded flex-1"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!requests?.length) {
    return null;
  }

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
                  {request.display_name?.substring(0, 2).toUpperCase() || 'FR'}
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