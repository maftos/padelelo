
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
    
    return acc;
  }, {} as Record<string, { matchup: SelectedMatchup; indices: number[]; results: QueuedResult[] }>);

  // Get results for each grouped matchup by finding results that match the selected matchups
  Object.keys(groupedMatchups).forEach(key => {
    const group = groupedMatchups[key];
    // Find results for each index in this group
    group.results = group.indices.map(index => {
      const matchup = selectedMatchups[index];
      // Find a result that matches this specific matchup instance
      return queuedResults.find(result => 
        result.team1[0] === matchup.team1[0] && 
        result.team1[1] === matchup.team1[1] &&
        result.team2[0] === matchup.team2[0] && 
        result.team2[1] === matchup.team2[1] &&
        result.id.includes(`-${matchup.order}-`) // Match by order to get the specific set
      );
    }).filter(Boolean) as QueuedResult[];
  });

  const getMatchupStatus = (indices: number[]) => {
    const hasAllResults = indices.every(index => {
      const matchup = selectedMatchups[index];
      return queuedResults.some(result => 
        result.team1[0] === matchup.team1[0] && 
        result.team1[1] === matchup.team1[1] &&
        result.team2[0] === matchup.team2[0] && 
        result.team2[1] === matchup.team2[1] &&
        result.id.includes(`-${matchup.order}-`)
      );
    });
    
    if (hasAllResults) return "completed";
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
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">Progress</h3>
        <div className="text-xs text-muted-foreground">
          Tap to jump to match
        </div>
      </div>
      
      {/* Mobile-optimized vertical layout on small screens */}
      <div className="md:flex md:gap-2 md:overflow-x-auto md:pb-2 space-y-2 md:space-y-0">
        {Object.entries(groupedMatchups).map(([key, { matchup, indices, results }], index) => {
          const status = getMatchupStatus(indices);
          const isClickable = status !== "pending" || indices.includes(currentIndex || -1);
          
          return (
            <Card
              key={key}
              className={`
                transition-all duration-200 relative
                md:min-w-fit w-full
                ${status === "current" 
                  ? "ring-2 ring-primary bg-primary/10" 
                  : status === "completed" 
                    ? "border-green-500 bg-green-50/50" 
                    : "opacity-60"
                }
                ${isClickable ? "cursor-pointer hover:shadow-md" : ""}
              `}
              onClick={() => isClickable && onMatchupClick && onMatchupClick(indices[0])}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  {/* Match number indicator */}
                  <div className="text-xs font-medium text-muted-foreground w-8">
                    #{index + 1}
                  </div>
                  
                  {/* Compact team display for mobile */}
                  <div className="flex items-center gap-2 flex-1 justify-center">
                    <div className="flex items-center gap-1">
                      <PlayerAvatar playerId={matchup.team1[0]} />
                      <PlayerAvatar playerId={matchup.team1[1]} />
                    </div>
                    
                    <div className="text-xs text-muted-foreground">vs</div>
                    
                    <div className="flex items-center gap-1">
                      <PlayerAvatar playerId={matchup.team2[0]} />
                      <PlayerAvatar playerId={matchup.team2[1]} />
                    </div>
                  </div>
                  
                  {/* Status indicator */}
                  <div className="w-8 flex justify-end">
                    {status === "completed" && (
                      <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                    {status === "current" && (
                      <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>
                </div>
                
                {/* Scores display for completed matches */}
                {results.length > 0 && (
                  <div className="flex justify-center gap-2 mt-2 pt-2 border-t">
                    {results.map((result, setIndex) => (
                      <div key={setIndex} className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                        {result.team1Score}-{result.team2Score}
                      </div>
                    ))}
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
