
import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { useUserProfile } from "@/hooks/use-user-profile";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { FriendRequests } from "@/components/FriendRequests";
import { supabase } from "@/integrations/supabase/client";
import { CompactFriendsList } from "@/components/friends/CompactFriendsList";
import { SuggestedFriends } from "@/components/friends/SuggestedFriends";
import { QRShareModal } from "@/components/friends/QRShareModal";
import { Users, QrCode } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

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
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Friends</h1>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            <FriendRequests />
            <SuggestedFriends userId={userId} />
            <CompactFriendsList userId={userId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends;
