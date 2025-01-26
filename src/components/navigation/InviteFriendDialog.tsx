import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Copy, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface InviteFriendDialogProps {
  userId: string;
  onOpenChange?: (open: boolean) => void;
}

export const InviteFriendDialog = ({ userId, onOpenChange }: InviteFriendDialogProps) => {
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopyInviteUrl = async () => {
    const inviteUrl = `padelelo.com/signup?ref=${userId}`;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setHasCopied(true);
      toast.success("Invite URL copied to clipboard!");
      setTimeout(() => setHasCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy invite URL");
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button className="flex w-full items-center gap-2 rounded-md p-2 text-lg hover:bg-accent hover:text-accent-foreground transition-colors">
          <UserPlus className="h-5 w-5" />
          Invite Friend
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Invite Link</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Share this link with friends you would like to invite to padelELO.com. They can only sign up after being referred by one of our existing members.
          </p>
          <Button
            className="w-full"
            variant="outline"
            onClick={handleCopyInviteUrl}
          >
            {hasCopied ? (
              <Check className="h-4 w-4 mr-2" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            {hasCopied ? "Copied!" : "Copy Invite URL"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};