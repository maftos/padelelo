import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, MapPin, Users, Calendar, DollarSign, Share2, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { JoinGameResponsive } from "@/components/JoinGameResponsive";
import { useBookingDetails } from "@/hooks/use-booking-details";
import { transformPublicOpenGameToUIFormat, formatGameDateTime, formatTimeAgo, calculateAverageMMR } from "@/utils/gameDataTransform";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

export default function OpenBookingDetail() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [joinGameModalOpen, setJoinGameModalOpen] = useState(false);
  const [selectedGamePost, setSelectedGamePost] = useState<any>(null);

  const { booking, isLoading, error } = useBookingDetails(bookingId);

  const handleJoinGame = () => {
    if (!booking) return;
    
    // Transform booking to match expected format for JoinGameResponsive
    const gamePost = {
      id: booking.booking_id,
      title: booking.title,
      courtName: booking.venue_name,
      venueId: booking.venue_id,
      gameDate: new Date(booking.start_time),
      startTime: new Date(booking.start_time).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      }),
      price: booking.booking_fee_per_player ? `£${booking.booking_fee_per_player}` : 'Free',
      description: booking.description,
      existingPlayers: booking.participants.map(p => ({
        id: p.player_id,
        name: `${p.first_name} ${p.last_name}`.trim(),
        current_mmr: p.current_mmr || 0,
        avatar: p.profile_photo
      })),
      spotsAvailable: 4 - booking.player_count,
      createdBy: booking.created_by
    };
    
    setSelectedGamePost(gamePost);
    setJoinGameModalOpen(true);
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    
    if (navigator.share && isMobile) {
      try {
        await navigator.share({
          title: booking?.title || 'Open Booking',
          text: `Join this Padel game: ${booking?.title}`,
          url: shareUrl,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        // Fallback to clipboard copy if share fails
        await copyToClipboard(shareUrl);
      }
    } else {
      await copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Unable to copy link");
    }
  };

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
            <p className="text-muted-foreground mt-4">Loading booking details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="w-full min-h-screen">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-6 max-w-full sm:max-w-4xl">
          <div className="text-center py-8">
            <Users className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">Booking not found</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              This booking may no longer be available or the link is invalid.
            </p>
            <Button onClick={() => navigate('/open-bookings')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Open Bookings
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Check if booking is no longer open
  if (booking.status !== 'open') {
    return (
      <div className="w-full min-h-screen">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-6 max-w-full sm:max-w-4xl">
          <div className="text-center py-8">
            <Users className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">Booking no longer available</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              This booking is {booking.status} and no longer accepting new players.
            </p>
            <Button onClick={() => navigate('/open-bookings')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Open Bookings
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const gameDate = new Date(booking.start_time);
  const spotsAvailable = 4 - booking.player_count;
  const publishedAt = new Date(booking.created_at);

  return (
    <div className="w-full min-h-screen">
      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-6 max-w-full sm:max-w-4xl">
        {/* Header with navigation */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/open-bookings')}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Open Booking</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Join this Padel game</p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            {!isMobile && <span>Share</span>}
          </Button>
        </div>

        {/* Booking Card */}
        <Card className="w-full">
          <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6">
            <div className="flex justify-between items-start gap-2 sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <CardTitle className="text-base sm:text-lg leading-tight">
                    {booking.title}
                  </CardTitle>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md whitespace-nowrap flex-shrink-0">
                    {formatTimeAgo(publishedAt)}
                  </span>
                </div>
                
                {/* First row: Start Time and Fee */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm mb-2">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">
                      {formatGameDateTime(gameDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span>{booking.booking_fee_per_player ? `£${booking.booking_fee_per_player}` : 'Free'}</span>
                  </div>
                </div>
                
                {/* Second row: Location */}
                <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span 
                    className="truncate cursor-pointer hover:text-primary hover:underline transition-colors duration-200"
                    onClick={() => navigate(`/padel-courts/${booking.venue_id}`)}
                  >
                    {booking.venue_name}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0 px-3 sm:px-6">
            {booking.description && (
              <CardDescription className="mb-3 sm:mb-4 text-sm leading-relaxed">
                {booking.description}
              </CardDescription>
            )}
            
            {/* Current Players */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">
                  Current Players (avg: {calculateAverageMMR(booking.participants.map(p => ({ current_mmr: p.current_mmr || 0 })))} MMR)
                </h4>
                <span className="text-xs text-muted-foreground">
                  {spotsAvailable} spot{spotsAvailable !== 1 ? 's' : ''} remaining
                </span>
              </div>
              
              {/* Players grid */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {[0, 1, 2, 3].map((index) => {
                  const player = booking.participants[index];
                  
                  if (!player) {
                    return (
                      <div 
                        key={index} 
                        className="flex items-center gap-2 sm:gap-3 bg-muted/30 rounded-lg p-2 sm:p-3 border-2 border-dashed border-primary/30 cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-all duration-200 min-h-[50px] sm:min-h-[60px] touch-manipulation"
                        onClick={handleJoinGame}
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
                    <div 
                      key={player.player_id} 
                      className="flex items-center gap-2 sm:gap-3 bg-muted/50 rounded-lg p-2 sm:p-3 min-h-[50px] sm:min-h-[60px] cursor-pointer hover:bg-muted/80 hover:shadow-sm transition-all duration-200"
                      onClick={() => navigate(`/profile/${player.player_id}`)}
                    >
                      <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                        <AvatarImage src={player.profile_photo || ''} alt={`${player.first_name} ${player.last_name}`} />
                        <AvatarFallback className="text-xs">
                          {player.first_name ? player.first_name[0] : 'P'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-xs sm:text-sm flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {`${player.first_name} ${player.last_name}`.trim() || 'Player'}
                        </div>
                        <div className="text-xs text-muted-foreground">{player.current_mmr || 0} MMR</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Join Button for mobile */}
            {spotsAvailable > 0 && (
              <div className="mt-4 pt-4 border-t">
                <Button 
                  onClick={handleJoinGame}
                  className="w-full"
                  size="lg"
                >
                  Request to Join Game
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Join Game Modal */}
        <JoinGameResponsive
          open={joinGameModalOpen}
          onOpenChange={setJoinGameModalOpen}
          gamePost={selectedGamePost}
        />
      </div>
    </div>
  );
}