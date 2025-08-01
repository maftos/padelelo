
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/use-user-profile";
import { SideMenuContent } from "./SideMenuContent";

export const MobileHeader = () => {
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();

  const friendRequestCount = profile?.friend_requests_count || 0;
  const hasFriendRequests = friendRequestCount > 0;

  return (
    <header className="lg:hidden sticky top-0 z-50 w-full bg-card border-b border-border">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/14a55cb7-6df6-47ec-af26-fab66670c638.png" 
            alt="PadelELO Logo" 
            className="h-8 w-8" 
          />
          <span className="font-bold text-primary text-lg">PadelELO</span>
        </Link>

        {/* Right: Combined Menu + Profile */}
        {user && (
          <Sheet>
            <SheetTrigger asChild>
              <div className="relative cursor-pointer flex items-center gap-2 p-1 rounded-lg hover:bg-accent transition-colors">
                <Menu className="h-5 w-5" />
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.profile_photo || ''} alt={profile?.display_name || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                    {profile?.display_name?.[0]?.toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                {hasFriendRequests && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                  >
                    {friendRequestCount}
                  </Badge>
                )}
              </div>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-80 bg-card">
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
    </header>
  );
};
