import { useState, useEffect } from "react";
import { LogIn, Menu } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";

export const Navigation = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    getInitialSession();

    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const isAuth = !!session;
      
      // Only update state and show toast if auth status actually changed
      if (isAuth !== isAuthenticated) {
        setIsAuthenticated(isAuth);
        
        // Only show toasts for actual sign in/out events
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
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isAuthenticated, toast]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

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
              {isAuthenticated ? (
                <>
                  <Link to="/profile">
                    <Avatar className="h-8 w-8 cursor-pointer">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>PE</AvatarFallback>
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
                    {/* Primary Action */}
                    <Link to="/register-match" className="flex items-center gap-2 text-lg bg-primary/10 p-2 rounded-md hover:bg-primary/20 text-primary transition-colors">
                      Register a Match
                    </Link>
                    
                    {/* Core Features */}
                    <div className="space-y-2">
                      <Link to="/friends" className="flex items-center gap-2 text-lg hover:text-primary transition-colors">
                        Friends
                      </Link>
                      <Link to="/leaderboard" className="flex items-center gap-2 text-lg hover:text-primary transition-colors">
                        Leaderboard
                      </Link>
                      <Link to="/matches" className="flex items-center gap-2 text-lg hover:text-primary transition-colors">
                        My Matches
                      </Link>
                    </div>
                    
                    <Separator />
                    
                    {/* Documentation */}
                    <div className="space-y-2">
                      <Link to="/release-notes" className="flex items-center gap-2 text-lg hover:text-primary transition-colors">
                        Release Notes
                      </Link>
                      <Link to="/matchmaking-math" className="flex items-center gap-2 text-lg hover:text-primary transition-colors">
                        Matchmaking Math
                      </Link>
                      <Link to="/future-improvements" className="flex items-center gap-2 text-lg hover:text-primary transition-colors">
                        Future Improvements
                      </Link>
                    </div>
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