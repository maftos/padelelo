
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface Player {
  id: string;
  name: string;
  photo?: string;
}

interface QueuedResult {
  id: string;
  team1: [string, string];
  team2: [string, string];
  team1Score: number;
  team2Score: number;
}

interface ResultsCartProps {
  queuedResults: QueuedResult[];
  players: Player[];
  onRemoveResult: (resultId: string) => void;
}

export const ResultsCart = ({ queuedResults, players, onRemoveResult }: ResultsCartProps) => {
  const getPlayerName = (playerId: string) => {
    return players.find(p => p.id === playerId)?.name || "Unknown";
  };

  const getPlayerPhoto = (playerId: string) => {
    return players.find(p => p.id === playerId)?.photo || "";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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

  const handleScoreChange = (resultId: string, team: 'team1' | 'team2', value: string) => {
    // Prevent non-numeric input, negative numbers, and numbers > 9
    const numValue = parseInt(value) || 0;
    if (numValue < 0 || numValue > 9) return;
    
    // This would need to be implemented to update the scores in the parent component
    // For now, we'll keep it as display only since the user didn't ask for edit functionality
  };

  if (queuedResults.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No results added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto px-4">
      <div className="text-center text-sm text-muted-foreground mb-4">
        {queuedResults.length} match{queuedResults.length > 1 ? 'es' : ''} ready to save
      </div>
      
      {queuedResults.map((result, index) => (
        <Card key={result.id} className="border-primary bg-primary/5 shadow-lg relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => onRemoveResult(result.id)}
          >
            <X className="h-3 w-3" />
          </Button>
          
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              {/* Team 1 players */}
              <div className="flex-1">
                <TeamDisplay team={result.team1} />
              </div>
              
              {/* Team 1 score */}
              <div>
                <Input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={result.team1Score}
                  onChange={(e) => handleScoreChange(result.id, 'team1', e.target.value)}
                  className="w-12 text-center text-xl font-bold h-12"
                  min="0"
                  max="9"
                  readOnly
                />
              </div>
              
              {/* VS */}
              <div className="text-lg font-bold text-muted-foreground px-2">
                VS
              </div>
              
              {/* Team 2 score */}
              <div>
                <Input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={result.team2Score}
                  onChange={(e) => handleScoreChange(result.id, 'team2', e.target.value)}
                  className="w-12 text-center text-xl font-bold h-12"
                  min="0"
                  max="9"
                  readOnly
                />
              </div>
              
              {/* Team 2 players */}
              <div className="flex-1 flex justify-end">
                <TeamDisplay team={result.team2} />
              </div>
            </div>
            
            {/* Match number */}
            <div className="text-center text-sm text-muted-foreground">
              Match {index + 1}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
