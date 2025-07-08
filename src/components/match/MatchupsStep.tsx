import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, X, Users } from "lucide-react";

interface Player {
  id: string;
  name: string;
  photo?: string;
}

interface Matchup {
  id: string;
  team1: [string, string];
  team2: [string, string];
}

interface MatchupsStepProps {
  players: Player[];
  matchups: Matchup[];
  onMatchupsChange: (matchups: Matchup[]) => void;
}

export const MatchupsStep = ({ players, matchups, onMatchupsChange }: MatchupsStepProps) => {
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
        label: `${p1.name} & ${p2.name} vs ${p3.name} & ${p4.name}`,
        team1: [p1.id, p2.id] as [string, string],
        team2: [p3.id, p4.id] as [string, string]
      },
      {
        id: "matchup-2", 
        label: `${p1.name} & ${p3.name} vs ${p2.name} & ${p4.name}`,
        team1: [p1.id, p3.id] as [string, string],
        team2: [p2.id, p4.id] as [string, string]
      },
      {
        id: "matchup-3",
        label: `${p1.name} & ${p4.name} vs ${p2.name} & ${p3.name}`,
        team1: [p1.id, p4.id] as [string, string],
        team2: [p2.id, p3.id] as [string, string]
      }
    ];
  };

  const possibleMatchups = generatePossibleMatchups();

  const toggleMatchup = (matchup: typeof possibleMatchups[0]) => {
    const isSelected = matchups.some(m => 
      m.team1[0] === matchup.team1[0] && 
      m.team1[1] === matchup.team1[1] && 
      m.team2[0] === matchup.team2[0] && 
      m.team2[1] === matchup.team2[1]
    );

    if (isSelected) {
      // Remove matchup
      onMatchupsChange(matchups.filter(m => 
        !(m.team1[0] === matchup.team1[0] && 
          m.team1[1] === matchup.team1[1] && 
          m.team2[0] === matchup.team2[0] && 
          m.team2[1] === matchup.team2[1])
      ));
    } else {
      // Add matchup
      const newMatchup: Matchup = {
        id: `${matchup.id}-${Date.now()}`,
        team1: matchup.team1,
        team2: matchup.team2
      };
      onMatchupsChange([...matchups, newMatchup]);
    }
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

  const isMatchupSelected = (matchup: typeof possibleMatchups[0]) => {
    return matchups.some(m => 
      m.team1[0] === matchup.team1[0] && 
      m.team1[1] === matchup.team1[1] && 
      m.team2[0] === matchup.team2[0] && 
      m.team2[1] === matchup.team2[1]
    );
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {possibleMatchups.map((matchup) => (
        <Card 
          key={matchup.id} 
          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
            isMatchupSelected(matchup) 
              ? "border-primary bg-primary/5 shadow-md" 
              : "border-dashed hover:bg-accent/50"
          }`}
          onClick={() => toggleMatchup(matchup)}
        >
          <CardContent className="p-6">
            <div className="space-y-4 text-center">
              <TeamDisplay team={matchup.team1} />
              <div className="text-xl font-bold text-muted-foreground">VS</div>
              <TeamDisplay team={matchup.team2} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};