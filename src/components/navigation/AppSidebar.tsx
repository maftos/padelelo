import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Sidebar } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trophy, Users, History, Calculator, UserPlus, LogOut } from "lucide-react";
import { InviteFriendDialog } from "../navigation/InviteFriendDialog";

export function AppSidebar() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { profile, userId } = useUserProfile();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (!profile) return null;

  return (
    <Sidebar>
      {/* User Profile Header */}
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={profile.profile_photo || ''} />
            <AvatarFallback>{profile.display_name?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold">{profile.display_name}</span>
            <span className="text-sm text-muted-foreground">MMR: {profile.current_mmr}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-4">
        {/* Primary Actions */}
        <div className="space-y-2">
          <Button 
            className="w-full justify-start" 
            onClick={() => navigate('/register-match')}
          >
            <Trophy className="mr-2 h-4 w-4" />
            Register Match
          </Button>

          {userId && (
            <InviteFriendDialog userId={userId}>
              <Button 
                variant="secondary"
                className="w-full justify-start"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Friend
              </Button>
            </InviteFriendDialog>
          )}
        </div>

        {/* Navigation */}
        <div className="space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => navigate('/matches')}
          >
            <History className="mr-2 h-4 w-4" />
            My Matches
          </Button>

          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => navigate('/friends')}
          >
            <Users className="mr-2 h-4 w-4" />
            Friends
          </Button>

          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => navigate('/matchmaking-math')}
          >
            <Calculator className="mr-2 h-4 w-4" />
            Matchmaking Math
          </Button>
        </div>

        {/* Sign Out */}
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 mt-auto"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </Sidebar>
  );
}