
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

interface QueuedResult {
  id: string;
  team1: [string, string];
  team2: [string, string];
  team1Score: number;
  team2Score: number;
}

interface ScoreEntryStepProps {
  players: Player[];
  selectedMatchups: SelectedMatchup[];
  currentIndex?: number;
  onAddResult: (result: QueuedResult) => void;
  onIndexChange?: (index: number) => void;
}

export const ScoreEntryStep = ({ 
  players, 
  selectedMatchups, 
  currentIndex = 0,
  onAddResult,
  onIndexChange 
}: ScoreEntryStepProps) => {
  const [team1Score, setTeam1Score] = useState<number | null>(null);
  const [team2Score, setTeam2Score] = useState<number | null>(null);
  const [activeTeam, setActiveTeam] = useState<"team1" | "team2" | null>("team1");

  // Reset scores when currentIndex changes
  React.useEffect(() => {
    setTeam1Score(null);
    setTeam2Score(null);
    setActiveTeam("team1");
  }, [currentIndex]);

  const getPlayerName = (playerId: string) => {
    return players.find(p => p.id === playerId)?.name || "Unknown";
  };

  const getPlayerPhoto = (playerId: string) => {
    return players.find(p => p.id === playerId)?.photo || "";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const currentMatchup = selectedMatchups[currentIndex];
  if (!currentMatchup) return null;

  const handleScoreInput = (value: string, team: "team1" | "team2") => {
    const numValue = parseInt(value) || 0;
    if (team === "team1") {
      setTeam1Score(numValue);
      setActiveTeam("team2");
    } else if (team === "team2") {
      setTeam2Score(numValue);
      
      // Auto-save when second score is entered
      if (team1Score !== null) {
        const result: QueuedResult = {
          id: `${currentMatchup.id}-${currentMatchup.order}-${Date.now()}`,
          team1: currentMatchup.team1,
          team2: currentMatchup.team2,
          team1Score: team1Score,
          team2Score: numValue
        };
        
        onAddResult(result);
        
        // Move to next matchup if available and auto-progression is enabled
        if (currentIndex < selectedMatchups.length - 1 && onIndexChange) {
          onIndexChange(currentIndex + 1);
        }
      }
    }
  };

  const TeamDisplay = ({ team }: { team: [string, string] }) => (
    <div className="flex flex-col items-center gap-2">
      {team.map((playerId) => (
        <div key={playerId} className="flex items-center gap-1">
          <Avatar className="h-6 w-6">
            <AvatarImage src={getPlayerPhoto(playerId)} />
            <AvatarFallback className="text-xs">
              {getInitials(getPlayerName(playerId))}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{getPlayerName(playerId) === "Me" ? "You" : getPlayerName(playerId)}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="text-center text-sm text-muted-foreground mb-4">
        Match {currentIndex + 1} of {selectedMatchups.length}
      </div>
      
      <Card className="border-primary bg-primary/5 shadow-lg">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <TeamDisplay team={currentMatchup.team1} />
              <div className="mt-4">
                <Input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={team1Score !== null ? team1Score.toString() : ""}
                  onChange={(e) => handleScoreInput(e.target.value, "team1")}
                  placeholder="0"
                  className={`w-16 text-center text-lg font-bold transition-all duration-200 ${
                    activeTeam === "team1" 
                      ? "ring-2 ring-primary bg-primary/10" 
                      : "bg-muted"
                  }`}
                  onFocus={() => setActiveTeam("team1")}
                />
              </div>
            </div>
            
            <div className="text-xl font-bold text-muted-foreground px-4">VS</div>
            
            <div className="flex flex-col items-center">
              <TeamDisplay team={currentMatchup.team2} />
              <div className="mt-4">
                <Input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={team2Score !== null ? team2Score.toString() : ""}
                  onChange={(e) => handleScoreInput(e.target.value, "team2")}
                  placeholder="0"
                  className={`w-16 text-center text-lg font-bold transition-all duration-200 ${
                    activeTeam === "team2" 
                      ? "ring-2 ring-primary bg-primary/10" 
                      : "bg-muted"
                  }`}
                  onFocus={() => setActiveTeam("team2")}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
