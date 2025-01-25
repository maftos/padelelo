import { useState } from "react";
import { LogIn, Menu, UserPlus } from "lucide-react";
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
import { useUserProfile } from "@/hooks/use-user-profile";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "./ui/use-toast";

export const Navigation = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { profile, isLoading } = useUserProfile();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleCopyReferralLink = () => {
    const referralLink = `${window.location.origin}/signup?ref=${user?.id}`;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Referral link copied!",
      description: "Share this link with friends to invite them to PadelELO",
    });
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
              {user ? (
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
                    {/* Primary Actions */}
                    {user && (
                      <>
                        <Link to="/register-match" className="flex items-center gap-2 text-lg bg-primary/10 p-2 rounded-md hover:bg-primary/20 text-primary transition-colors">
                          Register a Match
                        </Link>
                        <Button
                          variant="outline"
                          className="w-full bg-secondary/10 text-secondary hover:bg-secondary/20"
                          onClick={handleCopyReferralLink}
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          Copy Referral Link
                        </Button>
                      </>
                    )}
                    
                    {/* Core Features */}
                    <div className="space-y-2">
                      {user && (
                        <>
                          <Link to="/friends" className="flex items-center gap-2 text-lg hover:text-primary transition-colors">
                            Friends
                          </Link>
                          <Link to="/matches" className="flex items-center gap-2 text-lg hover:text-primary transition-colors">
                            My Matches
                          </Link>
                        </>
                      )}
                      <Link to="/leaderboard" className="flex items-center gap-2 text-lg hover:text-primary transition-colors">
                        Leaderboard
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

                    {/* Sign Out Button at bottom */}
                    {user && (
                      <div className="mt-auto pt-4">
                        <Separator />
                        <Button
                          variant="ghost"
                          className="w-full mt-4 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={signOut}
                        >
                          Sign Out
                        </Button>
                      </div>
                    )}
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