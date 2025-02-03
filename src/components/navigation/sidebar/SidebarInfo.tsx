import { Calculator, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function SidebarInfo() {
  const navigate = useNavigate();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild onClick={() => navigate('/roadmap')}>
              <div className="flex items-center gap-2 p-2 hover:bg-accent/50 rounded-md transition-colors w-full">
                <Rocket className="h-4 w-4" />
                Feature Updates
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild onClick={() => navigate('/matchmaking-math')}>
              <div className="flex items-center gap-2 p-2 hover:bg-accent/50 rounded-md transition-colors w-full">
                <Calculator className="h-4 w-4" />
                Matchmaking Math
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}