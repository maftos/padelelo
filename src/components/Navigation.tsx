import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useAuth } from "@/contexts/AuthContext";
import { UserMenu } from "./navigation/UserMenu";
import { SideMenuContent } from "./navigation/SideMenuContent";

export const Navigation = () => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const { profile } = useUserProfile();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between">
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
              onSignInClick={() => navigate('/login')} 
            />
            
            {user && (
              <Sheet open={isSideMenuOpen} onOpenChange={setIsSideMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="p-0">
                  <SideMenuContent 
                    user={user}
                    profile={profile}
                    onSignOut={signOut}
                    onClose={() => setIsSideMenuOpen(false)}
                  />
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};