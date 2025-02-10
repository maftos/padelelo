
import { Link } from "react-router-dom";
import { UserMenu } from "./UserMenu";
import { UserProfile } from "@/hooks/use-user-profile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SideMenuContent } from "./SideMenuContent";
import { useAuth } from "@/contexts/AuthContext";

interface DesktopNavProps {
  profile: UserProfile | null;
  onSignInClick: () => void;
}

export const DesktopNav = ({ profile, onSignInClick }: DesktopNavProps) => {
  const { user, signOut } = useAuth();

  return (
    <div className="hidden md:flex flex-1 items-center justify-between">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/14a55cb7-6df6-47ec-af26-fab66670c638.png" 
            alt="PadelELO Logo" 
            className="h-8 w-8" 
          />
          <span className="font-bold text-primary">PadelELO</span>
        </Link>
        
        {user && (
          <Sheet>
            <SheetTrigger asChild>
              <button className="text-sm font-medium">Menu</button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <SideMenuContent 
                user={user}
                profile={profile}
                onSignOut={signOut}
                onClose={() => {}}
              />
            </SheetContent>
          </Sheet>
        )}
      </div>

      <div className="flex items-center gap-4">
        <UserMenu 
          profile={profile} 
          onSignInClick={onSignInClick} 
        />
      </div>
    </div>
  );
};
