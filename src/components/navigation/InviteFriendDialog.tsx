import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Copy, UserPlus } from "lucide-react";
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
            Invite Friends
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Friends</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Step 1 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <div className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                1
              </div>
              <h3 className="font-medium">Your Referral Link</h3>
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
              {hasCopied ? "Copied!" : "Copy Referral Link"}
            </Button>
          </div>

          {/* Step 2 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <div className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                2
              </div>
              <h3 className="font-medium">Share with Friends</h3>
            </div>
            <p className="text-sm text-muted-foreground pl-7">
              Send the link to your friends.
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <div className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                3
              </div>
              <h3 className="font-medium">They Sign Up</h3>
            </div>
            <p className="text-sm text-muted-foreground pl-7">
              The platform is invite-only. So once they click on your referral link to sign up, they will see this:
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