import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ProfileDropdown } from "./ProfileDropdown";
import { useUserProfile } from "@/hooks/use-user-profile";

interface UserMenuProps {
  profile: ReturnType<typeof useUserProfile>["profile"];
  onSignInClick?: () => void;
}

export const UserMenu = ({ profile }: UserMenuProps) => {
  const navigate = useNavigate();

  if (profile) {
    return <ProfileDropdown profile={profile} />;
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={() => navigate('/login')}
      className="flex items-center gap-2"
    >
      <LogIn className="h-5 w-5" />
      Sign In
    </Button>
  );
};