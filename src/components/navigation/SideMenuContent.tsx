import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { InviteFriendDialog } from "./InviteFriendDialog";
import { SheetClose } from "@/components/ui/sheet";

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
              Profile
            </Link>
            <Link 
              to="/friends" 
              onClick={onClose}
              className="flex items-center gap-2 text-lg p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Friends
            </Link>
            <Link 
              to="/matches" 
              onClick={onClose}
              className="flex items-center gap-2 text-lg p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              My Matches
            </Link>
          </>
        )}
        <Link 
          to="/leaderboard" 
          onClick={onClose}
          className="flex items-center gap-2 text-lg p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          Leaderboard
        </Link>
        <Link 
          to="/roadmap" 
          onClick={onClose}
          className="flex items-center gap-2 text-lg p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          On the Roadmap
        </Link>
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