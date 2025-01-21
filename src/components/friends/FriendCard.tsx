import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface FriendCardProps {
  friend: {
    friend_id: string;
    display_name: string;
    profile_photo: string | null;
    created_at: string;
  };
}

export const FriendCard = ({ friend }: FriendCardProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={friend.profile_photo || ''} alt={friend.display_name} />
              <AvatarFallback>
                {friend.display_name ? friend.display_name.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{friend.display_name}</p>
              <p className="text-sm text-muted-foreground">
                Friend since {new Date(friend.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{friend.display_name}'s Recent Matches</DialogTitle>
        </DialogHeader>
        {/* RecentMatches component would go here */}
      </DialogContent>
    </Dialog>
  );
};