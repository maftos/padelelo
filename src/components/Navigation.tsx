
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useAuth } from "@/contexts/AuthContext";
import { MobileNav } from "./navigation/MobileNav";
import { DesktopNav } from "./navigation/DesktopNav";

export const Navigation = () => {
  const { profile } = useUserProfile();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignInClick = () => navigate('/login');

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-14 items-center">
        <MobileNav 
          profile={profile}
          user={user}
          onSignInClick={handleSignInClick}
          onSignOut={signOut}
        />
        <DesktopNav 
          profile={profile}
          onSignInClick={handleSignInClick}
        />
      </div>
    </nav>
  );
};
