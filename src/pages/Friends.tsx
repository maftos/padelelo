
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
import { Users, QrCode, Link2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { InviteFriendDialog } from "@/components/navigation/InviteFriendDialog";
import { AddFriendDialog } from "@/components/friends/AddFriendDialog";
import { Helmet } from "react-helmet";
const Friends = () => {
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const navigate = useNavigate();
  const { userId, profile } = useUserProfile();
  const isMobile = useIsMobile();
  const friendRequestsCount = profile?.friend_requests_count || 0;
  const [activeTab, setActiveTab] = useState<'requests' | 'suggestions' | 'friends'>(friendRequestsCount > 0 ? 'requests' : 'suggestions');

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setShowAuthAlert(true);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    // Update tab when request count changes
    if (friendRequestsCount > 0) {
      setActiveTab('requests');
    }
  }, [friendRequestsCount]);

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
      <Helmet>
        <title>Friends — Padel Social</title>
        <meta name="description" content="Manage friend requests, discover players you've met on court, and grow your padel network." />
        <link rel="canonical" href="/friends" />
      </Helmet>
      <Navigation />
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <header className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Friends</h1>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <QRShareModal>
                <Button variant="secondary" size="sm" className="gap-2">
                  <QrCode className="h-4 w-4" />
                  Share QR
                </Button>
              </QRShareModal>
              {userId && (
                <InviteFriendDialog userId={userId}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Link2 className="h-4 w-4" />
                    Invite Link
                  </Button>
                </InviteFriendDialog>
              )}
              <AddFriendDialog userId={userId} onFriendAdded={() => {}} />
            </div>
          </div>
          {isMobile && (
            <p className="text-sm text-muted-foreground">
              At the court? Open Share QR to connect instantly.
            </p>
          )}
          <div className="sm:hidden flex items-center gap-2 overflow-x-auto">
            <QRShareModal>
              <Button variant="secondary" size="sm" className="gap-2 shrink-0">
                <QrCode className="h-4 w-4" />
                Share QR
              </Button>
            </QRShareModal>
            {userId && (
              <InviteFriendDialog userId={userId}>
                <Button variant="outline" size="sm" className="gap-2 shrink-0">
                  <Link2 className="h-4 w-4" />
                  Invite Link
                </Button>
              </InviteFriendDialog>
            )}
            <AddFriendDialog userId={userId} onFriendAdded={() => {}} />
          </div>
        </header>

        <main className="mt-4">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as 'requests' | 'suggestions' | 'friends')}
            className="w-full"
          >
            <TabsList className="sticky top-0 z-30 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <TabsTrigger value="requests" className="gap-2">
                Requests
                {friendRequestsCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {friendRequestsCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              <TabsTrigger value="friends">Friends</TabsTrigger>
            </TabsList>

            <TabsContent value="requests" className="space-y-6 animate-fade-in">
              <FriendRequests />
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-6 animate-fade-in">
              <SuggestedFriends userId={userId} />
            </TabsContent>

            <TabsContent value="friends" className="space-y-6 animate-fade-in">
              <CompactFriendsList userId={userId} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Friends;
