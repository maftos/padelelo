
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface Player {
  id: string;
  name: string;
  photo?: string;
}

interface SelectedMatchup {
  id: string;
  team1: [string, string];
  team2: [string, string];
  order: number;
  matchNumber: number;
}

interface QueuedResult {
  id: string;
  team1: [string, string];
  team2: [string, string];
  team1Score: number;
  team2Score: number;
}

interface MatchupProgressOverviewProps {
  players: Player[];
  selectedMatchups: SelectedMatchup[];
  queuedResults: QueuedResult[];
  currentIndex?: number;
  onMatchupClick?: (index: number) => void;
}

export const MatchupProgressOverview = ({
  players,
  selectedMatchups,
  queuedResults,
  currentIndex,
  onMatchupClick
}: MatchupProgressOverviewProps) => {
  const getPlayerName = (playerId: string) => {
    return players.find(p => p.id === playerId)?.name || "Unknown";
  };

  const getPlayerPhoto = (playerId: string) => {
    return players.find(p => p.id === playerId)?.photo || "";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getMatchupResult = (matchup: SelectedMatchup) => {
    return queuedResults.find(result => 
      result.team1[0] === matchup.team1[0] && 
      result.team1[1] === matchup.team1[1] &&
      result.team2[0] === matchup.team2[0] && 
      result.team2[1] === matchup.team2[1]
    );
  };

  const getMatchupStatus = (index: number, matchup: SelectedMatchup) => {
    const result = getMatchupResult(matchup);
    if (result) return "completed";
    if (currentIndex === index) return "current";
    return "pending";
  };

  const TeamPhotos = ({ team }: { team: [string, string] }) => (
    <div className="flex flex-col gap-1">
      {team.map((playerId) => (
        <Avatar key={playerId} className="h-4 w-4">
          <AvatarImage src={getPlayerPhoto(playerId)} />
          <AvatarFallback className="text-[8px]">
            {getInitials(getPlayerName(playerId))}
          </AvatarFallback>
        </Avatar>
      ))}
    </div>
  );

  if (selectedMatchups.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Match Progress</h3>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {selectedMatchups.map((matchup, index) => {
          const status = getMatchupStatus(index, matchup);
          const result = getMatchupResult(matchup);
          
          return (
            <Card
              key={`${matchup.id}-${matchup.order}`}
              className={`
                min-w-[120px] cursor-pointer transition-all duration-200 relative
                ${status === "current" 
                  ? "ring-2 ring-primary bg-primary/5" 
                  : status === "completed" 
                    ? "bg-green-50 border-green-200" 
                    : "hover:bg-accent/50"
                }
              `}
              onClick={() => onMatchupClick?.(index)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {matchup.order}
                  </Badge>
                  {status === "completed" && (
                    <div className="h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between gap-2">
                  <TeamPhotos team={matchup.team1} />
                  <div className="text-xs text-muted-foreground">VS</div>
                  <TeamPhotos team={matchup.team2} />
                </div>
                
                {result && (
                  <div className="mt-2 text-center">
                    <div className="text-xs font-medium text-green-700">
                      {result.team1Score} - {result.team2Score}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
