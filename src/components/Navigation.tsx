import { useState, useEffect } from "react";
import { LogIn, Menu, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { AuthModal } from "./AuthModal";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";

export const Navigation = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      
      if (event === 'SIGNED_IN') {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in",
        });
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "Signed out",
          description: "You have been signed out successfully",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex flex-1 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/placeholder.svg" alt="Logo" className="h-8 w-8" />
              <span className="font-bold text-primary">MatchPadel</span>
            </Link>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link to="/profile">
                    <Avatar className="h-8 w-8 cursor-pointer">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>MP</AvatarFallback>
                    </Avatar>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              )}
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-4 mt-4">
                    <Link to="/" className="flex items-center gap-2 text-lg hover:text-primary transition-colors">
                      Home
                    </Link>
                    <Link to="/leaderboard" className="flex items-center gap-2 text-lg hover:text-primary transition-colors">
                      Leaderboard
                    </Link>
                    <Link to="/friends" className="flex items-center gap-2 text-lg hover:text-primary transition-colors">
                      Friends
                    </Link>
                    <Link to="/register-match" className="flex items-center gap-2 text-lg hover:text-primary transition-colors">
                      Register a Match
                    </Link>
                    <Link to="/release-notes" className="flex items-center gap-2 text-lg hover:text-primary transition-colors">
                      Release Notes
                    </Link>
                    <Link to="/matchmaking-math" className="flex items-center gap-2 text-lg hover:text-primary transition-colors">
                      Matchmaking Math
                    </Link>
                    <Link to="/future-improvements" className="flex items-center gap-2 text-lg hover:text-primary transition-colors">
                      Future Improvements
                    </Link>
                  </nav>
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