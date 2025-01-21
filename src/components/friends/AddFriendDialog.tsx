import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";

interface AddFriendDialogProps {
  userId: string | undefined;
  onFriendAdded: () => void;
}

export const AddFriendDialog = ({ userId, onFriendAdded }: AddFriendDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [friendEmail, setFriendEmail] = useState("");
  const { toast } = useToast();

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      const { error } = await supabase.rpc('send_friend_request', {
        i_email: friendEmail,
        user_a_id_public: userId
      });

      if (error) throw error;

      toast({
        title: "Friend Request Sent",
        description: `A friend request has been sent to ${friendEmail}`,
      });
      setFriendEmail("");
      setIsOpen(false);
      onFriendAdded();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Friend
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Friend</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAddFriend} className="space-y-4">
          <div>
            <Label htmlFor="friendEmail">Friend's Email</Label>
            <Input
              id="friendEmail"
              type="email"
              value={friendEmail}
              onChange={(e) => setFriendEmail(e.target.value)}
              placeholder="Enter your friend's email"
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit">Send Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};