
import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { useUserProfile } from "@/hooks/use-user-profile";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useNavigate, Routes, Route } from "react-router-dom";
import { FriendRequests } from "@/components/FriendRequests";
import { supabase } from "@/integrations/supabase/client";
import { SuggestedFriends } from "@/components/friends/SuggestedFriends";
import { FriendsSidebar } from "@/components/friends/FriendsSidebar";

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
      <div className="flex">
        {/* Left Sidebar */}
        <FriendsSidebar userId={userId} />

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            <Routes>
              {/* Home route shows both sections */}
              <Route path="/" element={
                <>
                  <FriendRequests />
                  <SuggestedFriends userId={userId} />
                </>
              } />
              {/* Dedicated routes for each section */}
              <Route path="/requests" element={<FriendRequests />} />
              <Route path="/suggestions" element={<SuggestedFriends userId={userId} />} />
              {/* Additional routes can be added here as needed */}
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends;
