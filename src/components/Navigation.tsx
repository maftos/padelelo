
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Navigation = () => {
  const { profile } = useUserProfile();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignInClick = () => navigate('/login');

  // Show navigation on public pages when user is not authenticated
  // OR when user is on specific public pages that should show navigation
  const currentPath = window.location.pathname;
  const publicPagesWithNav = ['/leaderboard', '/tournaments', '/open-bookings', '/profile'];
  const showOnPublicPage = publicPagesWithNav.some(path => currentPath.startsWith(path));
  
  if (user && !showOnPublicPage) return null;
  if (!user && !showOnPublicPage) return null;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/14a55cb7-6df6-47ec-af26-fab66670c638.png" 
            alt="PadelELO Logo" 
            className="h-8 w-8" 
          />
          <span className="font-bold text-primary">PadelELO</span>
        </Link>

        <div className="flex items-center gap-4">
          <Button onClick={handleSignInClick} variant="default">
            Sign In
          </Button>
        </div>
      </div>
    </nav>
  );
};
