
import { Link } from "react-router-dom";
import { UserMenu } from "./UserMenu";
import { UserProfile } from "@/hooks/use-user-profile";

interface DesktopNavProps {
  profile: UserProfile | null;
  onSignInClick: () => void;
}

export const DesktopNav = ({ profile, onSignInClick }: DesktopNavProps) => {
  return (
    <div className="hidden md:flex flex-1 items-center justify-between">
      <Link to="/" className="flex items-center space-x-2">
        <img 
          src="/lovable-uploads/14a55cb7-6df6-47ec-af26-fab66670c638.png" 
          alt="PadelELO Logo" 
          className="h-8 w-8" 
        />
        <span className="font-bold text-primary">PadelELO</span>
      </Link>

      <div className="flex items-center gap-4">
        <UserMenu 
          profile={profile} 
          onSignInClick={onSignInClick} 
        />
      </div>
    </div>
  );
};
