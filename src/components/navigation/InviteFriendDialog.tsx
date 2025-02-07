import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Copy, UserPlus, Numeric1, Numeric2, Numeric3 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserProfile } from "@/hooks/use-user-profile";

interface InviteFriendDialogProps {
  userId: string;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export const InviteFriendDialog = ({ userId, onOpenChange, children }: InviteFriendDialogProps) => {
  const [hasCopied, setHasCopied] = useState(false);
  const { profile } = useUserProfile();

  const handleCopyInviteUrl = async () => {
    const inviteUrl = `${window.location.origin}/signup?ref=${userId}`;
    
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
        {children || (
          <button className="flex w-full items-center gap-2 rounded-md p-2 text-lg hover:bg-accent hover:text-accent-foreground transition-colors">
            <UserPlus className="h-5 w-5" />
            Invite Friend
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Invite Link</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Step 1 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Numeric1 className="h-5 w-5" />
              <h3 className="font-medium">Copy your invitation URL</h3>
            </div>
            <p className="text-sm text-muted-foreground pl-7">
              This link is unique to your account and allows us to track successful referrals.
            </p>
            <Button
              className="w-full mt-2"
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

          {/* Step 2 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Numeric2 className="h-5 w-5" />
              <h3 className="font-medium">Share this link directly with your friends</h3>
            </div>
            <p className="text-sm text-muted-foreground pl-7">
              Send the invitation link to friends you would like to invite to padelELO.com
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Numeric3 className="h-5 w-5" />
              <h3 className="font-medium">They will be able to sign up on our invite-only platform</h3>
            </div>
            <p className="text-sm text-muted-foreground pl-7">
              When they click your link, they'll see:
            </p>
            
            {/* Referrer Preview */}
            <div className="bg-accent rounded-lg p-4 mt-2">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile?.profile_photo} />
                  <AvatarFallback>{profile?.display_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Invited by</p>
                  <p className="font-medium">{profile?.display_name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};