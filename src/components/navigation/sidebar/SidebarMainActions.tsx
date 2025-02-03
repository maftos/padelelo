import { PlusCircle, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InviteFriendDialog } from "@/components/navigation/InviteFriendDialog";
import { useNavigate } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface SidebarMainActionsProps {
  userId: string;
}

export function SidebarMainActions({ userId }: SidebarMainActionsProps) {
  const navigate = useNavigate();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button 
                variant="default" 
                className="w-full justify-start hover:bg-accent/50 transition-colors" 
                onClick={() => navigate('/register-match')}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Register Match
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <InviteFriendDialog userId={userId}>
              <SidebarMenuButton asChild>
                <Button 
                  variant="secondary" 
                  className="w-full justify-start hover:bg-accent/50 transition-colors"
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
  );
}