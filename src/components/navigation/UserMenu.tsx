import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserProfile } from "@/hooks/use-user-profile";

interface UserMenuProps {
  profile: ReturnType<typeof useUserProfile>["profile"];
  onSignInClick?: () => void;
}

export const UserMenu = ({ profile }: UserMenuProps) => {
  const navigate = useNavigate();

  if (profile) {
    return (
      <Avatar className="h-8 w-8">
        <AvatarImage src={profile.profile_photo || ''} alt={profile.display_name} />
        <AvatarFallback>{profile.display_name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
      </Avatar>
    );
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