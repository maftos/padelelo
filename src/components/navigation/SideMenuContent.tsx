
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useActiveBookingsCount } from "@/hooks/use-active-bookings-count";
import { InviteFriendDialog } from "./InviteFriendDialog";
import { SheetClose } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ClipboardEdit, 
  Trophy,
  MapPin,
  LogOut,
  LayoutDashboard,
  BarChart3,
  Users,
  X,
} from "lucide-react";

interface SideMenuContentProps {
  user: { id: string } | null;
  onSignOut: () => void;
  onClose: () => void;
  profile?: {
    display_name?: string | null;
    profile_photo?: string | null;
    current_mmr?: number | null;
    friend_requests_count?: number | null;
  };
}

export const SideMenuContent = ({
  user,
  onSignOut,
  onClose,
  profile,
}: SideMenuContentProps) => {
  // Mock data for ranking - will be replaced with real data later
  const ranking = 45;
  const rankingChange = -3;
  const { count: activeBookingsCount } = useActiveBookingsCount();

  if (!user) {
    return (
      <div className="mt-4 space-y-4">
        <SheetClose asChild>
          <Link
            to="/login"
            className="flex items-center gap-2 text-lg p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Sign In
          </Link>
        </SheetClose>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with Close Button */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Menu</h2>
        <SheetClose asChild>
          <button className="p-2 hover:bg-accent rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </SheetClose>
      </div>

      {/* User Profile Section */}
      <div className="space-y-4 p-4 border-b border-border">
        <SheetClose asChild>
          <Link to="/profile" className="flex items-center gap-3 hover:bg-accent/50 p-2 rounded-lg transition-colors">
            <Avatar className="h-12 w-12">
              <AvatarImage src={profile?.profile_photo || ''} alt={profile?.display_name || undefined} />
              <AvatarFallback>{profile?.display_name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium">{profile?.display_name || 'Player'} (#{ranking})</span>
                <Badge variant={rankingChange < 0 ? "destructive" : "secondary"} className={`text-xs ${rankingChange < 0 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                  {rankingChange > 0 ? '+' : ''}{rankingChange}
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">{profile?.current_mmr || 3000} MMR</span>
            </div>
          </Link>
        </SheetClose>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 px-4 py-2">
        <nav className="space-y-1">
          <SheetClose asChild>
            <Link
              to="/dashboard"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors min-h-[44px]"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span className="font-medium">Dashboard</span>
            </Link>
          </SheetClose>
          
          <SheetClose asChild>
            <Link
              to="/manage-bookings"
              className="flex items-center gap-3 p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors min-h-[44px]"
            >
              <ClipboardEdit className="h-5 w-5" />
              <span className="font-medium">My Bookings</span>
              {activeBookingsCount > 0 && (
                <Badge variant="secondary" className="ml-auto">{activeBookingsCount}</Badge>
              )}
            </Link>
          </SheetClose>

          <SheetClose asChild>
            <Link
              to="/open-bookings"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors min-h-[44px]"
            >
              <Users className="h-5 w-5" />
              <span className="font-medium">Open Bookings</span>
            </Link>
          </SheetClose>


          <SheetClose asChild>
            <Link
              to="/leaderboard"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors min-h-[44px]"
            >
              <BarChart3 className="h-5 w-5" />
              <span className="font-medium">Leaderboard</span>
            </Link>
          </SheetClose>

          <SheetClose asChild>
            <Link
              to="/padel-courts"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors min-h-[44px]"
            >
              <MapPin className="h-5 w-5" />
              <span className="font-medium">Padel Courts</span>
            </Link>
          </SheetClose>
        </nav>
      </div>

      {/* Sign Out Section */}
      <div className="p-4 border-t border-border mt-auto">
        <SheetClose asChild>
          <button 
            onClick={() => {
              onSignOut();
              onClose();
            }}
            className="w-full flex items-center gap-3 p-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors min-h-[44px]"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </SheetClose>
      </div>
    </div>
  );
};
