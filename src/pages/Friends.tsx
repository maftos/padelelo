import { Navigation } from "@/components/Navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { RecentMatches } from "@/components/RecentMatches";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Sample friends data - will be replaced with real data later
const friendsData = [
  { id: 1, displayName: "John Doe", profilePhoto: "/placeholder.svg" },
  { id: 2, displayName: "Jane Smith", profilePhoto: "/placeholder.svg" },
  { id: 3, displayName: "Mike Johnson", profilePhoto: "/placeholder.svg" },
];

const Friends = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container py-8 px-4">
        <div className="space-y-6 animate-fade-in">
          <h1 className="text-2xl font-bold text-center">My Friends</h1>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {friendsData.map((friend) => (
              <Dialog key={friend.id}>
                <DialogTrigger asChild>
                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={friend.profilePhoto} />
                        <AvatarFallback>{friend.displayName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{friend.displayName}</p>
                      </div>
                    </div>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{friend.displayName}'s Recent Matches</DialogTitle>
                  </DialogHeader>
                  <RecentMatches />
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Friends;