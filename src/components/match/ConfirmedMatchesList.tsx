import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useConfirmedBookings } from "@/hooks/use-confirmed-bookings";
import { Clock, Users, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { format, isSameDay, addDays } from "date-fns";

interface ConfirmedMatchesListProps {
  onSelectMatch: (bookingId: string) => void;
  selectedMatchId?: string;
}

export const ConfirmedMatchesList = ({ onSelectMatch, selectedMatchId }: ConfirmedMatchesListProps) => {
  const { confirmedBookings, isLoading } = useConfirmedBookings();
  const navigate = useNavigate();
  const { user } = useAuth();

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    
    // Use Intl.DateTimeFormat to properly handle Mauritius timezone
    const mauritiusTime = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Indian/Mauritius',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
    
    // Get current date in Mauritius timezone for comparison
    const nowInMauritius = new Date().toLocaleDateString('en-CA', {
      timeZone: 'Indian/Mauritius'
    });
    
    const eventDateInMauritius = date.toLocaleDateString('en-CA', {
      timeZone: 'Indian/Mauritius'
    });
    
    // Check if it's today
    if (eventDateInMauritius === nowInMauritius) {
      return `Today @ ${mauritiusTime}`;
    }
    
    // Check if it's tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowInMauritius = tomorrow.toLocaleDateString('en-CA', {
      timeZone: 'Indian/Mauritius'
    });
    
    if (eventDateInMauritius === tomorrowInMauritius) {
      return `Tomorrow @ ${mauritiusTime}`;
    }
    
    // Otherwise show day name and date
    const dayName = date.toLocaleDateString('en-US', {
      timeZone: 'Indian/Mauritius',
      weekday: 'long'
    });
    
    const monthDay = date.toLocaleDateString('en-US', {
      timeZone: 'Indian/Mauritius',
      month: 'short',
      day: 'numeric'
    });
    
    return `${dayName}, ${monthDay} @ ${mauritiusTime}`;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
  };

  const handleAddResults = (bookingId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectMatch(bookingId);
  };

  const handleEdit = (bookingId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/edit-booking/${bookingId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="animate-pulse text-muted-foreground">Loading matches...</div>
      </div>
    );
  }

  if (confirmedBookings.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground">No confirmed matches</div>
        <p className="text-sm text-muted-foreground mt-1">Create a match to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {confirmedBookings.map((booking) => {
        const formattedDateTime = formatDateTime(booking.start_time);
        
        return (
          <Card
            key={booking.booking_id}
            className={`transition-all ${
              selectedMatchId === booking.booking_id 
                ? "ring-2 ring-primary bg-primary/5" 
                : "hover:shadow-md"
            } ${(booking as any)._isOptimistic ? "optimistic-blink bg-primary/5" : ""}`}
            onClick={() => onSelectMatch(booking.booking_id)}
          >
            <CardContent className="p-3 sm:p-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base leading-tight">{formattedDateTime}</span>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-muted-foreground leading-tight">{booking.venue_name}</span>
                  </div>
                </div>
                
                {/* Players - Mobile optimized */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>Players</span>
                  </div>
                  
                  {booking.participants.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      {(() => {
                        // Sort participants to put current user first
                        const sortedParticipants = [...booking.participants].sort((a, b) => {
                          if (a.player_id === user?.id) return -1;
                          if (b.player_id === user?.id) return 1;
                          return 0;
                        });
                        
                        return sortedParticipants.map((participant, index) => (
                          <div key={participant.player_id} className="flex items-center gap-1.5">
                            <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                              <AvatarImage src={participant.profile_photo} />
                              <AvatarFallback className="text-xs">
                                {getInitials(participant.first_name, participant.last_name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs sm:text-sm font-medium">
                              {participant.player_id === user?.id ? "You" : participant.first_name}
                            </span>
                            {index < sortedParticipants.length - 1 && (
                              <span className="text-muted-foreground text-xs mx-0.5">•</span>
                            )}
                          </div>
                        ));
                      })()}
                    </div>
                  )}
                </div>

                {/* CTAs - Side by side on mobile */}
                <div className="flex gap-2 pt-2 border-t">
                  {(booking as any)._isOptimistic ? (
                    <div className="flex-1 flex items-center justify-center py-2">
                      <span className="text-xs text-muted-foreground">Creating booking...</span>
                    </div>
                  ) : (
                    <>
                      <Button 
                        onClick={(e) => handleAddResults(booking.booking_id, e)}
                        className="flex-1 h-8 sm:h-9"
                        size="sm"
                      >
                        <span className="text-xs sm:text-sm">Add Scores</span>
                      </Button>
                      <Button 
                        onClick={(e) => handleEdit(booking.booking_id, e)}
                        variant="outline"
                        className="flex-1 h-8 sm:h-9"
                        size="sm"
                      >
                        <span className="text-xs sm:text-sm">Edit</span>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};