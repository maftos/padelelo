import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Player {
  id: string;
  name: string;
  photo?: string;
}

interface QueuedResult {
  id: string;
  team1: [string, string];
  team2: [string, string];
  team1Score: number;
  team2Score: number;
}

interface ResultsCartProps {
  queuedResults: QueuedResult[];
  players: Player[];
  onRemoveResult: (resultId: string) => void;
}

export const ResultsCart = ({ queuedResults, players, onRemoveResult }: ResultsCartProps) => {
  const getPlayerPhoto = (playerId: string) => {
    return players.find(p => p.id === playerId)?.photo || "";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getPlayerName = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    return player?.name === "Me" ? "You" : player?.name || "Unknown";
  };

  if (queuedResults.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-4 text-center text-muted-foreground">
          <p className="text-sm">No results added yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <h3 className="font-medium text-sm text-muted-foreground">Results to Save ({queuedResults.length})</h3>
          {queuedResults.map((result) => (
            <div key={result.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-4">
                {/* Team 1 */}
                <div className="flex items-center gap-1">
                  {result.team1.map((playerId) => (
                    <Avatar key={playerId} className="h-6 w-6">
                      <AvatarImage src={getPlayerPhoto(playerId)} />
                      <AvatarFallback className="text-xs">
                        {getInitials(getPlayerName(playerId))}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  <span className="font-bold text-lg ml-1">{result.team1Score}</span>
                </div>

                <span className="text-muted-foreground text-sm">vs</span>

                {/* Team 2 */}
                <div className="flex items-center gap-1">
                  <span className="font-bold text-lg mr-1">{result.team2Score}</span>
                  {result.team2.map((playerId) => (
                    <Avatar key={playerId} className="h-6 w-6">
                      <AvatarImage src={getPlayerPhoto(playerId)} />
                      <AvatarFallback className="text-xs">
                        {getInitials(getPlayerName(playerId))}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveResult(result.id)}
                className="h-6 w-6 p-0 hover:bg-destructive/20"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};