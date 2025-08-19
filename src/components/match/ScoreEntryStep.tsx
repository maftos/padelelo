
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScoreSequenceInput } from "@/components/ui/score-sequence-input";

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

  // Reset scores when currentIndex changes
  useEffect(() => {
    setTeam1Score("");
    setTeam2Score("");
    setIsSubmitting(false);
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

  const handleScoresChange = (score1: string, score2: string) => {
    setTeam1Score(score1);
    setTeam2Score(score2);
  };

  const handleComplete = async () => {
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
    
    // Move to next matchup immediately if available
    if (currentIndex < selectedMatchups.length - 1 && onIndexChange) {
      onIndexChange(currentIndex + 1);
    }
    setIsSubmitting(false);
  };

  const TeamDisplay = ({ team }: { team: [string, string] }) => (
    <div className="flex flex-col gap-2">
      {team.map((playerId) => (
        <div key={playerId} className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={getPlayerPhoto(playerId)} />
            <AvatarFallback className="text-xs">
              {getInitials(getPlayerName(playerId))}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">
            {getPlayerName(playerId) === "Me" ? "You" : getPlayerName(playerId)}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="text-center text-sm text-muted-foreground">
        Match {currentIndex + 1} of {selectedMatchups.length}
      </div>
      
      {/* Teams layout */}
      <div className="space-y-4 mb-6">
        {/* Team 1 and Team 2 players */}
        <div className="flex items-center justify-between">
          {/* Team 1 players */}
          <div className="flex-1">
            <TeamDisplay team={currentMatchup.team1} />
          </div>
          
          {/* VS */}
          <div className="text-lg font-bold text-muted-foreground px-4">
            VS
          </div>
          
          {/* Team 2 players */}
          <div className="flex-1 flex justify-end">
            <TeamDisplay team={currentMatchup.team2} />
          </div>
        </div>
        
        {/* Sequential score input */}
        <ScoreSequenceInput
          key={`matchup-${currentIndex}`}
          onScoresChange={handleScoresChange}
          onComplete={handleComplete}
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
};
