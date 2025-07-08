
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOpenGames } from "@/hooks/use-open-games";
import { Clock, Users, Eye, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface OpenGamesListProps {
  onViewApplicants: (gameId: string) => void;
}

export const OpenGamesList = ({ onViewApplicants }: OpenGamesListProps) => {
  const { openGames, isLoading } = useOpenGames();

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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getSpotsRemaining = (playerCount: number) => {
    return 4 - playerCount;
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="animate-pulse text-muted-foreground">Loading open games...</div>
      </div>
    );
  }

  if (openGames.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground">No open games</div>
        <p className="text-sm text-muted-foreground mt-1">Your created games that need more players will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {openGames.map((game) => {
        const formattedDateTime = formatDateTime(game.start_time);
        const spotsRemaining = getSpotsRemaining(game.player_count);
        
        return (
          <Card key={game.booking_id} className="transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-medium">{formattedDateTime}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{game.venue_name}</span>
                    </div>

                    {game.title && (
                      <div className="mb-2">
                        <span className="text-sm font-medium">{game.title}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {game.player_count}/4 players • {spotsRemaining} spot{spotsRemaining !== 1 ? 's' : ''} remaining
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {game.participants.map((participant, index) => (
                        <div key={participant.player_id} className="flex items-center gap-1">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={participant.profile_photo} />
                            <AvatarFallback className="text-xs">
                              {getInitials(`${participant.first_name} ${participant.last_name}`)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{participant.first_name} {participant.last_name}</span>
                          {index < game.participants.length - 1 && (
                            <span className="text-muted-foreground mx-1">•</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Button 
                    onClick={() => onViewApplicants(game.booking_id)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Applicants
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
