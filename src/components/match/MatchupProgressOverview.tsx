
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

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

  const PlayerAvatar = ({ playerId }: { playerId: string }) => (
    <Avatar className="h-4 w-4">
      <AvatarImage src={getPlayerPhoto(playerId)} />
      <AvatarFallback className="text-[8px]">
        {getInitials(getPlayerName(playerId))}
      </AvatarFallback>
    </Avatar>
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
                min-w-[120px] cursor-pointer transition-all duration-200
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
                <div className="flex items-start gap-3">
                  {/* Player photos in 2x2 grid */}
                  <div className="flex flex-col gap-1">
                    {/* Team 1 players (top row) */}
                    <div className="flex items-center gap-1">
                      <PlayerAvatar playerId={matchup.team1[0]} />
                      <PlayerAvatar playerId={matchup.team1[1]} />
                    </div>
                    
                    {/* Horizontal divider */}
                    <div className="h-px bg-border my-1" />
                    
                    {/* Team 2 players (bottom row) */}
                    <div className="flex items-center gap-1">
                      <PlayerAvatar playerId={matchup.team2[0]} />
                      <PlayerAvatar playerId={matchup.team2[1]} />
                    </div>
                  </div>
                  
                  {/* Scores on the right */}
                  {result && (
                    <div className="flex flex-col items-center justify-center ml-auto">
                      <div className="text-xs font-medium text-green-700">
                        {result.team1Score}
                      </div>
                      <div className="text-xs font-medium text-green-700">
                        {result.team2Score}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
