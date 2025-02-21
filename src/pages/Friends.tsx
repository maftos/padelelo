
import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { useUserProfile } from "@/hooks/use-user-profile";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { FriendRequests } from "@/components/FriendRequests";
import { supabase } from "@/integrations/supabase/client";
import { FriendsList } from "@/components/friends/FriendsList";
import { SuggestedFriends } from "@/components/friends/SuggestedFriends";
import { Users, Home } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Friends = () => {
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const navigate = useNavigate();
  const { userId } = useUserProfile();
  const isMobile = useIsMobile();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setShowAuthAlert(true);
      }
    };
    checkAuth();
  }, []);

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
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Friends</h1>
            </div>
          </div>

          {/* Tabs Navigation */}
          <Tabs defaultValue="home" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="home" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Home
              </TabsTrigger>
              <TabsTrigger value="friends" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                My Friends
              </TabsTrigger>
            </TabsList>

            <TabsContent value="home" className="space-y-6">
              <FriendRequests />
              <SuggestedFriends userId={userId} />
            </TabsContent>

            <TabsContent value="friends">
              <div className="bg-accent rounded-lg p-4">
                <FriendsList userId={userId} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Friends;
