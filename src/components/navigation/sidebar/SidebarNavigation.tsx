import { CalendarDays, Trophy, Users, Calculator, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function SidebarNavigation() {
  const navigate = useNavigate();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild onClick={() => navigate('/profile')}>
              <div className="flex items-center gap-2 p-2 hover:bg-accent/50 rounded-md transition-colors w-full">
                <Users className="h-4 w-4" />
                My Profile
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild onClick={() => navigate('/matches')}>
              <div className="flex items-center gap-2 p-2 hover:bg-accent/50 rounded-md transition-colors w-full">
                <CalendarDays className="h-4 w-4" />
                My Matches
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild onClick={() => navigate('/friends')}>
              <div className="flex items-center gap-2 p-2 hover:bg-accent/50 rounded-md transition-colors w-full">
                <Users className="h-4 w-4" />
                Friends
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild onClick={() => navigate('/leaderboard')}>
              <div className="flex items-center gap-2 p-2 hover:bg-accent/50 rounded-md transition-colors w-full">
                <Trophy className="h-4 w-4" />
                Leaderboard
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}