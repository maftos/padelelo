import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useConfirmedBookings } from "@/hooks/use-confirmed-bookings";
import { Clock, Users, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

interface ConfirmedMatchesListProps {
  onSelectMatch: (bookingId: string) => void;
  selectedMatchId?: string;
}

export const ConfirmedMatchesList = ({ onSelectMatch, selectedMatchId }: ConfirmedMatchesListProps) => {
  const { confirmedBookings, isLoading } = useConfirmedBookings();
  const navigate = useNavigate();

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    };
    const formattedDate = date.toLocaleDateString('en-GB', options);
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add ordinal suffix to day
    const day = date.getDate();
    const suffix = day % 10 === 1 && day !== 11 ? 'st' : 
                   day % 10 === 2 && day !== 12 ? 'nd' : 
                   day % 10 === 3 && day !== 13 ? 'rd' : 'th';
    
    return formattedDate.replace(`${day}`, `${day}${suffix}`) + ` @ ${time}`;
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
            }`}
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
                      {booking.participants.slice(0, 3).map((participant, index) => (
                        <div key={participant.player_id} className="flex items-center gap-1.5">
                          <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                            <AvatarImage src={participant.profile_photo} />
                            <AvatarFallback className="text-xs">
                              {getInitials(participant.first_name, participant.last_name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs sm:text-sm font-medium">{participant.first_name}</span>
                          {index < booking.participants.length - 1 && (
                            <span className="text-muted-foreground text-xs mx-0.5">•</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* CTAs - Side by side on mobile */}
                <div className="flex gap-2 pt-2 border-t">
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
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};