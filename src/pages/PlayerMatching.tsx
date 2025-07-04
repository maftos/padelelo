
import { useState } from "react";
import { Clock, MapPin, Users, Plus, Calendar, DollarSign, UserCheck, Bell } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlayerMatchingNotificationModal } from "@/components/PlayerMatchingNotificationModal";

// Mock data for player matching posts
const mockPlayerMatchingPosts = [
  {
    id: "1",
    title: "Looking for 1 player - intermediate",
    courtName: "RM Club Forbach",
    distance: "1.2km",
    gameDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    spotsAvailable: 1,
    description: "Looking for one more player for a friendly match. Mixed levels welcome!",
    existingPlayers: [
      { id: "u1", name: "Carlos M.", mmr: 3200, avatar: null, isHost: true },
      { id: "u2", name: null, mmr: 2900, avatar: null, isHost: false },
      { id: "u3", name: "Miguel R.", mmr: 3100, avatar: null, isHost: false },
      null // Missing player
    ],
    createdBy: "u1",
    preferences: "All genders",
    price: "Rs 400",
    startTime: "19:00",
    endTime: "20:30"
  },
  {
    id: "2", 
    title: "Need 2 players - advanced level",
    courtName: "La Isla Beau Plan",
    distance: "3.7km",
    gameDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    spotsAvailable: 2,
    description: "Need 2 players for doubles. Intermediate level preferred.",
    existingPlayers: [
      { id: "u4", name: "Laura S.", mmr: 2750, avatar: null, isHost: true },
      { id: "u5", name: null, mmr: 2850, avatar: null, isHost: false },
      null, // Missing player
      null  // Missing player
    ],
    createdBy: "u4",
    preferences: "Female only",
    price: "Rs 350",
    startTime: "18:30",
    endTime: "20:00"
  },
  {
    id: "3",
    title: "Looking for 1 player - beginner friendly",
    courtName: "Urban Sport Grand Baie",
    distance: "8.4km",
    gameDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
    spotsAvailable: 1,
    description: "Advanced players welcome. Court already booked for Saturday morning.",
    existingPlayers: [
      { id: "u6", name: "Roberto K.", mmr: 3500, avatar: null, isHost: true },
      { id: "u7", name: null, mmr: 3300, avatar: null, isHost: false },
      { id: "u8", name: null, mmr: 3400, avatar: null, isHost: false },
      null // Missing player
    ],
    createdBy: "u6",
    preferences: "All genders", 
    price: "Rs 500",
    startTime: "17:00",
    endTime: "18:30"
  }
];

const formatGameDate = (date: Date) => {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = dayNames[date.getDay()];
  
  if (diffDays === 1) {
    return `Tomorrow, ${date.getDate()}${getOrdinalSuffix(date.getDate())} ${date.toLocaleDateString('en-US', { month: 'short' })}`;
  } else if (diffDays <= 7) {
    return `Next ${dayName}, ${date.getDate()}${getOrdinalSuffix(date.getDate())} ${date.toLocaleDateString('en-US', { month: 'short' })}`;
  } else {
    return `${dayName}, ${date.getDate()}${getOrdinalSuffix(date.getDate())} ${date.toLocaleDateString('en-US', { month: 'short' })}`;
  }
};

const getOrdinalSuffix = (day: number) => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

const calculateAverageMMR = (players: Array<{ mmr: number } | null>) => {
  const validPlayers = players.filter(player => player !== null) as Array<{ mmr: number }>;
  if (validPlayers.length === 0) return 0;
  const total = validPlayers.reduce((sum, player) => sum + player.mmr, 0);
  return Math.round(total / validPlayers.length);
};

export default function PlayerMatching() {
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Player Matching</h1>
          <p className="text-muted-foreground">Find players to complete your booked courts</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setNotificationModalOpen(true)}
          >
            <Bell className="h-4 w-4" />
            Subscribe to Notifications
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Post Your Court
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Badge variant="outline" className="cursor-pointer hover:bg-accent">All Posts</Badge>
        <Badge variant="secondary" className="cursor-pointer hover:bg-accent">Near Me</Badge>
        <Badge variant="secondary" className="cursor-pointer hover:bg-accent">Today</Badge>
        <Badge variant="secondary" className="cursor-pointer hover:bg-accent">Tomorrow</Badge>
      </div>

      {/* Posts Grid */}
      <div className="grid gap-4">
        {mockPlayerMatchingPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {post.courtName} ({post.distance})
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatGameDate(post.gameDate)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.startTime} - {post.endTime}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <UserCheck className="h-4 w-4" />
                      {post.preferences}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {post.price}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <CardDescription className="mb-4">
                {post.description}
              </CardDescription>
              
              {/* Current Players */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">
                    Current Players (avg: {calculateAverageMMR(post.existingPlayers)} MMR)
                  </h4>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {[0, 1, 2, 3].map((index) => {
                    const player = post.existingPlayers[index];
                    
                    if (player === null) {
                      return (
                        <div key={index} className="flex items-center gap-2 bg-muted/30 rounded-lg p-2 border-2 border-dashed border-muted">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-muted">?</AvatarFallback>
                          </Avatar>
                          <div className="text-sm">
                            <div className="font-medium text-muted-foreground">Open Slot</div>
                            <div className="text-xs text-muted-foreground">Waiting for player</div>
                          </div>
                        </div>
                      );
                    }
                    
                    return (
                      <div key={player.id} className="flex items-center gap-2 bg-muted/50 rounded-lg p-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={player.avatar || ''} alt={player.name || 'Player'} />
                          <AvatarFallback className="text-xs">
                            {player.name ? player.name[0] : 'P'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <div className="font-medium">
                            {player.name || 'Player'}
                            {player.isHost && <span className="text-xs text-primary ml-1">(Host)</span>}
                          </div>
                          <div className="text-xs text-muted-foreground">{player.mmr} MMR</div>
                        </div>
                      </div>
                    );
                  })}
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

      <PlayerMatchingNotificationModal
        open={notificationModalOpen}
        onOpenChange={setNotificationModalOpen}
      />
    </div>
  );
}
