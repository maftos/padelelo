import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { useQuery } from "@tanstack/react-query";
import { useUserProfile } from "@/hooks/use-user-profile";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { FriendRequests } from "@/components/FriendRequests";
import { supabase } from "@/integrations/supabase/client";
import { FriendCard } from "@/components/friends/FriendCard";
import { AddFriendDialog } from "@/components/friends/AddFriendDialog";
import { Users } from "lucide-react";

const Friends = () => {
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const navigate = useNavigate();
  const { userId } = useUserProfile();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setShowAuthAlert(true);
      }
    };
    checkAuth();
  }, []);

  const { data: friends, isLoading, refetch } = useQuery({
    queryKey: ['friends', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase.rpc('view_my_friends', {
        i_user_id: userId
      });
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

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
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">My Friends</h1>
            </div>
            <AddFriendDialog userId={userId} onFriendAdded={refetch} />
          </div>

          <FriendRequests />
          
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-pulse text-muted-foreground">Loading friends...</div>
            </div>
          ) : !friends?.length ? (
            <div className="text-center text-muted-foreground p-8">
              No friends found. Start adding some friends!
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {friends.map((friend) => (
                <FriendCard key={friend.friend_id} friend={friend} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Friends;