import { Clock, MapPin, Users, Plus, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for player matching posts
const mockPlayerMatchingPosts = [
  {
    id: "1",
    courtName: "Club de Padel Madrid",
    courtLocation: "Madrid Centro",
    gameDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    spotsAvailable: 1,
    description: "Looking for one more player for a friendly match. Mixed levels welcome!",
    existingPlayers: [
      { id: "u1", name: "Carlos M.", mmr: 3200, avatar: null },
      { id: "u2", name: "Ana G.", mmr: 2900, avatar: null },
      { id: "u3", name: "Miguel R.", mmr: 3100, avatar: null }
    ],
    createdBy: "u1",
    urgency: "medium"
  },
  {
    id: "2", 
    courtName: "Padel Pro Center",
    courtLocation: "Barcelona Nord",
    gameDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    spotsAvailable: 2,
    description: "Need 2 players for doubles. Intermediate level preferred.",
    existingPlayers: [
      { id: "u4", name: "Laura S.", mmr: 2750, avatar: null },
      { id: "u5", name: "David P.", mmr: 2850, avatar: null }
    ],
    createdBy: "u4",
    urgency: "high"
  },
  {
    id: "3",
    courtName: "Sports Club Valencia", 
    courtLocation: "Valencia Este",
    gameDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
    spotsAvailable: 1,
    description: "Advanced players welcome. Court already booked for Saturday morning.",
    existingPlayers: [
      { id: "u6", name: "Roberto K.", mmr: 3500, avatar: null },
      { id: "u7", name: "Sofia T.", mmr: 3300, avatar: null },
      { id: "u8", name: "Alejandro V.", mmr: 3400, avatar: null }
    ],
    createdBy: "u6",
    urgency: "low"
  }
];

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case "high":
      return "destructive";
    case "medium":
      return "default";
    case "low":
      return "secondary";
    default:
      return "secondary";
  }
};

const getUrgencyText = (urgency: string) => {
  switch (urgency) {
    case "high":
      return "Urgent";
    case "medium":
      return "This Week";
    case "low":
      return "Soon";
    default:
      return "Soon";
  }
};

const formatGameTime = (date: Date) => {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    return "Tomorrow";
  } else if (diffDays <= 7) {
    return `In ${diffDays} days`;
  } else {
    return date.toLocaleDateString();
  }
};

export default function PlayerMatching() {
  const calculateAverageMMR = (players: Array<{ mmr: number }>) => {
    if (players.length === 0) return 0;
    const total = players.reduce((sum, player) => sum + player.mmr, 0);
    return Math.round(total / players.length);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Player Matching</h1>
          <p className="text-muted-foreground">Find players to complete your booked courts</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Post Your Court
        </Button>
      </div>

      {/* Filter Section */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Badge variant="outline" className="cursor-pointer hover:bg-accent">All Posts</Badge>
        <Badge variant="secondary" className="cursor-pointer hover:bg-accent">Urgent</Badge>
        <Badge variant="secondary" className="cursor-pointer hover:bg-accent">This Week</Badge>
        <Badge variant="secondary" className="cursor-pointer hover:bg-accent">Near Me</Badge>
      </div>

      {/* Posts Grid */}
      <div className="grid gap-4">
        {mockPlayerMatchingPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{post.courtName}</CardTitle>
                    <Badge variant={getUrgencyColor(post.urgency)} className="text-xs">
                      {getUrgencyText(post.urgency)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {post.courtLocation}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatGameTime(post.gameDate)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.gameDate.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-primary font-semibold">
                    <Users className="h-4 w-4" />
                    {post.spotsAvailable} spot{post.spotsAvailable > 1 ? 's' : ''} left
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <CardDescription className="mb-4">
                {post.description}
              </CardDescription>
              
              {/* Existing Players */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Current Players</h4>
                  <span className="text-xs text-muted-foreground">
                    Avg: {calculateAverageMMR(post.existingPlayers)} MMR
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {post.existingPlayers.map((player) => (
                    <div key={player.id} className="flex items-center gap-2 bg-muted/50 rounded-lg p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={player.avatar || ''} alt={player.name} />
                        <AvatarFallback className="text-xs">{player.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <div className="font-medium">{player.name}</div>
                        <div className="text-xs text-muted-foreground">{player.mmr} MMR</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end pt-2">
                  <Button size="sm" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Join Game
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State (if no posts) */}
      {mockPlayerMatchingPosts.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No player matching posts yet</h3>
          <p className="text-muted-foreground mb-4">Be the first to post your available court!</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Post Your Court
          </Button>
        </div>
      )}
    </div>
  );
}
