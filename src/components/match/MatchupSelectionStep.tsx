
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
    <div className="flex flex-col items-center gap-2 min-w-0">
      {team.map((playerId) => (
        <div key={playerId} className="flex items-center gap-2 min-w-0">
          <Avatar className="h-8 w-8 md:h-6 md:w-6 shrink-0">
            <AvatarImage src={getPlayerPhoto(playerId)} />
            <AvatarFallback className="text-xs">
              {getInitials(getPlayerName(playerId))}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium truncate">
            {getPlayerName(playerId)}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="text-center text-sm text-muted-foreground mb-6">
        Tap a matchup to add it to your sequence
      </div>
      
      {possibleMatchups.map((matchup) => {
        const matchNumbers = getMatchupNumbers(matchup.id);
        
        return (
          <Card 
            key={matchup.id} 
            className="border-dashed hover:bg-accent/50 active:bg-accent/70 cursor-pointer hover:shadow-md transition-all duration-200 relative touch-manipulation"
            onClick={() => handleMatchupClick(matchup)}
          >
            {matchNumbers.length > 0 && (
              <div className="absolute -top-2 -right-2 z-10 flex flex-wrap gap-1">
                {matchNumbers.map((matchNumber, index) => (
                  <Badge 
                    key={index}
                    className="bg-primary text-primary-foreground min-w-8 h-8 md:min-w-6 md:h-6 flex items-center justify-center rounded-full text-sm md:text-xs"
                  >
                    {matchNumber}
                  </Badge>
                ))}
              </div>
            )}
            <CardContent className="p-6 md:p-4">
              <div className="flex items-center justify-between gap-4">
                <TeamDisplay team={matchup.team1} />
                <div className="text-xl md:text-lg font-bold text-muted-foreground px-2 shrink-0">VS</div>
                <TeamDisplay team={matchup.team2} />
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      {/* Selection summary */}
      {selectedMatchups.length > 0 && (
        <div className="mt-6 p-4 bg-primary/5 rounded-lg border">
          <div className="text-sm font-medium text-center">
            {selectedMatchups.length} match{selectedMatchups.length > 1 ? 'es' : ''} selected
          </div>
        </div>
      )}
    </div>
  );
};
