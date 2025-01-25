import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserProfile } from "@/hooks/use-user-profile";

type UserMenuProps = {
  profile: NonNullable<ReturnType<typeof useUserProfile>["profile"]> | null;
  onSignInClick: () => void;
}

export const UserMenu = ({ profile, onSignInClick }: UserMenuProps) => {
  return profile ? (
    <Link to="/profile">
      <Avatar className="h-8 w-8 cursor-pointer">
        <AvatarImage src={profile?.profile_photo || undefined} />
        <AvatarFallback>
          {profile?.display_name
            ? profile.display_name.substring(0, 2).toUpperCase()
            : "PE"}
        </AvatarFallback>
      </Avatar>
    </Link>
  ) : (
    <Button
      variant="outline"
      size="sm"
      onClick={onSignInClick}
      className="border-primary text-primary hover:bg-primary hover:text-white"
    >
      <LogIn className="mr-2 h-4 w-4" />
      Sign In
    </Button>
  );
};