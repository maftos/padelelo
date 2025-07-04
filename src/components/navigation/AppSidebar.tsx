
import { Home, Trophy, MapPin, Calendar, BarChart3, Settings, Users } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Register Match", url: "/register-match", icon: Calendar },
  { title: "Open Games", url: "/open-games", icon: Users },
  { title: "Tournaments", url: "/tournaments", icon: Trophy },
  { title: "Leaderboard", url: "/leaderboard", icon: BarChart3 },
  { title: "Padel Courts", url: "/padel-courts", icon: MapPin },
];

export const AppSidebar = () => {
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const location = useLocation();

  if (!user) return null;

  return (
    <div className="w-64 h-screen bg-card border-r border-border flex flex-col sticky top-0">
      {/* User Profile Section */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile?.profile_photo || ''} alt={profile?.display_name || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {profile?.display_name?.[0]?.toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-sm">
              {profile?.display_name || 'Player'}
            </span>
            <span className="text-xs text-muted-foreground">
              {profile?.current_mmr || 3000} MMR
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.url;
            const Icon = item.icon;
            
            return (
              <NavLink
                key={item.title}
                to={item.url}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1">{item.title}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Sign Out Button */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={signOut}
          className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <Settings className="h-5 w-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};
