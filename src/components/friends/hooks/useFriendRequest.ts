
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useFriendRequest = (userId: string | undefined) => {
  const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set());

  const handleSendFriendRequest = async (targetUserId: string) => {
    if (!userId) return;

    setPendingRequests(prev => new Set(prev).add(targetUserId));

    try {
      const { error } = await supabase
        .from('friendships')
        .insert({
          user_id: userId,
          friend_id: targetUserId,
          status: 'INVITED'
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

  return {
    pendingRequests,
    handleSendFriendRequest
  };
};
