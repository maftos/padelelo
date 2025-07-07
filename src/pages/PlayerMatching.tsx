
import { useState } from "react";
import { Clock, MapPin, Users, Calendar, DollarSign, UserCheck, Bell, ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlayerMatchingNotificationModal } from "@/components/PlayerMatchingNotificationModal";
import { JoinGameModal } from "@/components/JoinGameModal";
import { AddOpenMatchWizard } from "@/components/AddOpenMatchWizard";
import { useIsMobile } from "@/hooks/use-mobile";

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
    endTime: "20:30",
    createdAt: new Date(Date.now() - 46 * 60 * 1000) // 46 minutes ago
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
    endTime: "20:00",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
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
    endTime: "18:30",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    id: "4",
    title: "Doubles match - competitive level",
    courtName: "Ebene Sports Club",
    distance: "2.1km",
    gameDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    spotsAvailable: 3,
    description: "Looking for 3 more players for a competitive doubles session.",
    existingPlayers: [
      { id: "u9", name: "Sarah D.", mmr: 2950, avatar: null, isHost: true },
      null, // Missing player
      null, // Missing player
      null  // Missing player
    ],
    createdBy: "u9",
    preferences: "All genders",
    price: "Rs 300",
    startTime: "20:00",
    endTime: "21:30",
    createdAt: new Date(Date.now() - 2 * 60 * 1000) // 2 minutes ago
  },
  {
    id: "5",
    title: "Morning session - need 2 players",
    courtName: "Phoenix Sports Complex",
    distance: "5.8km",
    gameDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    spotsAvailable: 2,
    description: "Early morning padel session. Perfect for beating the heat!",
    existingPlayers: [
      { id: "u10", name: "Mark T.", mmr: 2800, avatar: null, isHost: true },
      { id: "u11", name: "Jenny L.", mmr: 2950, avatar: null, isHost: false },
      null, // Missing player
      null  // Missing player
    ],
    createdBy: "u10",
    preferences: "All genders",
    price: "Rs 250",
    startTime: "07:00",
    endTime: "08:30",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  },
  {
    id: "6",
    title: "Weekend tournament prep",
    courtName: "Riverside Sports Center",
    distance: "4.3km",
    gameDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    spotsAvailable: 1,
    description: "Practice session before the weekend tournament. High level players only.",
    existingPlayers: [
      { id: "u12", name: "Alex R.", mmr: 3400, avatar: null, isHost: true },
      { id: "u13", name: "Maria S.", mmr: 3250, avatar: null, isHost: false },
      { id: "u14", name: "Tom W.", mmr: 3150, avatar: null, isHost: false },
      null // Missing player
    ],
    createdBy: "u12",
    preferences: "Male only",
    price: "Rs 450",
    startTime: "16:00",
    endTime: "17:30",
    createdAt: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
  },
  {
    id: "7",
    title: "Casual Friday evening game",
    courtName: "Sunset Padel Club",
    distance: "6.7km",
    gameDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    spotsAvailable: 2,
    description: "Relaxed game to end the work week. All skill levels welcome!",
    existingPlayers: [
      { id: "u15", name: "Nina P.", mmr: 2650, avatar: null, isHost: true },
      { id: "u16", name: "David K.", mmr: 2700, avatar: null, isHost: false },
      null, // Missing player
      null  // Missing player
    ],
    createdBy: "u15",
    preferences: "All genders",
    price: "Rs 320",
    startTime: "18:00",
    endTime: "19:30",
    createdAt: new Date(Date.now() - 45 * 60 * 1000) // 45 minutes ago
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

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
    return "just now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays === 1) {
    return "yesterday";
  } else {
    return `${diffDays}d ago`;
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
  const [joinGameModalOpen, setJoinGameModalOpen] = useState(false);
  const [addMatchWizardOpen, setAddMatchWizardOpen] = useState(false);
  const [selectedGamePost, setSelectedGamePost] = useState<typeof mockPlayerMatchingPosts[0] | null>(null);
  const [sortBy, setSortBy] = useState("for-you");
  const isMobile = useIsMobile();

  const sortOptions = [
    { value: "for-you", label: "For You" },
    { value: "today", label: "Today" },
    { value: "friends", label: "Friends" }
  ];

  const handleJoinGame = (postId: string) => {
    console.log("Opening join modal for game:", postId);
    const gamePost = mockPlayerMatchingPosts.find(post => post.id === postId);
    if (gamePost) {
      setSelectedGamePost(gamePost);
      setJoinGameModalOpen(true);
    }
  };

  return (
    <div className="w-full min-h-screen">
      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-6 max-w-full sm:max-w-4xl">
        {/* Header - Optimized for mobile */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Open Games</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Find players to complete your booked courts</p>
            </div>
            
            {/* Action buttons - Only notifications button now */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                className="flex items-center justify-center gap-2 text-sm h-9 sm:h-10 px-3"
                onClick={() => setNotificationModalOpen(true)}
              >
                <Bell className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Notify Me</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Sort Section - Mobile optimized */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
          {/* Sort options - Mobile friendly */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-muted-foreground min-w-0">
              <ArrowUpDown className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium">Sort by:</span>
            </div>
            <div className="flex gap-1">
              {sortOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={sortBy === option.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSortBy(option.value)}
                  className="text-xs h-8 px-2 sm:px-3"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Posts Grid - Single column with mobile-optimized cards */}
        <div className="space-y-3 sm:space-y-4">
          {mockPlayerMatchingPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow w-full">
              <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6">
                <div className="flex justify-between items-start gap-2 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <CardTitle className="text-base sm:text-lg leading-tight">
                        {post.title}
                      </CardTitle>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md whitespace-nowrap flex-shrink-0">
                        {formatTimeAgo(post.createdAt)}
                      </span>
                    </div>
                    
                    {/* Location and Date - Stack on mobile */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1 min-w-0">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{post.courtName} ({post.distance})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">{formatGameDate(post.gameDate)}</span>
                      </div>
                    </div>
                    
                    {/* Time and Additional Info - Stack on mobile */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span>{post.startTime} - {post.endTime}</span>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="flex items-center gap-1">
                          <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span>{post.preferences}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span>{post.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 px-3 sm:px-6">
                <CardDescription className="mb-3 sm:mb-4 text-sm leading-relaxed">
                  {post.description}
                </CardDescription>
                
                {/* Current Players - Mobile optimized grid */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">
                      Current Players (avg: {calculateAverageMMR(post.existingPlayers)} MMR)
                    </h4>
                  </div>
                  
                  {/* Players grid - 2x2 on mobile, 2 columns on larger screens */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {[0, 1, 2, 3].map((index) => {
                      const player = post.existingPlayers[index];
                      
                      if (player === null) {
                        return (
                          <div 
                            key={index} 
                            className="flex items-center gap-2 sm:gap-3 bg-muted/30 rounded-lg p-2 sm:p-3 border-2 border-dashed border-primary/30 cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-all duration-200 min-h-[50px] sm:min-h-[60px] touch-manipulation"
                            onClick={() => handleJoinGame(post.id)}
                          >
                            <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">+</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-primary text-xs sm:text-sm">Join Game</div>
                              <div className="text-xs text-muted-foreground hidden sm:block">Tap to join</div>
                            </div>
                          </div>
                        );
                      }
                      
                      return (
                        <div key={player.id} className="flex items-center gap-2 sm:gap-3 bg-muted/50 rounded-lg p-2 sm:p-3 min-h-[50px] sm:min-h-[60px]">
                          <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                            <AvatarImage src={player.avatar || ''} alt={player.name || 'Player'} />
                            <AvatarFallback className="text-xs">
                              {player.name ? player.name[0] : 'P'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-xs sm:text-sm flex-1 min-w-0">
                            <div className="font-medium truncate">
                              {player.name || 'Player'}
                              {/* Show host tag only on desktop */}
                              {player.isHost && <span className="text-xs text-primary ml-1 hidden sm:inline">(Host)</span>}
                            </div>
                            <div className="text-xs text-muted-foreground">{player.mmr} MMR</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State - Updated without "Post Your Court" button */}
        {mockPlayerMatchingPosts.length === 0 && (
          <div className="text-center py-8 sm:py-12 px-4">
            <Users className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">No open games yet</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">Check back later for available courts!</p>
          </div>
        )}

        {/* Modals */}
        <PlayerMatchingNotificationModal
          open={notificationModalOpen}
          onOpenChange={setNotificationModalOpen}
        />

        <JoinGameModal
          open={joinGameModalOpen}
          onOpenChange={setJoinGameModalOpen}
          gamePost={selectedGamePost}
        />

        <AddOpenMatchWizard
          open={addMatchWizardOpen}
          onOpenChange={setAddMatchWizardOpen}
        />
      </div>
    </div>
  );
}
