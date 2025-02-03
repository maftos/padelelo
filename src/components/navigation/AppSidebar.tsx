import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/use-user-profile";
import { 
  Sidebar, 
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trophy, Users, History, Sparkles, Calculator, UserPlus, LogOut } from "lucide-react";
import { InviteFriendDialog } from "../navigation/InviteFriendDialog";

export function AppSidebar() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { profile, userId } = useUserProfile();
  const { setOpenMobile } = useSidebar();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpenMobile(false); // Close sidebar on mobile after navigation
  };

  if (!profile) return null;

  return (
    <Sidebar side="right" className="z-[60]">
      {/* User Profile Header */}
      <SidebarHeader className="border-b p-4">
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
      </SidebarHeader>

      <SidebarContent>
        {/* Primary Actions */}
        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button 
                    className="w-full justify-start" 
                    onClick={() => handleNavigation('/register-match')}
                  >
                    <Trophy className="mr-2 h-4 w-4" />
                    Register Match
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                {userId && (
                  <InviteFriendDialog userId={userId}>
                    <SidebarMenuButton asChild>
                      <Button 
                        variant="secondary"
                        className="w-full justify-start"
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Invite Friend
                      </Button>
                    </SidebarMenuButton>
                  </InviteFriendDialog>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => handleNavigation('/matches')}
                  >
                    <History className="mr-2 h-4 w-4" />
                    My Matches
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => handleNavigation('/friends')}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Friends
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => handleNavigation('/leaderboard')}
                  >
                    <Trophy className="mr-2 h-4 w-4" />
                    Leaderboard
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Info Links */}
        <SidebarGroup>
          <SidebarGroupLabel>Information</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => handleNavigation('/roadmap')}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Feature Updates
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => handleNavigation('/matchmaking-math')}
                  >
                    <Calculator className="mr-2 h-4 w-4" />
                    Matchmaking Math
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with Sign Out */}
      <SidebarFooter className="border-t p-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}