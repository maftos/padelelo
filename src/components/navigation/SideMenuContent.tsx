import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { InviteFriendDialog } from "./InviteFriendDialog";
import { SheetClose } from "@/components/ui/sheet";
import { Trophy, UserPlus, Users, Calendar, Map, Target, Award, Swords } from "lucide-react";

interface SideMenuContentProps {
  user: { id: string } | null;
  onSignOut: () => void;
  onClose: () => void;
}

export const SideMenuContent = ({ user, onSignOut, onClose }: SideMenuContentProps) => {
  return (
    <nav className="flex flex-col gap-4 mt-4">
      {/* Primary Action */}
      {user && (
        <div className="space-y-2">
          <Link 
            to="/register-match" 
            onClick={onClose}
            className="flex items-center gap-2 text-lg bg-primary/10 p-2 rounded-md hover:bg-primary/20 text-primary transition-colors"
          >
            <Swords className="h-5 w-5" />
            Register a Match
          </Link>
          <SheetClose asChild>
            <InviteFriendDialog userId={user.id} />
          </SheetClose>
        </div>
      )}
      
      <Separator className="my-2" />
      
      {/* Core Features */}
      <div className="space-y-2">
        {user && (
          <>
            <Link 
              to="/profile" 
              onClick={onClose}
              className="flex items-center gap-2 text-lg p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Users className="h-5 w-5" />
              Profile
            </Link>
            <Link 
              to="/friends" 
              onClick={onClose}
              className="flex items-center gap-2 text-lg p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <UserPlus className="h-5 w-5" />
              Friends
            </Link>
            <Link 
              to="/matches" 
              onClick={onClose}
              className="flex items-center gap-2 text-lg p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Calendar className="h-5 w-5" />
              My Matches
            </Link>
          </>
        )}
        <Separator className="my-2" />
        <Link 
          to="/leaderboard" 
          onClick={onClose}
          className="flex items-center gap-2 text-lg p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Trophy className="h-5 w-5" />
          Leaderboard
        </Link>
        <Link 
          to="/roadmap" 
          onClick={onClose}
          className="flex items-center gap-2 text-lg p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Map className="h-5 w-5" />
          Feature Updates
        </Link>
        <Link 
          to="/matchmaking-math" 
          onClick={onClose}
          className="flex items-center gap-2 text-lg p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Target className="h-5 w-5" />
          Matchmaking Algorithm
        </Link>
        {user && (
          <Link 
            to="/tournaments" 
            onClick={onClose}
            className="flex items-center gap-2 text-lg p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Award className="h-5 w-5" />
            Tournaments (In Progress)
          </Link>
        )}
      </div>

      {/* Sign Out Button at bottom */}
      {user && (
        <div className="mt-auto pt-4">
          <Separator />
          <Button
            variant="ghost"
            className="w-full mt-4 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => {
              onSignOut();
              onClose();
            }}
          >
            Sign Out
          </Button>
        </div>
      )}
    </nav>
  );
};