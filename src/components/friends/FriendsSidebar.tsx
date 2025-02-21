
import { NavLink } from "react-router-dom";
import { Home, UserPlus2, Users, Gift, List, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FriendsSidebarProps {
  userId: string | undefined;
}

export const FriendsSidebar = ({ userId }: FriendsSidebarProps) => {
  const { data: friendRequestsCount } = useQuery({
    queryKey: ['friendRequestsCount', userId],
    queryFn: async () => {
      if (!userId) return 0;
      const { data, error } = await supabase.rpc('friend_requests_counter', {
        user_a_id: userId
      });
      if (error) throw error;
      return (data as { count: number }).count;
    },
    enabled: !!userId,
  });

  const navItems = [
    { icon: Home, label: 'Home', path: '/friends' },
    { icon: UserPlus2, label: 'Friend requests', path: '/friends/requests', count: friendRequestsCount },
    { icon: Users, label: 'Suggestions', path: '/friends/suggestions' },
    { icon: Users, label: 'All friends', path: '/friends/all' },
    { icon: Gift, label: 'Birthdays', path: '/friends/birthdays' },
    { icon: List, label: 'Custom lists', path: '/friends/lists' },
  ];

  return (
    <div className="w-64 min-h-[calc(100vh-3.5rem)] bg-accent border-r border-border">
      <div className="p-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Friends</h1>
        <button className="p-2 hover:bg-muted rounded-full">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <nav className="px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                "hover:bg-muted",
                isActive ? "bg-muted" : "text-muted-foreground"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
            {item.count ? (
              <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                {item.count}
              </span>
            ) : null}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
