
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface LeaderboardPlayer {
  id: string;
  display_name: string;
  profile_photo: string | null;
  current_mmr: number;
  nationality: string | null;
  gender: string | null;
}

interface AddFriendDialogProps {
  player: LeaderboardPlayer | null;
  onClose: () => void;
  onSendRequest: () => Promise<{ error: any } | undefined>;
}

export const AddFriendDialog = ({ 
  player, 
  onClose, 
  onSendRequest 
}: AddFriendDialogProps) => {
  const handleSendRequest = async () => {
    const result = await onSendRequest();
    if (result?.error) {
      const errorBody = JSON.parse(result.error.message.includes('body') ? JSON.parse(result.error.message).body : result.error.message);
      toast({
        description: errorBody.message || 'An error occurred while sending the friend request',
      });
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={!!player} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Friend</DialogTitle>
          <DialogDescription>
            Do you want to add {player?.display_name} as a friend?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendRequest}
          >
            Send Friend Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
