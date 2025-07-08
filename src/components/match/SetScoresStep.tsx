import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Trash2 } from "lucide-react";

interface Player {
  id: string;
  name: string;
  photo?: string;
}

interface Matchup {
  id: string;
  team1: [string, string];
  team2: [string, string];
}

interface SetScore {
  setNumber: number;
  team1Score: number;
  team2Score: number;
}

interface SetScoresStepProps {
  matchups: Matchup[];
  players: Player[];
  allSetScores: { [matchupId: string]: SetScore[] };
  onSetScoresChange: (matchupId: string, setScores: SetScore[]) => void;
}

export const SetScoresStep = ({ 
  matchups, 
  players, 
  allSetScores, 
  onSetScoresChange 
}: SetScoresStepProps) => {
  const getPlayerName = (playerId: string) => {
    return players.find(p => p.id === playerId)?.name || "Unknown";
  };

  const getPlayerPhoto = (playerId: string) => {
    return players.find(p => p.id === playerId)?.photo || "";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const addSet = (matchupId: string) => {
    const currentSets = allSetScores[matchupId] || [];
    const newSet: SetScore = {
      setNumber: currentSets.length + 1,
      team1Score: 0,
      team2Score: 0
    };
    onSetScoresChange(matchupId, [...currentSets, newSet]);
  };

  const removeSet = (matchupId: string, setIndex: number) => {
    const currentSets = allSetScores[matchupId] || [];
    const updatedSets = currentSets.filter((_, index) => index !== setIndex);
    // Renumber the sets
    const renumberedSets = updatedSets.map((set, index) => ({
      ...set,
      setNumber: index + 1
    }));
    onSetScoresChange(matchupId, renumberedSets);
  };

  const updateSetScore = (
    matchupId: string, 
    setIndex: number, 
    team: 'team1' | 'team2', 
    score: number
  ) => {
    const currentSets = allSetScores[matchupId] || [];
    const updatedSets = [...currentSets];
    updatedSets[setIndex] = {
      ...updatedSets[setIndex],
      [`${team}Score`]: score
    };
    onSetScoresChange(matchupId, updatedSets);
  };

  const TeamDisplay = ({ team }: { team: [string, string] }) => (
    <div className="flex items-center gap-2">
      {team.map((playerId, index) => (
        <div key={playerId} className="flex items-center gap-1">
          <Avatar className="h-6 w-6">
            <AvatarImage src={getPlayerPhoto(playerId)} />
            <AvatarFallback className="text-xs">
              {getInitials(getPlayerName(playerId))}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{getPlayerName(playerId)}</span>
          {index === 0 && <span className="text-muted-foreground">&</span>}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Enter the set scores for each match
        </p>
      </div>

      {matchups.map((matchup) => {
        const setScores = allSetScores[matchup.id] || [];
        
        return (
          <Card key={matchup.id}>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <TeamDisplay team={matchup.team1} />
                    <span className="text-lg font-bold text-muted-foreground">vs</span>
                    <TeamDisplay team={matchup.team2} />
                  </div>
                  <Button
                    onClick={() => addSet(matchup.id)}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Set
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {setScores.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  <p className="text-sm">No sets added yet</p>
                  <p className="text-xs">Click "Add Set" to enter scores</p>
                </div>
              ) : (
                setScores.map((setScore, setIndex) => (
                  <div
                    key={setIndex}
                    className="flex items-center gap-4 p-3 bg-accent/30 rounded-lg"
                  >
                    <div className="font-medium text-sm">
                      Set {setScore.setNumber}
                    </div>
                    
                    <div className="flex items-center gap-2 flex-1">
                      <div className="text-sm text-muted-foreground w-20">
                        Team 1
                      </div>
                      <Input
                        type="number"
                        min="0"
                        max="99"
                        value={setScore.team1Score}
                        onChange={(e) => updateSetScore(
                          matchup.id, 
                          setIndex, 
                          'team1', 
                          parseInt(e.target.value) || 0
                        )}
                        className="w-16 text-center"
                      />
                      
                      <span className="text-muted-foreground">-</span>
                      
                      <Input
                        type="number"
                        min="0"
                        max="99"
                        value={setScore.team2Score}
                        onChange={(e) => updateSetScore(
                          matchup.id, 
                          setIndex, 
                          'team2', 
                          parseInt(e.target.value) || 0
                        )}
                        className="w-16 text-center"
                      />
                      <div className="text-sm text-muted-foreground w-20">
                        Team 2
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => removeSet(matchup.id, setIndex)}
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};