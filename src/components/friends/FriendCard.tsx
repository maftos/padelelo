
import { UserPlus2, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SuggestedUser } from "./types/friend-types";

interface FriendCardProps {
  user: SuggestedUser;
  onSendRequest: (userId: string) => void;
  isPending: boolean;
}

export const FriendCard = ({ user, onSendRequest, isPending }: FriendCardProps) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={user.profile_photo || ''} alt={user.display_name} />
            <AvatarFallback>
              {user.display_name?.substring(0, 2).toUpperCase() || 'UN'}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="font-medium">{user.display_name || 'Unknown User'}</p>
            {(user.mutual_count !== undefined || user.mutual_friends_count !== undefined) && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-3.5 w-3.5 mr-1" />
                <span>
                  {user.mutual_count || user.mutual_friends_count} mutual {(user.mutual_count || user.mutual_friends_count) === 1 ? 'friend' : 'friends'}
                </span>
              </div>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSendRequest(user.id)}
          disabled={isPending}
        >
          {isPending ? (
            "Sending..."
          ) : (
            <>
              <UserPlus2 className="h-4 w-4 mr-1" />
              Add
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
