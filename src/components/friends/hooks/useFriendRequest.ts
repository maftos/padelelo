
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
        toast.error("Failed to send friend request. Please try again.");
      } else {
        toast.success("Friend request sent successfully!");
      }
    } catch (err) {
      console.error('Error sending friend request:', err);
      toast.error("Failed to send friend request. Please try again.");
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
