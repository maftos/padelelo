
import { useSendFriendRequest } from "@/hooks/useSendFriendRequest";

export const useFriendRequest = (userId: string | undefined) => {
  const { sendFriendRequest, pendingRequests } = useSendFriendRequest();

  const handleSendFriendRequest = async (targetUserId: string) => {
    if (!userId) return;
    await sendFriendRequest(targetUserId);
  };

  return {
    pendingRequests,
    handleSendFriendRequest
  };
};
