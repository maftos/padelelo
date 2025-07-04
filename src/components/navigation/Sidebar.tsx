
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Trophy, 
  Calendar, 
  Users, 
  ClipboardEdit, 
  BarChart3,
  Settings,
  LogOut
} from "lucide-react";

export const Sidebar = () => {
  const { user, signOut } = useAuth();
  const { data: profile } = useUserProfile();
  const location = useLocation();

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Leaderboard', href: '/leaderboard', icon: BarChart3 },
    { name: 'Register Match', href: '/register-match', icon: ClipboardEdit },
    { name: 'Tournaments', href: '/tournaments', icon: Calendar },
    { name: 'Friends', href: '/friends', icon: Users },
    { name: 'Matches', href: '/matches', icon: Trophy },
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (!user) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center px-6 py-4 border-b border-border">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/14a55cb7-6df6-47ec-af26-fab66670c638.png" 
              alt="PadelELO Logo" 
              className="h-8 w-8" 
            />
            <span className="font-bold text-primary">PadelELO</span>
          </Link>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="space-y-4 text-center">
            <p className="text-muted-foreground">Please sign in to access the sidebar</p>
            <Link to="/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with Logo */}
      <div className="flex items-center px-6 py-4 border-b border-border">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/14a55cb7-6df6-47ec-af26-fab66670c638.png" 
            alt="PadelELO Logo" 
            className="h-8 w-8" 
          />
          <span className="font-bold text-primary">PadelELO</span>
        </Link>
      </div>

      {/* User Profile Section */}
      <div className="px-6 py-4 border-b border-border">
        <Link to="/profile" className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent transition-colors">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile?.profile_photo} />
            <AvatarFallback>
              {profile?.display_name?.substring(0, 2) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {profile?.display_name || 'User'}
            </p>
            <p className="text-xs text-muted-foreground">
              {profile?.current_mmr || 0} MMR
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive(item.href)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <Icon
                className={`mr-3 h-5 w-5 ${
                  isActive(item.href) ? 'text-primary-foreground' : 'text-muted-foreground'
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="px-4 py-4 border-t border-border space-y-1">
        <Link
          to="/profile"
          className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Settings className="mr-3 h-5 w-5 text-muted-foreground" />
          Settings
        </Link>
        
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="w-full justify-start px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <LogOut className="mr-3 h-5 w-5 text-muted-foreground" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};
