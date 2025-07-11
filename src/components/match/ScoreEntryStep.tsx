
import React, { useState, useRef, useEffect } from "react";
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
  const [team1Score, setTeam1Score] = useState<string>("");
  const [team2Score, setTeam2Score] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const team1InputRef = useRef<HTMLInputElement>(null);
  const team2InputRef = useRef<HTMLInputElement>(null);

  // Reset scores when currentIndex changes
  useEffect(() => {
    setTeam1Score("");
    setTeam2Score("");
    setIsSubmitting(false);
    // Focus first input after a short delay to ensure proper rendering
    setTimeout(() => {
      team1InputRef.current?.focus();
    }, 100);
  }, [currentIndex]);

  // Focus first input on initial load
  useEffect(() => {
    setTimeout(() => {
      team1InputRef.current?.focus();
    }, 100);
  }, []);

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

  const handleTeam1ScoreChange = (value: string) => {
    // Prevent non-numeric input, negative numbers, and numbers > 9
    const numValue = parseInt(value) || 0;
    if (value === "" || (numValue >= 0 && numValue <= 9)) {
      setTeam1Score(value);
    }
  };

  const handleTeam2ScoreChange = (value: string) => {
    // Prevent non-numeric input, negative numbers, and numbers > 9
    const numValue = parseInt(value) || 0;
    if (value === "" || (numValue >= 0 && numValue <= 9)) {
      setTeam2Score(value);
    }
  };

  const handleTeam1KeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && team1Score.trim()) {
      e.preventDefault();
      team2InputRef.current?.focus();
    }
  };

  const handleTeam2KeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && team2Score.trim()) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const score1 = parseInt(team1Score) || 0;
    const score2 = parseInt(team2Score) || 0;
    
    if (team1Score.trim() === "" || team2Score.trim() === "") {
      return; // Don't submit if either score is empty
    }

    setIsSubmitting(true);
    
    const result: QueuedResult = {
      id: `${currentMatchup.id}-${currentMatchup.order}-${Date.now()}`,
      team1: currentMatchup.team1,
      team2: currentMatchup.team2,
      team1Score: score1,
      team2Score: score2
    };
    
    onAddResult(result);
    
    // Small delay to show the submission state
    setTimeout(() => {
      // Move to next matchup if available
      if (currentIndex < selectedMatchups.length - 1 && onIndexChange) {
        onIndexChange(currentIndex + 1);
      }
      setIsSubmitting(false);
    }, 300);
  };

  const canSubmit = team1Score.trim() !== "" && team2Score.trim() !== "" && !isSubmitting;

  const TeamDisplay = ({ team }: { team: [string, string] }) => (
    <div className="flex flex-col gap-2">
      {team.map((playerId) => (
        <div key={playerId} className="flex items-center gap-2">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={getPlayerPhoto(playerId)} />
            <AvatarFallback className="text-xs">
              {getInitials(getPlayerName(playerId))}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium truncate">
            {getPlayerName(playerId) === "Me" ? "You" : getPlayerName(playerId)}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 max-w-lg mx-auto px-4">
      <div className="text-center text-sm text-muted-foreground">
        Match {currentIndex + 1} of {selectedMatchups.length}
      </div>
      
      <Card className="border-primary bg-primary/5 shadow-lg">
        <CardContent className="p-4 sm:p-6">
          {/* Mobile-optimized layout */}
          <div className="space-y-6">
            {/* Team 1 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <TeamDisplay team={currentMatchup.team1} />
                </div>
                <div className="flex-shrink-0">
                  <Input
                    ref={team1InputRef}
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={team1Score}
                    onChange={(e) => handleTeam1ScoreChange(e.target.value)}
                    onKeyDown={handleTeam1KeyDown}
                    placeholder="0"
                    className="w-16 h-16 text-center text-2xl font-bold border-2"
                    min="0"
                    max="9"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground font-semibold">VS</span>
              </div>
            </div>

            {/* Team 2 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <TeamDisplay team={currentMatchup.team2} />
                </div>
                <div className="flex-shrink-0">
                  <Input
                    ref={team2InputRef}
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={team2Score}
                    onChange={(e) => handleTeam2ScoreChange(e.target.value)}
                    onKeyDown={handleTeam2KeyDown}
                    placeholder="0"
                    className="w-16 h-16 text-center text-2xl font-bold border-2"
                    min="0"
                    max="9"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save button */}
          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`
                w-full max-w-xs h-12 text-base font-semibold transition-all duration-200
                ${canSubmit 
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                  : "bg-muted text-muted-foreground cursor-not-allowed"
                }
              `}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Instructions */}
      <div className="text-center text-xs sm:text-sm text-muted-foreground space-y-1">
        <p>Enter scores and press Enter to move to next field</p>
        <p>Or tap Save to confirm this match result</p>
      </div>
    </div>
  );
};
