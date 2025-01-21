import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useUserProfile } from "@/hooks/use-user-profile";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { FriendRequests } from "@/components/FriendRequests";

interface Friend {
  friend_id: string;
  status: string;
  created_at: string;
  display_name: string;
  profile_photo: string | null;
}

const Friends = () => {
  const { toast } = useToast();
  const [friendEmail, setFriendEmail] = useState("");
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const { userId } = useUserProfile();
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setShowAuthAlert(true);
      }
    };
    checkAuth();
  }, []);

  const { data: friends, isLoading, error } = useQuery({
    queryKey: ['friends', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      try {
        const { data, error } = await supabase.rpc('view_my_friends', {
          i_user_id: userId
        });

        if (error) {
          console.error('Error fetching friends:', error);
          throw error;
        }

        console.log('Friends data:', data);
        return data as Friend[];
      } catch (error) {
        console.error('Error in query function:', error);
        throw error;
      }
    },
    enabled: !!userId,
  });

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
      setIsAddFriendOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  if (showAuthAlert) {
    return (
      <AlertDialog open={showAuthAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Authentication Required</AlertDialogTitle>
            <AlertDialogDescription>
              Please log in to view your friends list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction onClick={() => navigate('/')}>
            Return to Home
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container py-8 px-4">
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">My Friends</h1>
            <Dialog open={isAddFriendOpen} onOpenChange={setIsAddFriendOpen}>
              <DialogTrigger asChild>
                <Button>Add Friend</Button>
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
          </div>

          {/* Friend Requests Section */}
          <FriendRequests />
          
          {/* Friends List */}
          {isLoading ? (
            <div className="text-center">Loading friends...</div>
          ) : error ? (
            <div className="text-center text-destructive">
              An error occurred while loading your friends list
            </div>
          ) : !friends?.length ? (
            <div className="text-center text-muted-foreground">
              No friends found. Start adding some friends!
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {friends.map((friend) => (
                <Dialog key={friend.friend_id}>
                  <DialogTrigger asChild>
                    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={friend.profile_photo || ''} alt={friend.display_name || ''} />
                          <AvatarFallback>{friend.display_name ? friend.display_name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{friend.display_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Friend since {new Date(friend.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{friend.display_name}'s Recent Matches</DialogTitle>
                    </DialogHeader>
                    {/* RecentMatches component would go here */}
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Friends;