
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
      
      {Object.entries(groupedResults).map(([key, group], index) => (
        <Card key={key} className="border-primary bg-primary/5 shadow-lg">          
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              {/* Team 1 players */}
              <div className="flex-1">
                <TeamDisplay team={group.team1} />
              </div>
              
              {/* All set scores for this matchup */}
              <div className="flex gap-2">
                {group.results.map((result, setIndex) => (
                  <div key={setIndex} className="flex flex-col items-center gap-2">
                    <div className="text-xs text-muted-foreground">Set {setIndex + 1}</div>
                    <div className="text-xl font-bold text-green-700">
                      {result.team1Score}
                    </div>
                    <div className="text-lg font-bold text-muted-foreground px-2">
                      VS
                    </div>
                    <div className="text-xl font-bold text-green-700">
                      {result.team2Score}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Team 2 players */}
              <div className="flex-1 flex justify-end">
                <TeamDisplay team={group.team2} />
              </div>
            </div>
            
            {/* Match number */}
            <div className="text-center text-sm text-muted-foreground">
              Matchup {index + 1}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
