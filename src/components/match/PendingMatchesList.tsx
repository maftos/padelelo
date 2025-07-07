
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TeamDisplay } from "./TeamDisplay";
import { usePendingMatches } from "@/hooks/use-pending-matches";
import { usePlayerSelection } from "@/hooks/match/use-player-selection";
import { Trash2, Users } from "lucide-react";

interface PendingMatchesListProps {
  onSelectMatch: (matchId: string) => void;
  selectedMatchId?: string;
}

export const PendingMatchesList = ({ onSelectMatch, selectedMatchId }: PendingMatchesListProps) => {
  const { pendingMatches, isLoading, deletePendingMatch, isDeletingMatch } = usePendingMatches();
  const { getPlayerName } = usePlayerSelection();

  const getPlayerPhoto = (playerId: string) => {
    // This will need to be implemented to get actual player photos
    return "";
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Pending Matches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-pulse text-muted-foreground">Loading matches...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (pendingMatches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Pending Matches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-muted-foreground">No pending matches</div>
            <p className="text-sm text-muted-foreground mt-1">Create a match below to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Pending Matches ({pendingMatches.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {pendingMatches.map((match) => (
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
                <div className="flex items-center gap-4 flex-1">
                  <TeamDisplay
                    player1DisplayName={getPlayerName(match.team1_player1_id)}
                    player1ProfilePhoto={getPlayerPhoto(match.team1_player1_id)}
                    player2DisplayName={getPlayerName(match.team1_player2_id)}
                    player2ProfilePhoto={getPlayerPhoto(match.team1_player2_id)}
                    player1IsCompleter={false}
                    player2IsCompleter={false}
                  />
                  <div className="text-center font-semibold text-muted-foreground">VS</div>
                  <TeamDisplay
                    player1DisplayName={getPlayerName(match.team2_player1_id)}
                    player1ProfilePhoto={getPlayerPhoto(match.team2_player1_id)}
                    player2DisplayName={getPlayerName(match.team2_player2_id)}
                    player2ProfilePhoto={getPlayerPhoto(match.team2_player2_id)}
                    isRightAligned
                    player1IsCompleter={false}
                    player2IsCompleter={false}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePendingMatch(match.match_id);
                  }}
                  disabled={isDeletingMatch}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Created {new Date(match.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};
