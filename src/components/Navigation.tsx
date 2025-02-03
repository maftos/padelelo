import { Link, useNavigate } from "react-router-dom";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useAuth } from "@/contexts/AuthContext";
import { UserMenu } from "./navigation/UserMenu";
import { AppSidebar } from "./navigation/AppSidebar";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";

export const Navigation = () => {
  const { profile } = useUserProfile();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openMobile, open } = useSidebar();

  return (
    <nav className={`fixed top-0 z-50 w-full border-b bg-background ${(openMobile || open) ? 'pointer-events-none' : ''}`}>
      <div className="container flex h-14 md:h-16 items-center max-w-full">
        <div className="flex flex-1 items-center justify-between w-full">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/6c2aa848-d126-4ee6-9af5-78a13698d72c.png" 
              alt="PadelELO Logo" 
              className="h-8 w-8" 
            />
            <span className="font-bold text-primary">PadelELO</span>
          </Link>

          <div className="flex items-center gap-4">
            <UserMenu 
              profile={profile} 
              onSignInClick={() => navigate('/login')} 
            />
            <div className="pointer-events-auto">
              <SidebarTrigger />
            </div>
          </div>
        </div>
      </div>
      <AppSidebar />
    </nav>
  );
};