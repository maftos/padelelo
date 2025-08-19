import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ScoreSequenceInput } from "@/components/ui/score-sequence-input";
import { cn } from "@/lib/utils";

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

interface MatchupCardProps {
  matchup: SelectedMatchup;
  players: Player[];
  isActive: boolean;
  onAddResult: (result: QueuedResult) => void;
  onComplete: () => void;
}

export const MatchupCard = ({ 
  matchup, 
  players, 
  isActive, 
  onAddResult, 
  onComplete 
}: MatchupCardProps) => {
  const [team1Score, setTeam1Score] = useState<string>("");
  const [team2Score, setTeam2Score] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getPlayerName = (playerId: string) => {
    return players.find(p => p.id === playerId)?.name || "Unknown";
  };

  const getPlayerPhoto = (playerId: string) => {
    return players.find(p => p.id === playerId)?.photo || "";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleScoresChange = (score1: string, score2: string) => {
    setTeam1Score(score1);
    setTeam2Score(score2);
  };

  const handleScoreComplete = async () => {
    const score1 = parseInt(team1Score) || 0;
    const score2 = parseInt(team2Score) || 0;
    
    if (team1Score.trim() === "" || team2Score.trim() === "") {
      return; // Don't submit if either score is empty
    }

    setIsSubmitting(true);
    
    const result: QueuedResult = {
      id: `${matchup.id}-${matchup.order}-${Date.now()}`,
      team1: matchup.team1,
      team2: matchup.team2,
      team1Score: score1,
      team2Score: score2
    };
    
    onAddResult(result);
    onComplete();
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
    <Card className={cn(
      "transition-all duration-300",
      isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none absolute"
    )}>
      <CardContent className="p-4 space-y-4">
        {/* Teams layout */}
        <div className="space-y-4">
          {/* Team 1 and Team 2 players */}
          <div className="flex items-center justify-between">
            {/* Team 1 players */}
            <div className="flex-1">
              <TeamDisplay team={matchup.team1} />
            </div>
            
            {/* VS */}
            <div className="text-lg font-bold text-muted-foreground px-4">
              VS
            </div>
            
            {/* Team 2 players */}
            <div className="flex-1 flex justify-end">
              <TeamDisplay team={matchup.team2} />
            </div>
          </div>
          
          {/* Sequential score input */}
          <ScoreSequenceInput
            onScoresChange={handleScoresChange}
            onComplete={handleScoreComplete}
            disabled={isSubmitting || !isActive}
          />
        </div>
      </CardContent>
    </Card>
  );
};