
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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
    <div className="flex flex-col h-full pt-8 text-right">
      {/* User Profile Section */}
      <div className="space-y-4 px-2">
        <div className="flex items-center gap-3 justify-end">
          <div className="flex flex-col flex-1 min-w-0 text-right">
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <Badge variant={rankingChange < 0 ? "destructive" : "secondary"} className={`text-xs ${rankingChange < 0 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                {rankingChange > 0 ? '+' : ''}{rankingChange}
              </Badge>
              <span className="font-medium">{profile?.display_name || 'Player'} (#{ranking})</span>
            </div>
            <span className="text-sm text-muted-foreground">{profile?.current_mmr || 3000} MMR</span>
          </div>
          <Avatar className="h-12 w-12">
            <AvatarImage src={profile?.profile_photo || ''} alt={profile?.display_name || undefined} />
            <AvatarFallback>{profile?.display_name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Main Navigation Section */}
      <div className="space-y-1 px-2">
        <SheetClose asChild>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors justify-end"
          >
            <span>Dashboard</span>
            <LayoutDashboard className="h-4 w-4" />
          </Link>
        </SheetClose>
        <SheetClose asChild>
          <Link
            to="/manage-matches"
            className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors justify-end"
          >
            <span>My Matches</span>
            <ClipboardEdit className="h-4 w-4" />
          </Link>
        </SheetClose>
        <SheetClose asChild>
          <Link
            to="/open-bookings"
            className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors justify-end"
          >
            <span>Open Bookings</span>
            <Users className="h-4 w-4" />
          </Link>
        </SheetClose>
        <SheetClose asChild>
          <Link
            to="/tournaments"
            className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors justify-end"
          >
            <span>Tournaments</span>
            <Trophy className="h-4 w-4" />
          </Link>
        </SheetClose>
        <SheetClose asChild>
          <Link
            to="/leaderboard"
            className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors justify-end"
          >
            <span>Leaderboard</span>
            <BarChart3 className="h-4 w-4" />
          </Link>
        </SheetClose>
        <SheetClose asChild>
          <Link
            to="/padel-courts"
            className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors justify-end"
          >
            <span>Padel Courts</span>
            <MapPin className="h-4 w-4" />
          </Link>
        </SheetClose>
      </div>

      <Separator className="my-4" />

      <div className="px-2">
        <button 
          onClick={() => {
            onSignOut();
            onClose();
          }}
          className="flex items-center gap-2 text-sm p-2 rounded-md text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors justify-end w-full"
        >
          <span>Sign Out</span>
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
