
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

  // Get the unified order numbers for each result based on selectedMatchups order
  const getUnifiedOrderNumbers = (groupKey: string) => {
    const group = groupedResults[groupKey];
    const orderNumbers: number[] = [];
    
    // Find matching selectedMatchups for this group and get their order numbers
    const matchingMatchups = selectedMatchups.filter(matchup => 
      matchup.team1[0] === group.team1[0] && 
      matchup.team1[1] === group.team1[1] && 
      matchup.team2[0] === group.team2[0] && 
      matchup.team2[1] === group.team2[1]
    );
    
    // Sort by order and map to order numbers
    matchingMatchups
      .sort((a, b) => a.order - b.order)
      .forEach(matchup => {
        orderNumbers.push(matchup.order);
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
    <div className="space-y-4 md:max-w-2xl md:mx-auto md:px-4">
      <div className="text-center text-sm text-muted-foreground mb-4">
        {Object.keys(groupedResults).length} matchup{Object.keys(groupedResults).length > 1 ? 's' : ''} ready to save
      </div>
      
      {Object.entries(groupedResults).map(([key, group]) => {
        const unifiedOrderNumbers = getUnifiedOrderNumbers(key);
        
        return (
          <Card key={key} className="border-primary bg-primary/5 shadow-lg">          
            <CardContent className="p-6">
              <div className="grid grid-cols-[1fr,auto] gap-6 items-center">
                {/* Team players section */}
                <div className="space-y-2">
                  {/* Team 1 players */}
                  <div className="flex items-center gap-4 h-10 border-b border-border pb-2">
                    <PlayerDisplay playerId={group.team1[0]} />
                    <PlayerDisplay playerId={group.team1[1]} />
                  </div>
                  
                  {/* Team 2 players */}
                  <div className="flex items-center gap-4 h-10 pt-2">
                    <PlayerDisplay playerId={group.team2[0]} />
                    <PlayerDisplay playerId={group.team2[1]} />
                  </div>
                </div>
                
                {/* Scores section */}
                <div className="flex gap-4">
                  {group.results.map((result, index) => (
                    <div key={index} className="flex flex-col items-center">
                      {/* Unified order number */}
                      <div className="text-[10px] text-muted-foreground/60 font-light mb-1 h-3 flex items-center">
                        {unifiedOrderNumbers[index] || ''}
                      </div>
                      
                      {/* Team 1 Score */}
                      <div className="flex items-center justify-center h-10 border-b border-border pb-2 mb-2">
                        <span className="text-lg font-bold text-green-700">
                          {result.team1Score}
                        </span>
                      </div>
                      
                      {/* Team 2 Score */}
                      <div className="flex items-center justify-center h-10 pt-2">
                        <span className="text-lg font-bold text-green-700">
                          {result.team2Score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
