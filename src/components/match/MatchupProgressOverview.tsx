
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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
  currentIndex: number;
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
    const player = players.find(p => p.id === playerId);
    if (!player) return "Unknown";
    
    const firstName = player.name.split(' ')[0];
    return firstName === "Me" ? "You" : firstName;
  };

  const getPlayerPhoto = (playerId: string) => {
    return players.find(p => p.id === playerId)?.photo || "";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const isCompleted = (index: number) => {
    const matchup = selectedMatchups[index];
    return queuedResults.some(result => 
      result.team1[0] === matchup.team1[0] && 
      result.team1[1] === matchup.team1[1] &&
      result.team2[0] === matchup.team2[0] && 
      result.team2[1] === matchup.team2[1]
    );
  };

  const TeamDisplay = ({ team }: { team: [string, string] }) => (
    <div className="flex flex-col items-center gap-1">
      {team.map((playerId) => (
        <div key={playerId} className="flex items-center gap-1">
          <Avatar className="h-4 w-4">
            <AvatarImage src={getPlayerPhoto(playerId)} />
            <AvatarFallback className="text-xs">
              {getInitials(getPlayerName(playerId))}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium">{getPlayerName(playerId)}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-muted-foreground">Match Progress</div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {selectedMatchups.map((matchup, index) => {
          const completed = isCompleted(index);
          const isCurrent = index === currentIndex;
          
          return (
            <Card 
              key={`${matchup.id}-${index}`}
              className={`
                min-w-fit border transition-all duration-200
                ${isCurrent 
                  ? "border-primary bg-primary/5 shadow-md" 
                  : completed 
                    ? "border-green-500 bg-green-50" 
                    : "border-muted bg-muted/30"
                }
              `}
            >
              <CardContent className="p-3 relative">
                <Badge 
                  className={`
                    absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center rounded-full text-xs
                    ${completed ? "bg-green-500" : isCurrent ? "bg-primary" : "bg-muted-foreground"}
                  `}
                >
                  {matchup.order}
                </Badge>
                
                <div className="flex items-center gap-2 pt-1">
                  <TeamDisplay team={matchup.team1} />
                  <div className="text-xs font-bold text-muted-foreground px-1">VS</div>
                  <TeamDisplay team={matchup.team2} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
