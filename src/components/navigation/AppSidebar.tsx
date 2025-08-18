import { Home, Trophy, MapPin, Calendar, BarChart3, LogOut, Users } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfileSummary } from "@/hooks/use-user-profile-summary";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useActiveBookingsCount } from "@/hooks/use-active-bookings-count";
import { useOpenBookingsCount } from "@/hooks/use-open-bookings-count";

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "My Bookings", url: "/manage-bookings", icon: Calendar },
  { title: "Open Bookings", url: "/open-bookings", icon: Users },
  { title: "Leaderboard", url: "/leaderboard", icon: BarChart3 },
  { title: "Padel Courts", url: "/padel-courts", icon: MapPin },
];

export const AppSidebar = () => {
  const { user, signOut } = useAuth();
  const { profile } = useUserProfileSummary();
  const location = useLocation();
  const { count: activeBookingsCount } = useActiveBookingsCount();
  const { count: openBookingsCount } = useOpenBookingsCount();

  if (!user) return null;

  return (
    <div className="w-64 h-screen bg-card border-r border-border flex flex-col sticky top-0">
      {/* User Profile Section */}
      <Link to="/profile" className="block p-4 border-b border-border hover:bg-accent/50 transition-colors">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile?.profile_photo || ''} alt={profile?.first_name || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {profile?.first_name?.[0]?.toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-foreground text-sm">
                {profile?.first_name || 'Player'} (#{profile?.rank || 'Unranked'})
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {profile?.current_mmr || 3000} MMR
            </span>
          </div>
        </div>
      </Link>

      {/* Navigation Items */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.url;
            const Icon = item.icon;
            
            return (
              <div key={item.title}>
                <NavLink
                  to={item.url}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="flex-1">{item.title}</span>
                  {item.title === 'My Bookings' && activeBookingsCount > 0 && (
                    <Badge variant="destructive" className="ml-auto">{activeBookingsCount}</Badge>
                  )}
                  {item.title === 'Open Bookings' && openBookingsCount > 0 && (
                    <Badge variant="destructive" className="ml-auto">{openBookingsCount}</Badge>
                  )}
                </NavLink>
                {item.title === 'Open Bookings' && (
                  <div className="px-2">
                    <Separator className="my-2" />
                  </div>
                )}
              </div>
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
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};
