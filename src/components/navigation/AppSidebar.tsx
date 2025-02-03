import { useNavigate } from "react-router-dom";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/use-user-profile";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarMainActions } from "./sidebar/SidebarMainActions";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { SidebarInfo } from "./sidebar/SidebarInfo";
import { SidebarFooter } from "./sidebar/SidebarFooter";

export function AppSidebar() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { profile } = useUserProfile();

  if (!user || !profile) return null;

  return (
    <Sidebar side="right">
      <SidebarHeader profile={profile} />
      <SidebarContent className="space-y-4">
        <SidebarMainActions userId={user.id} />
        <SidebarNavigation />
        <SidebarInfo />
      </SidebarContent>
      <SidebarFooter onSignOut={signOut} />
    </Sidebar>
  );
}