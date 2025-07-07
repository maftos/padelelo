
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Eye } from "lucide-react";
import { formatDate } from "@/lib/date";
import { format } from "date-fns";
import { useUserOpenGames } from "@/hooks/use-user-open-games";

interface UserOpenGamesListProps {
  onViewApplicants?: (gameId: string) => void;
}

export const UserOpenGamesList = ({ onViewApplicants }: UserOpenGamesListProps) => {
  const { openGames, isLoading } = useUserOpenGames();

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

  return (
    <div className="space-y-4">
      {openGames.map((game) => {
        const filledSpots = getFilledSpots(game);
        const remainingSpots = 4 - filledSpots;
        
        return (
          <Card key={game.match_id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">Open Game</CardTitle>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                      Open
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Created {formatDate(game.created_at)}
                  </p>
                </div>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  {remainingSpots} spot{remainingSpots !== 1 ? 's' : ''} left
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Game Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{format(new Date(game.match_date), "MMM d, yyyy 'at' h:mm a")}</span>
                </div>
                {game.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>Padel Club Mauritius</span>
                  </div>
                )}
              </div>

              {/* Players Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {filledSpots}/4 players joined
                  </span>
                </div>
                
                {/* Action Button */}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewApplicants?.(game.match_id)}
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Applicants
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
