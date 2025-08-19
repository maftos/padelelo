
import React from "react";
import { MatchupCard } from "./MatchupCard";

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

  const handleMatchupComplete = () => {
    console.log("handleMatchupComplete called, currentIndex:", currentIndex, "total:", selectedMatchups.length);
    // Move to next matchup immediately if available
    if (currentIndex < selectedMatchups.length - 1 && onIndexChange) {
      console.log("Moving to next matchup:", currentIndex + 1);
      onIndexChange(currentIndex + 1);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="text-center text-sm text-muted-foreground">
        Match {currentIndex + 1} of {selectedMatchups.length}
      </div>
      
      {/* Container for all matchup cards */}
      <div className="relative min-h-[280px]">
        {selectedMatchups.map((matchup, index) => (
          <MatchupCard
            key={matchup.id}
            matchup={matchup}
            players={players}
            isActive={index === currentIndex}
            onAddResult={onAddResult}
            onComplete={handleMatchupComplete}
          />
        ))}
      </div>
    </div>
  );
};
