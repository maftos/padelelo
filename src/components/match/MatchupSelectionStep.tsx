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
}

interface MatchupSelectionStepProps {
  players: Player[];
  selectedMatchups: SelectedMatchup[];
  onMatchupSelect: (matchup: { id: string; team1: [string, string]; team2: [string, string] }) => void;
}

export const MatchupSelectionStep = ({ players, selectedMatchups, onMatchupSelect }: MatchupSelectionStepProps) => {
  const getPlayerName = (playerId: string) => {
    return players.find(p => p.id === playerId)?.name || "Unknown";
  };

  const getPlayerPhoto = (playerId: string) => {
    return players.find(p => p.id === playerId)?.photo || "";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Generate all possible matchup combinations
  const generatePossibleMatchups = () => {
    const [p1, p2, p3, p4] = players;
    return [
      {
        id: "matchup-1",
        team1: [p1.id, p2.id] as [string, string],
        team2: [p3.id, p4.id] as [string, string]
      },
      {
        id: "matchup-2", 
        team1: [p1.id, p3.id] as [string, string],
        team2: [p2.id, p4.id] as [string, string]
      },
      {
        id: "matchup-3",
        team1: [p1.id, p4.id] as [string, string],
        team2: [p2.id, p3.id] as [string, string]
      }
    ];
  };

  const possibleMatchups = generatePossibleMatchups();

  const getMatchupSelectionCount = (matchupId: string) => {
    return selectedMatchups.filter(m => m.id === matchupId).length;
  };

  const handleMatchupClick = (matchup: typeof possibleMatchups[0]) => {
    onMatchupSelect({
      id: matchup.id,
      team1: matchup.team1,
      team2: matchup.team2
    });
  };

  const TeamDisplay = ({ team }: { team: [string, string] }) => (
    <div className="flex items-center justify-center gap-2">
      {team.map((playerId, index) => (
        <div key={playerId} className="flex items-center gap-1">
          <Avatar className="h-6 w-6">
            <AvatarImage src={getPlayerPhoto(playerId)} />
            <AvatarFallback className="text-xs">
              {getInitials(getPlayerName(playerId))}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{getPlayerName(playerId) === "Me" ? "You" : getPlayerName(playerId)}</span>
          {index === 0 && <span className="text-muted-foreground">&</span>}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {possibleMatchups.map((matchup) => {
        const selectionCount = getMatchupSelectionCount(matchup.id);
        
        return (
          <Card 
            key={matchup.id} 
            className="border-dashed hover:bg-accent/50 cursor-pointer hover:shadow-md transition-all duration-300 relative"
            onClick={() => handleMatchupClick(matchup)}
          >
            {selectionCount > 0 && (
              <Badge 
                className="absolute -top-2 -right-2 z-10 bg-primary text-primary-foreground min-w-6 h-6 flex items-center justify-center rounded-full"
              >
                {selectionCount}
              </Badge>
            )}
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <TeamDisplay team={matchup.team1} />
                <div className="text-xl font-bold text-muted-foreground px-4">VS</div>
                <TeamDisplay team={matchup.team2} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};