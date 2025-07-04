
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
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
  Users
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
    <div className="flex flex-col h-full pt-8">
      {/* User Profile Section */}
      <div className="space-y-4 px-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={profile?.profile_photo || ''} alt={profile?.display_name || undefined} />
            <AvatarFallback>{profile?.display_name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{profile?.display_name || 'Player'}</span>
            <span className="text-sm text-muted-foreground">{profile?.current_mmr || 3000} MMR</span>
          </div>
        </div>
        <SheetClose asChild>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </SheetClose>
      </div>

      <Separator className="my-4" />

      {/* Primary Actions Section */}
      <div className="space-y-2 px-2">
        <div className="flex flex-col gap-2">
          <SheetClose asChild>
            <Link
              to="/register-match"
              className="w-fit flex items-center gap-2 text-sm p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <ClipboardEdit className="h-4 w-4" />
              Register Match
            </Link>
          </SheetClose>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Main Navigation Section */}
      <div className="space-y-1 px-2">
        <SheetClose asChild>
          <Link
            to="/open-games"
            className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Users className="h-4 w-4" />
            Open Games
          </Link>
        </SheetClose>
        <SheetClose asChild>
          <Link
            to="/tournaments"
            className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Trophy className="h-4 w-4" />
            Tournaments
          </Link>
        </SheetClose>
        <SheetClose asChild>
          <Link
            to="/leaderboard"
            className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            Leaderboard
          </Link>
        </SheetClose>
        <SheetClose asChild>
          <Link
            to="/padel-courts"
            className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <MapPin className="h-4 w-4" />
            Padel Courts
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
          className="flex items-center gap-2 text-sm p-2 rounded-md text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
};
