
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

  // Group matchups by the actual teams to handle multiple sets
  const groupedMatchups = selectedMatchups.reduce((acc, matchup, index) => {
    const key = `${matchup.team1[0]}-${matchup.team1[1]}-${matchup.team2[0]}-${matchup.team2[1]}`;
    if (!acc[key]) {
      acc[key] = {
        matchup,
        indices: [],
        results: []
      };
    }
    acc[key].indices.push(index);
    
    // Find all results for this matchup
    const result = queuedResults.find(result => 
      result.team1[0] === matchup.team1[0] && 
      result.team1[1] === matchup.team1[1] &&
      result.team2[0] === matchup.team2[0] && 
      result.team2[1] === matchup.team2[1]
    );
    if (result) {
      acc[key].results.push(result);
    }
    
    return acc;
  }, {} as Record<string, { matchup: SelectedMatchup; indices: number[]; results: QueuedResult[] }>);

  const getMatchupStatus = (indices: number[]) => {
    const hasResults = indices.some(index => {
      const matchup = selectedMatchups[index];
      return queuedResults.some(result => 
        result.team1[0] === matchup.team1[0] && 
        result.team1[1] === matchup.team1[1] &&
        result.team2[0] === matchup.team2[0] && 
        result.team2[1] === matchup.team2[1]
      );
    });
    
    if (hasResults) return "completed";
    if (indices.includes(currentIndex || -1)) return "current";
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
        {Object.entries(groupedMatchups).map(([key, { matchup, indices, results }]) => {
          const status = getMatchupStatus(indices);
          const playCount = indices.length;
          
          return (
            <Card
              key={key}
              className={`
                cursor-pointer transition-all duration-200
                ${playCount === 1 ? "min-w-[140px]" : playCount === 2 ? "min-w-[160px]" : "min-w-[180px]"}
                ${status === "current" 
                  ? "ring-2 ring-primary bg-primary/5" 
                  : status === "completed" 
                    ? "border-green-500 border-2" 
                    : "hover:bg-accent/50"
                }
              `}
              onClick={() => onMatchupClick?.(indices[0])}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between gap-3">
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
                  
                  {/* Scores aligned with teams */}
                  {results.length > 0 && (
                    <div className="flex flex-col justify-center gap-3">
                      {/* Multiple sets display */}
                      {results.slice(0, playCount).map((result, setIndex) => (
                        <div key={setIndex} className="flex flex-col items-center gap-1">
                          <div className="text-xs font-medium text-green-700">
                            {result.team1Score}
                          </div>
                          <div className="text-xs font-medium text-green-700">
                            {result.team2Score}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Play count indicator for multiple sets */}
                  {playCount > 1 && (
                    <div className="absolute top-1 right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {playCount}
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
