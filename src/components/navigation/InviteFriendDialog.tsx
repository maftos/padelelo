import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus } from "lucide-react";

interface InviteFriendDialogProps {
  userId: string;
  children?: React.ReactNode;
}

export const InviteFriendDialog = ({ userId, children }: InviteFriendDialogProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setEmail("");
    }
  };

  const handleInvite = async () => {
    if (!email) return;

    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/signup?ref=${userId}`,
      },
    });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    } else {
      toast({
        title: "Invite Sent",
        description: `An invite has been sent to ${email}`,
      });
      setEmail("");
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <button className="w-fit flex items-center gap-2 text-sm p-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors">
            <UserPlus className="h-4 w-4" />
            Invite Friends
          </button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Friends</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-3">Your Referral Link</h4>
            <div className="flex gap-2">
              <Input
                value={`${window.location.origin}/signup?ref=${userId}`}
                readOnly
              />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/signup?ref=${userId}`
                  );
                  toast({
                    title: "Copied!",
                    description: "The referral link has been copied to your clipboard.",
                  });
                }}
              >
                Copy Referral Link
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Share with Friends
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-3">Send the link to your friends.</h4>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="friend@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button onClick={handleInvite} disabled={isLoading}>
                  Send Invite
                </Button>
              </div>
            </div>
            <div className="rounded-md bg-muted p-4">
              <h4 className="text-sm font-medium mb-2">They Sign Up</h4>
              <p className="text-sm text-muted-foreground">
                The platform is invite-only. So once they click on your referral link to sign up, they will see this.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};