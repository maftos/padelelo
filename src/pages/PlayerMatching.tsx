
import { useState } from "react";
import { Clock, MapPin, Users, Calendar, DollarSign, Bell, ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlayerMatchingNotificationModal } from "@/components/PlayerMatchingNotificationModal";
import { JoinGameModal } from "@/components/JoinGameModal";
import { AddOpenMatchWizard } from "@/components/AddOpenMatchWizard";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePublicOpenGames } from "@/hooks/use-public-open-games";
import { transformPublicOpenGameToUIFormat, formatGameDateTime, formatTimeAgo, calculateAverageMMR } from "@/utils/gameDataTransform";
import { useAuth } from "@/contexts/AuthContext";

export default function PlayerMatching() {
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [joinGameModalOpen, setJoinGameModalOpen] = useState(false);
  const [addMatchWizardOpen, setAddMatchWizardOpen] = useState(false);
  const [selectedGamePost, setSelectedGamePost] = useState<any>(null);
  const [sortBy, setSortBy] = useState("for-you");
  const isMobile = useIsMobile();
  const { user } = useAuth();
  
  const { publicOpenGames, isLoading, error } = usePublicOpenGames();

  const sortOptions = [
    { value: "for-you", label: "For You" },
    { value: "today", label: "Today" },
    { value: "friends", label: "Friends" }
  ];

  const handleJoinGame = (postId: string) => {
    console.log("Opening join modal for game:", postId);
    const gamePost = transformedGames.find(post => post.id === postId);
    if (gamePost) {
      setSelectedGamePost(gamePost);
      setJoinGameModalOpen(true);
    }
  };

  // Transform real data to UI format
  const transformedGames = publicOpenGames.map(game => 
    transformPublicOpenGameToUIFormat(game, user?.id)
  );

  if (isLoading) {
    return (
      <div className="w-full min-h-screen">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-6 max-w-full sm:max-w-4xl">
          <div className="text-center py-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-primary/30 animate-pulse"></div>
              <div className="w-3 h-3 rounded-full bg-primary/30 animate-pulse delay-100"></div>
              <div className="w-3 h-3 rounded-full bg-primary/30 animate-pulse delay-200"></div>
            </div>
            <p className="text-muted-foreground mt-4">Loading open bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-6 max-w-full sm:max-w-4xl">
        {/* Header - Optimized for mobile */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Open Bookings</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Join players who have booked a court already</p>
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
          {transformedGames.map((post) => (
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
                    
                    {/* Location and Date/Time - Stack on mobile */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1 min-w-0">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{post.courtName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">{formatGameDateTime(post.gameDate)}</span>
                      </div>
                    </div>
                    
                    {/* Price only */}
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                      <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span>{post.price}</span>
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

        {/* Empty State */}
        {transformedGames.length === 0 && !isLoading && (
          <div className="text-center py-8 sm:py-12 px-4">
            <Users className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">No open bookings yet</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">Check back later for available courts!</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8 sm:py-12 px-4">
            <Users className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">Unable to load bookings</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">Please try again later</p>
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
