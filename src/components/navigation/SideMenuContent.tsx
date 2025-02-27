
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { InviteFriendDialog } from "./InviteFriendDialog";
import { SheetClose } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  UserPlus, 
  ClipboardEdit, 
  Users,
  Trophy,
  Sparkles,
  Calculator,
  LogOut,
  Info,
  LayoutDashboard
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
        <Link
          to="/login"
          onClick={onClose}
          className="flex items-center gap-2 text-lg p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const friendRequestCount = profile?.friend_requests_count || 0;
  const hasFriendRequests = friendRequestCount > 0;

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
        <Link
          to="/dashboard"
          onClick={onClose}
          className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>
      </div>

      <Separator className="my-4" />

      {/* Primary Actions Section */}
      <div className="space-y-2 px-2">
        <div className="flex flex-col gap-2">
          <Link
            to="/register-match"
            onClick={onClose}
            className="w-fit flex items-center gap-2 text-sm p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <ClipboardEdit className="h-4 w-4" />
            Register Match
          </Link>
          <InviteFriendDialog userId={user.id}>
            <button className="w-fit flex items-center gap-2 text-sm p-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors">
              <UserPlus className="h-4 w-4" />
              Invite Friend
            </button>
          </InviteFriendDialog>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Main Navigation Section */}
      <div className="space-y-1 px-2">
        <Link
          to="/matches"
          onClick={onClose}
          className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <ClipboardEdit className="h-4 w-4" />
          My Matches
        </Link>
        <Link
          to="/friends"
          onClick={onClose}
          className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Users className="h-4 w-4" />
          <span>Friends</span>
          {hasFriendRequests && (
            <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center text-[10px]">
              {friendRequestCount}
            </Badge>
          )}
        </Link>
        <Link
          to="/leaderboard"
          onClick={onClose}
          className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Trophy className="h-4 w-4" />
          Leaderboard
        </Link>
      </div>

      <Separator className="my-4" />

      {/* Secondary Navigation Section */}
      <div className="space-y-1 px-2">
        <Link
          to="/how-it-works"
          onClick={onClose}
          className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Info className="h-4 w-4" />
          How It Works
        </Link>
        <Link
          to="/roadmap"
          onClick={onClose}
          className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          Feature Updates
        </Link>
        <Link
          to="/matchmaking-math"
          onClick={onClose}
          className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Calculator className="h-4 w-4" />
          Matchmaking Math
        </Link>
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
