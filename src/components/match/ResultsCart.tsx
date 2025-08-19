
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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
      <div className="text-center text-sm text-muted-foreground mb-4">
        {Object.keys(groupedResults).length} matchup{Object.keys(groupedResults).length > 1 ? 's' : ''} ready to save
      </div>
      
      {Object.entries(groupedResults).map(([key, group]) => {
        const unifiedOrderNumbers = getUnifiedOrderNumbers(key);
        
        return (
          <div key={key} className="bg-accent/5 rounded-xl border border-accent/20 p-3 sm:p-4 space-y-3">
            {/* Teams - using same layout as ProfileRecentActivity */}
            <div className="flex flex-col gap-2">
              {/* Row 1: First players */}
              <div className="flex items-center justify-between gap-2">
                {/* Team 1 Player 1 (left) */}
                <div className="flex items-center gap-1.5 min-w-0">
                  <Avatar className="w-5 h-5 sm:w-6 sm:h-6 border border-background">
                    <AvatarImage src={getPlayerPhoto(group.team1[0])} />
                    <AvatarFallback className="text-[10px]">
                      {getInitials(getPlayerName(group.team1[0]))}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs sm:text-sm font-medium truncate">
                    {getPlayerName(group.team1[0]) === "Me" ? "You" : getPlayerName(group.team1[0])}
                  </span>
                </div>
                {/* Team 2 Player 1 (right) */}
                <div className="flex items-center gap-1.5 min-w-0 justify-end">
                  <span className="text-xs sm:text-sm font-medium truncate text-right">
                    {getPlayerName(group.team2[0]) === "Me" ? "You" : getPlayerName(group.team2[0])}
                  </span>
                  <Avatar className="w-5 h-5 sm:w-6 sm:h-6 border border-background">
                    <AvatarImage src={getPlayerPhoto(group.team2[0])} />
                    <AvatarFallback className="text-[10px]">
                      {getInitials(getPlayerName(group.team2[0]))}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* Row 2: Second players */}
              <div className="flex items-center justify-between gap-2">
                {/* Team 1 Player 2 (left) */}
                <div className="flex items-center gap-1.5 min-w-0">
                  <Avatar className="w-5 h-5 sm:w-6 sm:h-6 border border-background">
                    <AvatarImage src={getPlayerPhoto(group.team1[1])} />
                    <AvatarFallback className="text-[10px]">
                      {getInitials(getPlayerName(group.team1[1]))}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs sm:text-sm font-medium truncate">
                    {getPlayerName(group.team1[1]) === "Me" ? "You" : getPlayerName(group.team1[1])}
                  </span>
                </div>
                {/* Team 2 Player 2 (right) */}
                <div className="flex items-center gap-1.5 min-w-0 justify-end">
                  <span className="text-xs sm:text-sm font-medium truncate text-right">
                    {getPlayerName(group.team2[1]) === "Me" ? "You" : getPlayerName(group.team2[1])}
                  </span>
                  <Avatar className="w-5 h-5 sm:w-6 sm:h-6 border border-background">
                    <AvatarImage src={getPlayerPhoto(group.team2[1])} />
                    <AvatarFallback className="text-[10px]">
                      {getInitials(getPlayerName(group.team2[1]))}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>

            {/* Sets/Results - similar to profile layout */}
            <div className="space-y-2">
              {group.results.map((result, index) => {
                const team1Won = result.team1Score > result.team2Score;
                return (
                  <div key={index} className="grid grid-cols-3 items-center p-3 rounded-lg bg-background/50 border border-border/30">
                    <div className="text-xs text-muted-foreground">
                      Match {unifiedOrderNumbers[index] || index + 1}
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <span className={`text-sm ${result.team1Score > result.team2Score ? 'font-bold' : 'font-medium'}`}>
                        {result.team1Score}
                      </span>
                      <span className="text-muted-foreground text-sm">-</span>
                      <span className={`text-sm ${result.team2Score > result.team1Score ? 'font-bold' : 'font-medium'}`}>
                        {result.team2Score}
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <Badge 
                        variant={team1Won ? 'default' : 'destructive'} 
                        className={team1Won ? 'px-2 py-0.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white' : ''}
                      >
                        {team1Won ? 'Won' : 'Lost'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
