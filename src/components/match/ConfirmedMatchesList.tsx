
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { useConfirmedMatches } from "@/hooks/use-confirmed-matches";

interface ConfirmedMatchesListProps {
  onSelectMatch?: (matchId: string) => void;
  selectedMatchId?: string;
}

export const ConfirmedMatchesList = ({ onSelectMatch, selectedMatchId }: ConfirmedMatchesListProps) => {
  const { confirmedMatches, isLoading } = useConfirmedMatches();

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-primary/30 animate-pulse"></div>
          <div className="w-3 h-3 rounded-full bg-primary/30 animate-pulse delay-100"></div>
          <div className="w-3 h-3 rounded-full bg-primary/30 animate-pulse delay-200"></div>
        </div>
        <p className="text-muted-foreground mt-4">Loading confirmed matches...</p>
      </div>
    );
  }

  if (confirmedMatches.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
          <Calendar className="w-8 h-8 text-primary/50" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No confirmed matches</h3>
        <p className="text-muted-foreground">Your confirmed matches will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {confirmedMatches.map((match) => (
        <Card key={match.booking_id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex flex-col space-y-3">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-foreground">{match.title}</h3>
                <p className="text-sm text-muted-foreground">{match.description}</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                  Confirmed
                </span>
              </div>
            </div>

            {/* Match Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{new Date(match.start_time).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{new Date(match.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{match.venue_name}</span>
              </div>
            </div>

            {/* Participants */}
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <div className="flex -space-x-2">
                {match.participants.map((participant, index) => (
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
                {match.player_count} players
              </span>
            </div>

            {/* Actions */}
            {onSelectMatch && (
              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectMatch(match.booking_id)}
                  className="text-xs"
                >
                  Add Results
                </Button>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};
