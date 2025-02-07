
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
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

  const handleClose = () => {
    setError(null);
    onClose();
  };

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
      handleClose();
    }
  };

  return (
    <Dialog open={!!player} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Friend</DialogTitle>
          <DialogDescription>
            Do you want to add {player?.display_name} as a friend?
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive" className="my-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleClose}
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
