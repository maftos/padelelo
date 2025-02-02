import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { InviteFriendDialog } from "./InviteFriendDialog";
import { SheetClose } from "@/components/ui/sheet";

interface SideMenuContentProps {
  user: { id: string } | null;
  onSignOut: () => void;
  onClose: () => void;
}

export const SideMenuContent = ({
  user,
  onSignOut,
  onClose,
}: SideMenuContentProps) => {
  return (
    <div className="mt-4 space-y-4">
      {user ? (
        <>
          <Link
            to="/register-match"
            onClick={onClose}
            className="flex items-center gap-2 text-lg p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Register Match
          </Link>
          <Link
            to="/matches"
            onClick={onClose}
            className="flex items-center gap-2 text-lg p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Match History
          </Link>
          <Link
            to="/leaderboard"
            onClick={onClose}
            className="flex items-center gap-2 text-lg p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Leaderboard
          </Link>
          <Link
            to="/friends"
            onClick={onClose}
            className="flex items-center gap-2 text-lg p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Friends
          </Link>
          <InviteFriendDialog userId={user.id}>
            <SheetClose className="flex w-full items-center gap-2 text-lg p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
              Invite Friend
            </SheetClose>
          </InviteFriendDialog>
          <Separator />
          <Link
            to="/profile"
            onClick={onClose}
            className="flex items-center gap-2 text-lg p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Profile
          </Link>
          <button
            onClick={() => {
              onSignOut();
              onClose();
            }}
            className="flex w-full items-center gap-2 text-lg p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Sign Out
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            onClick={onClose}
            className="flex items-center gap-2 text-lg p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Sign In
          </Link>
        </>
      )}
      <Separator />
      <Link
        to="/roadmap"
        onClick={onClose}
        className="flex items-center gap-2 text-lg p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        Feature Updates
      </Link>
      <Link
        to="/tournaments"
        onClick={onClose}
        className="flex items-center gap-2 text-lg p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        Tournaments
      </Link>
    </div>
  );
};