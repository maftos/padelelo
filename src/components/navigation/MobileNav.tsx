
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserMenu } from "./UserMenu";
import { SideMenuContent } from "./SideMenuContent";
import { UserProfile } from "@/hooks/use-user-profile";
import { User } from "@supabase/supabase-js";
import { Badge } from "@/components/ui/badge";

interface MobileNavProps {
  profile: UserProfile | null;
  user: User | null;
  onSignInClick: () => void;
  onSignOut: () => void;
}

export const MobileNav = ({ 
  profile, 
  user, 
  onSignInClick,
  onSignOut 
}: MobileNavProps) => {
  const hasFriendRequests = profile?.friend_requests_count && profile.friend_requests_count > 0;

  return (
    <div className="flex md:hidden flex-1 items-center justify-between">
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
        
        {user && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Menu className="h-5 w-5" />
                {hasFriendRequests && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                  >
                    {profile.friend_requests_count}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 animate-slide-in-right">
              <SideMenuContent 
                user={user}
                profile={profile}
                onSignOut={onSignOut}
                onClose={() => {}}
              />
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  );
};
