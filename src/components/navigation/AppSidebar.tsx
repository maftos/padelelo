import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { InviteFriendDialog } from "./InviteFriendDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/use-user-profile";
import {
  CalendarDays,
  Trophy,
  Users,
  Calculator,
  Rocket,
  LogOut,
  PlusCircle,
  UserPlus,
  ChevronRight,
} from "lucide-react";

export function AppSidebar() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { profile } = useUserProfile();

  if (!user || !profile) return null;

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-4" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
          <Avatar>
            <AvatarImage src={profile.profile_photo || ''} alt={profile.display_name} />
            <AvatarFallback>{profile.display_name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold">{profile.display_name}</h3>
            <p className="text-sm text-muted-foreground">MMR: {profile.current_mmr}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Primary Actions */}
        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button 
                    variant="default" 
                    className="w-full justify-start" 
                    onClick={() => navigate('/register-match')}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Register Match
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <InviteFriendDialog userId={user.id}>
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
                <SidebarMenuButton asChild onClick={() => navigate('/matches')}>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    My Matches
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={() => navigate('/friends')}>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Friends
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={() => navigate('/leaderboard')}>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Leaderboard
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Additional Features */}
        <SidebarGroup>
          <SidebarGroupLabel>Features</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={() => navigate('/roadmap')}>
                  <div className="flex items-center gap-2">
                    <Rocket className="h-4 w-4" />
                    Feature Updates
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={() => navigate('/matchmaking-math')}>
                  <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Matchmaking Math
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => {
            signOut();
            navigate('/login');
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}