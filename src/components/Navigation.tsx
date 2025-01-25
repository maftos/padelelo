import { useState } from "react";
import { LogIn, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { AuthModal } from "./AuthModal";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useAuth } from "@/contexts/AuthContext";
import { UserMenu } from "./navigation/UserMenu";
import { SideMenuContent } from "./navigation/SideMenuContent";

export const Navigation = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const { profile } = useUserProfile();
  const { user, signOut } = useAuth();

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex flex-1 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="https://skocnzoyobnoyyegfzdt.supabase.co/storage/v1/object/public/ui-assets/padelELO_logo.png" 
                alt="PadelELO Logo" 
                className="h-8 w-8" 
              />
              <span className="font-bold text-primary">PadelELO</span>
            </Link>

            <div className="flex items-center gap-4">
              <UserMenu 
                profile={profile} 
                onSignInClick={() => setIsAuthModalOpen(true)} 
              />
              
              <Sheet open={isSideMenuOpen} onOpenChange={setIsSideMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <SideMenuContent 
                    user={user}
                    onSignOut={signOut}
                    onClose={() => setIsSideMenuOpen(false)}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};