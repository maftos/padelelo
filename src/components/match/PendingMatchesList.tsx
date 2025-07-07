
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePendingMatches } from "@/hooks/use-pending-matches";
import { usePlayerSelection } from "@/hooks/match/use-player-selection";
import { Clock, Users } from "lucide-react";

interface PendingMatchesListProps {
  onSelectMatch: (matchId: string) => void;
  selectedMatchId?: string;
}

export const PendingMatchesList = ({ onSelectMatch, selectedMatchId }: PendingMatchesListProps) => {
  const { pendingMatches, isLoading } = usePendingMatches();
  const { getPlayerName } = usePlayerSelection();

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getPlayersList = (match: any) => {
    const players = [
      getPlayerName(match.team1_player1_id),
      getPlayerName(match.team1_player2_id), 
      getPlayerName(match.team2_player1_id),
      getPlayerName(match.team2_player2_id)
    ];
    return players.join(", ");
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="animate-pulse text-muted-foreground">Loading matches...</div>
      </div>
    );
  }

  if (pendingMatches.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground">No pending matches</div>
        <p className="text-sm text-muted-foreground mt-1">Create a match below to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pendingMatches.map((match) => {
        const { date, time } = formatDateTime(match.match_date);
        
        return (
          <Card
            key={match.match_id}
            className={`cursor-pointer transition-all ${
              selectedMatchId === match.match_id 
                ? "ring-2 ring-primary bg-primary/5" 
                : "hover:shadow-md"
            }`}
            onClick={() => onSelectMatch(match.match_id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="font-medium">4 Players Match</span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Players: {getPlayersList(match)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{date} at {time}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
