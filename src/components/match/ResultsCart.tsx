
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
    <div className="space-y-4">
      <div className="text-center text-sm font-medium text-muted-foreground mb-6 bg-green-50 text-green-700 p-3 rounded-lg">
        ✓ {Object.keys(groupedResults).length} matchup{Object.keys(groupedResults).length > 1 ? 's' : ''} ready to save
      </div>
      
      {Object.entries(groupedResults).map(([key, group], index) => {
        const unifiedOrderNumbers = getUnifiedOrderNumbers(key);
        
        return (
          <Card key={key} className="border-green-200 bg-green-50/50 shadow-lg">          
            <CardContent className="p-4 md:p-6">
              {/* Mobile-optimized layout */}
              <div className="space-y-4">
                {/* Match header */}
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-muted-foreground">
                    Match {index + 1}
                  </div>
                  <div className="flex gap-1">
                    {unifiedOrderNumbers.map((orderNum, idx) => (
                      <div key={idx} className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                        #{orderNum}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Teams and scores - responsive layout */}
                <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-[1fr,auto] md:gap-6 md:items-center">
                  {/* Team players section */}
                  <div className="space-y-3">
                    {/* Team 1 players */}
                    <div className="flex items-center gap-4 p-3 bg-white/60 rounded-lg">
                      <PlayerDisplay playerId={group.team1[0]} />
                      <PlayerDisplay playerId={group.team1[1]} />
                    </div>
                    
                    {/* Team 2 players */}
                    <div className="flex items-center gap-4 p-3 bg-white/60 rounded-lg">
                      <PlayerDisplay playerId={group.team2[0]} />
                      <PlayerDisplay playerId={group.team2[1]} />
                    </div>
                  </div>
                  
                  {/* Scores section - horizontal on mobile, vertical on desktop */}
                  <div className="flex justify-center gap-4 md:flex-col md:gap-2">
                    {group.results.map((result, resultIndex) => (
                      <div key={resultIndex} className="flex flex-col items-center md:flex-row md:gap-2">
                        {/* Set indicator for multiple sets */}
                        {group.results.length > 1 && (
                          <div className="text-xs text-muted-foreground mb-1 md:mb-0">
                            Set {resultIndex + 1}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
                          <span className="text-xl font-bold text-green-700">
                            {result.team1Score}
                          </span>
                          <span className="text-sm text-muted-foreground">-</span>
                          <span className="text-xl font-bold text-green-700">
                            {result.team2Score}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
