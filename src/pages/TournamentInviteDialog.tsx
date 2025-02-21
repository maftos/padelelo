
import { Copy, Share } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useState } from "react";
import { SuggestedUser } from "@/components/friends/types/friend-types";

interface TournamentInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tournamentId: string;
  tournamentName: string;
}

export function TournamentInviteDialog({
  open,
  onOpenChange,
  tournamentId,
  tournamentName
}: TournamentInviteDialogProps) {
  const { user } = useAuth();
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const { data: friends = [], isLoading } = useQuery({
    queryKey: ['friends', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase.rpc('view_my_friends', {
        i_user_id: user.id
      });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/tournaments/${tournamentId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Tournament link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleToggleFriend = (friendId: string) => {
    setSelectedFriends(prev => 
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleInviteFriends = async () => {
    if (selectedFriends.length === 0) {
      toast.error("Please select at least one friend to invite");
      return;
    }

    try {
      // Here you would implement the logic to invite friends
      // For now, we'll just show a success message
      toast.success(`Invited ${selectedFriends.length} friends to the tournament!`);
      setSelectedFriends([]);
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to send invites");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Friends</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleCopyLink}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Tournament Link
          </Button>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Or invite your friends:</h3>
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {friends.map((friend) => (
                <div
                  key={friend.friend_id}
                  className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                    selectedFriends.includes(friend.friend_id)
                      ? 'bg-primary/10'
                      : 'hover:bg-accent'
                  }`}
                  onClick={() => handleToggleFriend(friend.friend_id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={friend.profile_photo} />
                      <AvatarFallback>
                        {friend.display_name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{friend.display_name}</span>
                  </div>
                  {selectedFriends.includes(friend.friend_id) && (
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {selectedFriends.length > 0 && (
            <Button 
              className="w-full"
              onClick={handleInviteFriends}
            >
              <Share className="h-4 w-4 mr-2" />
              Invite Selected Friends ({selectedFriends.length})
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
