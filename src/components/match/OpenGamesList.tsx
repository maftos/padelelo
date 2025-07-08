
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock, Eye } from "lucide-react";
import { useOpenGames } from "@/hooks/use-open-games";

interface OpenGamesListProps {
  onViewApplicants?: (gameId: string) => void;
}

export const OpenGamesList = ({ onViewApplicants }: OpenGamesListProps) => {
  const { openGames, isLoading } = useOpenGames();

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-primary/30 animate-pulse"></div>
          <div className="w-3 h-3 rounded-full bg-primary/30 animate-pulse delay-100"></div>
          <div className="w-3 h-3 rounded-full bg-primary/30 animate-pulse delay-200"></div>
        </div>
        <p className="text-muted-foreground mt-4">Loading open games...</p>
      </div>
    );
  }

  if (openGames.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
          <Users className="w-8 h-8 text-primary/50" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No open games</h3>
        <p className="text-muted-foreground">Create a new game to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {openGames.map((game) => (
        <Card key={game.booking_id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex flex-col space-y-3">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-foreground">{game.title}</h3>
                <p className="text-sm text-muted-foreground">{game.description}</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                  Open Game
                </span>
              </div>
            </div>

            {/* Game Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{new Date(game.start_time).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{new Date(game.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{game.venue_name}</span>
              </div>
            </div>

            {/* Participants */}
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <div className="flex -space-x-2">
                {game.participants.map((participant, index) => (
                  <div
                    key={participant.player_id}
                    className="w-8 h-8 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs font-medium"
                    title={`${participant.first_name} ${participant.last_name}`}
                  >
                    {participant.first_name?.[0]}{participant.last_name?.[0]}
                  </div>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {game.player_count}/4 players
              </span>
            </div>

            {/* Actions */}
            {onViewApplicants && (
              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewApplicants(game.booking_id)}
                  className="text-xs flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  View Applicants
                </Button>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};
