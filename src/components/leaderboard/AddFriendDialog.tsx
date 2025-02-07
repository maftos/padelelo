
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  onSendRequest: () => void;
}

export const AddFriendDialog = ({ 
  player, 
  onClose, 
  onSendRequest 
}: AddFriendDialogProps) => {
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
            onClick={onSendRequest}
          >
            Send Friend Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
