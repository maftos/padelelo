
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

  // Only show this navigation on public pages
  if (user) return null;

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
