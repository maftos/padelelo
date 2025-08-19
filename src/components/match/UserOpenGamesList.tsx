import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, Clock, DollarSign, Users } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useOpenGames } from "@/hooks/use-open-games";

interface UserOpenGamesListProps {
  onViewApplicants?: (gameId: string) => void;
}

// Helper functions from PlayerMatching page
const formatGameDateTime = (date: Date) => {
  // Use proper timezone handling for Mauritius
  const mauritiusTime = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Indian/Mauritius',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
  
  // Get current date and target date in Mauritius timezone for comparison
  const nowInMauritius = new Date().toLocaleDateString('en-CA', {
    timeZone: 'Indian/Mauritius'
  });
  
  const eventDateInMauritius = date.toLocaleDateString('en-CA', {
    timeZone: 'Indian/Mauritius'
  });
  
  // Calculate days difference using proper timezone
  const now = new Date();
  const nowMauritiusDate = new Date(now.toLocaleString('en-US', { timeZone: 'Indian/Mauritius' }));
  const eventMauritiusDate = new Date(date.toLocaleString('en-US', { timeZone: 'Indian/Mauritius' }));
  
  const diffTime = eventMauritiusDate.getTime() - nowMauritiusDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const dayName = date.toLocaleDateString('en-US', {
    timeZone: 'Indian/Mauritius',
    weekday: 'long'
  });
  
  const monthDay = date.toLocaleDateString('en-US', {
    timeZone: 'Indian/Mauritius',
    month: 'short',
    day: 'numeric'
  });
  
  if (diffDays === 1) {
    return `Tomorrow, ${monthDay} @ ${mauritiusTime}`;
  } else if (diffDays <= 7) {
    return `Next ${dayName}, ${monthDay} @ ${mauritiusTime}`;
  } else {
    return `${dayName}, ${monthDay} @ ${mauritiusTime}`;
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
  const { openGames, isLoading } = useOpenGames();
  const navigate = useNavigate();

  const handleEdit = (bookingId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/edit-booking/${bookingId}`);
  };

  const handleLeave = (bookingId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement leave functionality
    console.log('Leave booking:', bookingId);
  };

  // Get applicants count from the actual game data
  const getApplicantsCount = (gameId: string) => {
    const game = openGames.find(g => g.booking_id === gameId);
    return game?.applications?.length || 0;
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
      <Card className="border-dashed">
        <CardContent className="py-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
            <Clock className="w-8 h-8 text-primary/60" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Open Games</h3>
          <p className="text-muted-foreground">You don't have any open games waiting for players</p>
        </CardContent>
      </Card>
    );
  }

  // Convert real data to format expected by the card template
  const formattedOpenGames = openGames.map((game) => {
    const remainingSpots = 4 - game.player_count;
    const applicantsCount = getApplicantsCount(game.booking_id);
    const gameDate = new Date(game.start_time);
    const createdAt = new Date(game.created_at);
    
    return {
      id: game.booking_id,
      title: `Looking for ${remainingSpots} player${remainingSpots !== 1 ? 's' : ''}`,
      courtName: game.venue_name,
      gameDate,
      spotsAvailable: remainingSpots,
      applicantsCount,
      description: game.description,
      publishedAt: createdAt,
      existingPlayers: [
        // Use actual participant data with dynamic MMR
        ...Array(game.player_count).fill(null).map((_, index) => ({
          id: game.participants[index]?.player_id || `player${index + 1}`,
          name: index === 0 && game.is_creator ? "You" : game.participants[index]?.first_name || "Player",
          mmr: game.participants[index]?.current_mmr || 3000,
          avatar: game.participants[index]?.profile_photo || null,
          isHost: index === 0 && game.is_creator
        })),
        // Fill remaining slots with null
        ...Array(4 - game.player_count).fill(null)
      ],
      createdBy: game.created_by,
      isCreator: game.is_creator,
      price: `Rs ${game.booking_fee_per_player || 400}`,
      startTime: format(gameDate, "HH:mm"),
      createdAt
    };
  });

  return (
    <div className="space-y-3 sm:space-y-4">
      {formattedOpenGames.map((post) => (
        <Card key={post.id} className="hover:shadow-md transition-shadow w-full">
          <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6">
            <div className="flex justify-between items-start gap-2 sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <CardTitle className="text-base sm:text-lg leading-tight">
                    {post.title}
                  </CardTitle>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md whitespace-nowrap flex-shrink-0">
                    {formatTimeAgo(post.publishedAt)}
                  </span>
                </div>
                
                {/* First row: Start Time and Fee */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm mb-2">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">{formatGameDateTime(post.gameDate)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span>{post.price}</span>
                  </div>
                </div>
                
                {/* Second row: Location */}
                <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">{post.courtName}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0 px-3 sm:px-6">
            {post.description && (
              <CardDescription className="mb-3 sm:mb-4 text-sm leading-relaxed">
                {post.description}
              </CardDescription>
            )}
            
            {/* Current Players - Mobile optimized grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">
                    Current Players
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
                          onClick={() => onViewApplicants?.(post.id)}
                        >
                          <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">+</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-primary text-xs sm:text-sm">{post.applicantsCount} Applicants</div>
                            <div className="text-xs text-muted-foreground hidden sm:block">Tap to choose</div>
                          </div>
                        </div>
                    );
                  }
                  
                  return (
                      <div 
                        key={player.id} 
                        className="flex items-center gap-2 sm:gap-3 bg-muted/50 rounded-lg p-2 sm:p-3 min-h-[50px] sm:min-h-[60px] cursor-pointer hover:bg-muted/80 hover:shadow-sm transition-all duration-200"
                        onClick={() => navigate(`/profile/${player.id}`)}
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
                            {player.isHost && <span className="text-xs text-primary ml-1 hidden sm:inline">(Host)</span>}
                          </div>
                          <div className="text-xs text-muted-foreground">{player.mmr} MMR</div>
                        </div>
                      </div>
                  );
                })}
              </div>

              {/* Edit/Leave button */}
              <div className="pt-3 border-t">
                {post.isCreator ? (
                  <Button 
                    onClick={(e) => handleEdit(post.id, e)}
                    variant="outline"
                    className="w-full h-8 sm:h-9"
                    size="sm"
                  >
                    <span className="text-xs sm:text-sm">Edit</span>
                  </Button>
                ) : (
                  <Button 
                    onClick={(e) => handleLeave(post.id, e)}
                    variant="outline"
                    className="w-full h-8 sm:h-9"
                    size="sm"
                  >
                    <span className="text-xs sm:text-sm">Leave</span>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
