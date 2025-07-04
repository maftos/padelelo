
import { Home, Trophy, Users, User, MapPin, Calendar, BarChart3, Settings } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Register Match", url: "/register-match", icon: Calendar },
  { title: "My Matches", url: "/matches", icon: BarChart3 },
  { title: "Friends", url: "/friends", icon: Users },
  { title: "Tournaments", url: "/tournaments", icon: Trophy },
  { title: "Leaderboard", url: "/leaderboard", icon: BarChart3 },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Padel Courts", url: "/padel-courts", icon: MapPin },
];

export const AppSidebar = () => {
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const location = useLocation();

  if (!user) return null;

  const friendRequestCount = profile?.friend_requests_count || 0;
  const hasFriendRequests = friendRequestCount > 0;

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col sticky top-0">
      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile?.profile_photo || ''} alt={profile?.display_name || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {profile?.display_name?.[0]?.toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 text-sm">
              {profile?.display_name || 'Player'}
            </span>
            <span className="text-xs text-gray-500">
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
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1">{item.title}</span>
                {item.title === 'Friends' && hasFriendRequests && (
                  <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center text-[10px] p-0">
                    {friendRequestCount}
                  </Badge>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Sign Out Button */}
      <div className="p-4 border-t border-gray-100">
        <Button
          variant="ghost"
          onClick={signOut}
          className="w-full justify-start text-gray-700 hover:bg-gray-100"
        >
          <Settings className="h-5 w-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};
