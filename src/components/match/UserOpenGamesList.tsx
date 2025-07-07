
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, Users, Eye, Clock, UserCheck, DollarSign } from "lucide-react";
import { formatDate } from "@/lib/date";
import { format } from "date-fns";
import { useUserOpenGames } from "@/hooks/use-user-open-games";

interface UserOpenGamesListProps {
  onViewApplicants?: (gameId: string) => void;
}

// Helper functions from PlayerMatching page
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

export const UserOpenGamesList = ({ onViewApplicants }: UserOpenGamesListProps) => {
  const { openGames, isLoading } = useUserOpenGames();

  // Mock applicants count - in real implementation this would come from the hook
  const getApplicantsCount = (gameId: string) => {
    // Mock data - replace with actual applicants count
    return gameId === "open-1" ? 5 : 0;
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-primary/30 animate-pulse"></div>
          <div className="w-3 h-3 rounded-full bg-primary/30 animate-pulse delay-100"></div>
          <div className="w-3 h-3 rounded-full bg-primary/30 animate-pulse delay-200"></div>
        </div>
        <p className="text-muted-foreground mt-4">Loading your open games...</p>
      </div>
    );
  }

  if (openGames.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
          <Users className="w-8 h-8 text-primary/60" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Open Games</h3>
        <p className="text-muted-foreground">You don't have any open games waiting for players</p>
      </div>
    );
  }

  // Count filled spots for each game
  const getFilledSpots = (game: any) => {
    const spots = [
      game.team1_player1_id,
      game.team1_player2_id,
      game.team2_player1_id,
      game.team2_player2_id
    ];
    return spots.filter(Boolean).length;
  };

  // Convert to format expected by the card template
  const mockPlayerMatchingPosts = openGames.map((game) => {
    const filledSpots = getFilledSpots(game);
    const remainingSpots = 4 - filledSpots;
    const applicantsCount = getApplicantsCount(game.match_id);
    
    return {
      id: game.match_id,
      title: `Looking for ${remainingSpots} player${remainingSpots !== 1 ? 's' : ''} - open game`,
      courtName: "Padel Club Mauritius",
      distance: "0.5km",
      gameDate: new Date(game.match_date),
      spotsAvailable: remainingSpots,
      applicantsCount,
      description: "Your open game waiting for more players to join",
      publishedAt: new Date(Date.now() - 46 * 60 * 1000), // 46 minutes ago
      existingPlayers: [
        game.team1_player1_id ? { id: "u1", name: "You", mmr: 3000, avatar: null, isHost: true } : null,
        game.team1_player2_id ? { id: "u2", name: null, mmr: 2900, avatar: null, isHost: false } : null,
        game.team2_player1_id ? { id: "u3", name: null, mmr: 3100, avatar: null, isHost: false } : null,
        game.team2_player2_id ? { id: "u4", name: null, mmr: 2800, avatar: null, isHost: false } : null,
      ],
      createdBy: "u1",
      preferences: "All genders",
      price: "Rs 400",
      startTime: format(new Date(game.match_date), "HH:mm"),
      endTime: format(new Date(new Date(game.match_date).getTime() + 90 * 60 * 1000), "HH:mm"),
      createdAt: new Date(game.created_at)
    };
  });

  return (
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
                    Published 46m ago
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
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewApplicants?.(post.id)}
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Applicants ({post.applicantsCount})
                </Button>
              </div>
              
              {/* Players grid - 2x2 on mobile, 2 columns on larger screens */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {[0, 1, 2, 3].map((index) => {
                  const player = post.existingPlayers[index];
                  
                  if (player === null) {
                    return (
                      <div 
                        key={index} 
                        className="flex items-center gap-2 sm:gap-3 bg-muted/30 rounded-lg p-2 sm:p-3 border-2 border-dashed border-primary/30 min-h-[50px] sm:min-h-[60px]"
                      >
                        <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">+</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-primary text-xs sm:text-sm">Waiting for player</div>
                          <div className="text-xs text-muted-foreground hidden sm:block">Open slot</div>
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <div 
                      key={player.id} 
                      className="flex items-center gap-2 sm:gap-3 bg-muted/50 rounded-lg p-2 sm:p-3 min-h-[50px] sm:min-h-[60px] cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => {
                        // Navigate to user profile - implementation needed
                        console.log('Navigate to profile:', player.id);
                      }}
                    >
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
  );
};
