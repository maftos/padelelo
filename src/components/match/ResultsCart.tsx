import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

interface SelectedMatchup {
  id: string;
  team1: [string, string];
  team2: [string, string];
  order: number;
  matchNumber: number;
}

interface ResultsCartProps {
  queuedResults: QueuedResult[];
  players: Player[];
  selectedMatchups: SelectedMatchup[];
  onRemoveResult: (resultId: string) => void;
}

export const ResultsCart = ({ queuedResults, players, selectedMatchups, onRemoveResult }: ResultsCartProps) => {
  const getPlayerName = (playerId: string) => {
    return players.find(p => p.id === playerId)?.name || "Unknown";
  };

  const getPlayerPhoto = (playerId: string) => {
    return players.find(p => p.id === playerId)?.photo || "";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Group results by matchup teams
  const groupedResults = queuedResults.reduce((acc, result) => {
    const key = `${result.team1[0]}-${result.team1[1]}-${result.team2[0]}-${result.team2[1]}`;
    if (!acc[key]) {
      acc[key] = {
        team1: result.team1,
        team2: result.team2,
        results: []
      };
    }
    acc[key].results.push(result);
    return acc;
  }, {} as Record<string, { team1: [string, string]; team2: [string, string]; results: QueuedResult[] }>);

  // Get the unified order numbers for each result based on when the score was actually entered
  const getUnifiedOrderNumbers = (groupKey: string) => {
    const group = groupedResults[groupKey];
    const orderNumbers: number[] = [];
    
    group.results.forEach(result => {
      // Extract the order number from the result ID (format: matchup-X-order-Y-match-Z)
      const parts = result.id.split('-');
      const orderIndex = parts.findIndex(part => part === 'order');
      if (orderIndex !== -1 && orderIndex + 1 < parts.length) {
        const orderNumber = parseInt(parts[orderIndex + 1]);
        if (!isNaN(orderNumber)) {
          orderNumbers.push(orderNumber);
        }
      }
    });
    
    return orderNumbers;
  };

  const PlayerDisplay = ({ playerId }: { playerId: string }) => (
    <div className="flex items-center gap-3">
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
  );

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
        {Object.keys(groupedResults).length} matchup{Object.keys(groupedResults).length > 1 ? 's' : ''} ready to save
      </div>
      
      {Object.entries(groupedResults).map(([key, group]) => {
        const unifiedOrderNumbers = getUnifiedOrderNumbers(key);
        
        return (
          <Card key={key} className="border-primary bg-primary/5 shadow-lg">          
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between gap-6">
                {/* Team players - arranged vertically with horizontal teams */}
                <div className="flex flex-col gap-2">
                  {/* Team 1 players - horizontal layout */}
                  <div className="flex items-center gap-4 h-10">
                    <PlayerDisplay playerId={group.team1[0]} />
                    <PlayerDisplay playerId={group.team1[1]} />
                  </div>
                  
                  {/* Team 2 players - horizontal layout */}
                  <div className="flex items-center gap-4 h-10">
                    <PlayerDisplay playerId={group.team2[0]} />
                    <PlayerDisplay playerId={group.team2[1]} />
                  </div>
                </div>
                
                {/* Scores - displayed vertically with unified order numbers, left-aligned */}
                <div className="flex gap-3">
                  {group.results.map((result, index) => (
                    <div key={index} className="flex flex-col items-start gap-1">
                      {/* Unified order number - smaller and less prominent */}
                      <div className="text-xs text-muted-foreground/70 font-normal h-3 flex items-center">
                        {unifiedOrderNumbers[index] || ''}
                      </div>
                      <div className="text-lg font-bold text-green-700 h-6 flex items-center">
                        {result.team1Score}
                      </div>
                      <div className="text-lg font-bold text-green-700 h-6 flex items-center">
                        {result.team2Score}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Extended horizontal divider that spans the full width */}
              <div className="absolute left-6 right-6 top-1/2 transform -translate-y-1/2 h-px bg-border" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
