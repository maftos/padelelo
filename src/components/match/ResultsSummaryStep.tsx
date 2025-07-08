import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target } from "lucide-react";

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

interface ResultsSummaryStepProps {
  matchups: Matchup[];
  players: Player[];
  allSetScores: { [matchupId: string]: SetScore[] };
}

export const ResultsSummaryStep = ({ 
  matchups, 
  players, 
  allSetScores 
}: ResultsSummaryStepProps) => {
  const getPlayerName = (playerId: string) => {
    return players.find(p => p.id === playerId)?.name || "Unknown";
  };

  const getPlayerPhoto = (playerId: string) => {
    return players.find(p => p.id === playerId)?.photo || "";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getMatchWinner = (matchupId: string) => {
    const setScores = allSetScores[matchupId] || [];
    if (setScores.length === 0) return null;

    let team1Wins = 0;
    let team2Wins = 0;

    setScores.forEach(set => {
      if (set.team1Score > set.team2Score) {
        team1Wins++;
      } else if (set.team2Score > set.team1Score) {
        team2Wins++;
      }
    });

    if (team1Wins > team2Wins) return 'team1';
    if (team2Wins > team1Wins) return 'team2';
    return 'tie';
  };

  const TeamDisplay = ({ 
    team, 
    isWinner = false 
  }: { 
    team: [string, string]; 
    isWinner?: boolean;
  }) => (
    <div className={`flex items-center gap-2 ${isWinner ? 'font-semibold' : ''}`}>
      {isWinner && <Trophy className="h-4 w-4 text-yellow-500" />}
      {team.map((playerId, index) => (
        <div key={playerId} className="flex items-center gap-1">
          <Avatar className="h-6 w-6">
            <AvatarImage src={getPlayerPhoto(playerId)} />
            <AvatarFallback className="text-xs">
              {getInitials(getPlayerName(playerId))}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm">{getPlayerName(playerId)}</span>
          {index === 0 && <span className="text-muted-foreground">&</span>}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
        <h3 className="font-medium">Review Your Results</h3>
        <p className="text-sm text-muted-foreground">
          Confirm all match results before saving
        </p>
      </div>

      <div className="space-y-4">
        {matchups.map((matchup) => {
          const setScores = allSetScores[matchup.id] || [];
          const winner = getMatchWinner(matchup.id);
          
          return (
            <Card key={matchup.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <TeamDisplay 
                      team={matchup.team1} 
                      isWinner={winner === 'team1'}
                    />
                    <span className="text-lg font-bold text-muted-foreground">vs</span>
                    <TeamDisplay 
                      team={matchup.team2} 
                      isWinner={winner === 'team2'}
                    />
                  </div>
                  
                  {winner && winner !== 'tie' && (
                    <Badge variant="secondary" className="ml-2">
                      {winner === 'team1' ? 'Team 1 Wins' : 'Team 2 Wins'}
                    </Badge>
                  )}
                  
                  {winner === 'tie' && (
                    <Badge variant="outline" className="ml-2">
                      Tie
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                {setScores.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No sets recorded</p>
                ) : (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      Set Scores:
                    </div>
                    {setScores.map((setScore, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-accent/30 rounded"
                      >
                        <span className="text-sm font-medium">
                          Set {setScore.setNumber}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`font-mono ${
                            setScore.team1Score > setScore.team2Score 
                              ? 'font-bold text-green-600' 
                              : ''
                          }`}>
                            {setScore.team1Score}
                          </span>
                          <span className="text-muted-foreground">-</span>
                          <span className={`font-mono ${
                            setScore.team2Score > setScore.team1Score 
                              ? 'font-bold text-green-600' 
                              : ''
                          }`}>
                            {setScore.team2Score}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {matchups.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No matches to review</p>
        </div>
      )}
    </div>
  );
};