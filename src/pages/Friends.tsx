import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { useQuery } from "@tanstack/react-query";
import { useUserProfile } from "@/hooks/use-user-profile";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { FriendRequests } from "@/components/FriendRequests";
import { supabase } from "@/integrations/supabase/client";
import { FriendsList } from "@/components/friends/FriendsList";
import { AddFriendDialog } from "@/components/friends/AddFriendDialog";
import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";

const Friends = () => {
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredFriends = friends?.filter(friend => 
    friend.display_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="lg:w-80 flex-shrink-0 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">Friends</h1>
              </div>
              <AddFriendDialog userId={userId} onFriendAdded={refetch} />
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="bg-accent rounded-lg p-4">
              <FriendsList 
                friends={filteredFriends} 
                isLoading={isLoading} 
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            <FriendRequests />
            {/* Additional content can be added here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends;