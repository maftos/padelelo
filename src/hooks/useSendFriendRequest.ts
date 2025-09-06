import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useSendFriendRequest = () => {
  const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set());

  const sendFriendRequest = async (targetUserId: string) => {
    setPendingRequests(prev => new Set(prev).add(targetUserId));

    try {
      const { data, error } = await supabase.rpc('send_friend_request' as any, {
        user_b_id: targetUserId
      });

      if (error) {
        console.error('Error sending friend request:', error);
        toast.error("Failed to send friend request. Please try again.");
        return { success: false, error };
      }

      toast.success("Friend request sent successfully!");
      return { success: true, data };
    } catch (err) {
      console.error('Error sending friend request:', err);
      toast.error("Failed to send friend request. Please try again.");
      return { success: false, error: err };
    } finally {
      setPendingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(targetUserId);
        return newSet;
      });
    }
  };

  return {
    sendFriendRequest,
    pendingRequests,
    isPending: (userId: string) => pendingRequests.has(userId)
  };
};