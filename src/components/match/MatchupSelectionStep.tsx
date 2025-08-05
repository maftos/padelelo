
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

interface MatchupSelectionStepProps {
  players: Player[];
  selectedMatchups: SelectedMatchup[];
  onMatchupSelect: (matchup: { id: string; team1: [string, string]; team2: [string, string] }) => void;
}

export const MatchupSelectionStep = ({ players, selectedMatchups, onMatchupSelect }: MatchupSelectionStepProps) => {
  const getPlayerName = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return "Unknown";
    
    // Extract only the first name
    const firstName = player.name.split(' ')[0];
    return firstName === "Me" ? "You" : firstName;
  };

  const getPlayerPhoto = (playerId: string) => {
    return players.find(p => p.id === playerId)?.photo || "";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Generate all possible matchup combinations
  const generatePossibleMatchups = () => {
    // Ensure we have exactly 4 players before generating matchups
    if (players.length !== 4 || players.some(p => !p || !p.id)) {
      return [];
    }
    
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

  // Get the unified match numbers for this specific matchup
  const getMatchupNumbers = (matchupId: string) => {
    return selectedMatchups
      .filter(m => m.id === matchupId)
      .map(m => m.order);
  };

  const handleMatchupClick = (matchup: typeof possibleMatchups[0]) => {
    onMatchupSelect({
      id: matchup.id,
      team1: matchup.team1,
      team2: matchup.team2
    });
  };

  const TeamDisplay = ({ team }: { team: [string, string] }) => (
    <div className="flex flex-col items-center gap-2">
      {team.map((playerId) => (
        <div key={playerId} className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={getPlayerPhoto(playerId)} />
            <AvatarFallback className="text-xs">
              {getInitials(getPlayerName(playerId))}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{getPlayerName(playerId)}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4 md:max-w-md md:mx-auto">
      {possibleMatchups.map((matchup) => {
        const matchNumbers = getMatchupNumbers(matchup.id);
        
        return (
          <Card 
            key={matchup.id} 
            className="border-dashed hover:bg-accent/50 cursor-pointer hover:shadow-md transition-all duration-300 relative"
            onClick={() => handleMatchupClick(matchup)}
          >
            {matchNumbers.length > 0 && (
              <div className="absolute -top-2 -right-2 z-10 flex flex-wrap gap-1">
                {matchNumbers.map((matchNumber, index) => (
                  <Badge 
                    key={index}
                    className="bg-primary text-primary-foreground min-w-6 h-6 flex items-center justify-center rounded-full"
                  >
                    {matchNumber}
                  </Badge>
                ))}
              </div>
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
