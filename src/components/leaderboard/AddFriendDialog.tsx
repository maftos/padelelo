
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
import { useState } from "react";

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
  const [error, setError] = useState<string | null>(null);

  const handleSendRequest = async () => {
    setError(null);
    const result = await onSendRequest();
    
    if (result?.error) {
      try {
        // Try to parse the error body if it exists and is a string
        if (typeof result.error.message === 'string') {
          if (result.error.message.includes('body')) {
            const errorBody = JSON.parse(result.error.message);
            const parsedBody = JSON.parse(errorBody.body);
            setError(parsedBody.message);
          } else {
            setError(result.error.message);
          }
        } else {
          setError('An error occurred while sending the friend request');
        }
      } catch (e) {
        setError('An error occurred while sending the friend request');
      }
    } else {
      toast({
        description: "Friend request sent successfully!",
      });
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
        
        {error && (
          <div className="text-sm text-destructive text-center py-2">
            {error}
          </div>
        )}

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
