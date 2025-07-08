import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NumberSelector } from "./NumberSelector";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Player {
  id: string;
  name: string;
  photo?: string;
}

interface Matchup {
  id: string;
  team1: [string, string];
  team2: [string, string];
  team1Score?: number;
  team2Score?: number;
}

interface MatchupsStepProps {
  players: Player[];
  matchups: Matchup[];
  onMatchupsChange: (matchups: Matchup[]) => void;
  queuedResults: QueuedResult[];
  onAddResult: (result: QueuedResult) => void;
}

interface QueuedResult {
  id: string;
  team1: [string, string];
  team2: [string, string];
  team1Score: number;
  team2Score: number;
}

export const MatchupsStep = ({ players, matchups, onMatchupsChange, queuedResults, onAddResult }: MatchupsStepProps) => {
  const [scoringMatchup, setScoringMatchup] = useState<string | null>(null);
  const [activeTeam, setActiveTeam] = useState<"team1" | "team2" | null>(null);
  const [team1Score, setTeam1Score] = useState<number | null>(null);
  const [team2Score, setTeam2Score] = useState<number | null>(null);
  const getPlayerName = (playerId: string) => {
    return players.find(p => p.id === playerId)?.name || "Unknown";
  };

  const getPlayerPhoto = (playerId: string) => {
    return players.find(p => p.id === playerId)?.photo || "";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Generate all possible matchup combinations
  const generatePossibleMatchups = () => {
    const [p1, p2, p3, p4] = players;
    return [
      {
        id: "matchup-1",
        label: `${p1.name} & ${p2.name} vs ${p3.name} & ${p4.name}`,
        team1: [p1.id, p2.id] as [string, string],
        team2: [p3.id, p4.id] as [string, string]
      },
      {
        id: "matchup-2", 
        label: `${p1.name} & ${p3.name} vs ${p2.name} & ${p4.name}`,
        team1: [p1.id, p3.id] as [string, string],
        team2: [p2.id, p4.id] as [string, string]
      },
      {
        id: "matchup-3",
        label: `${p1.name} & ${p4.name} vs ${p2.name} & ${p3.name}`,
        team1: [p1.id, p4.id] as [string, string],
        team2: [p2.id, p3.id] as [string, string]
      }
    ];
  };

  const possibleMatchups = generatePossibleMatchups();

  const handleMatchupClick = (matchup: typeof possibleMatchups[0]) => {
    // Check if this matchup is already queued
    if (isMatchupAlreadyQueued(matchup)) return; // Don't allow editing if already queued
    
    setScoringMatchup(matchup.id);
    setActiveTeam("team1");
    setTeam1Score(null);
    setTeam2Score(null);
  };

  const handleNumberSelect = (number: number) => {
    if (activeTeam === "team1") {
      setTeam1Score(number);
      setActiveTeam("team2");
    } else if (activeTeam === "team2") {
      setTeam2Score(number);
      setActiveTeam(null); // Stop here, don't auto-save
    }
  };

  const handleAddResult = () => {
    const currentMatchup = possibleMatchups.find(m => m.id === scoringMatchup);
    if (currentMatchup && team1Score !== null && team2Score !== null) {
      const result: QueuedResult = {
        id: `${currentMatchup.id}-${Date.now()}`,
        team1: currentMatchup.team1,
        team2: currentMatchup.team2,
        team1Score: team1Score,
        team2Score: team2Score
      };
      
      onAddResult(result);
      
      // Reset scoring state
      setScoringMatchup(null);
      setActiveTeam(null);
      setTeam1Score(null);
      setTeam2Score(null);
    }
  };

  const handleCancelScoring = () => {
    setScoringMatchup(null);
    setActiveTeam(null);
    setTeam1Score(null);
    setTeam2Score(null);
  };

  const isMatchupAlreadyQueued = (matchup: typeof possibleMatchups[0]) => {
    return queuedResults.some(result => 
      result.team1[0] === matchup.team1[0] && 
      result.team1[1] === matchup.team1[1] && 
      result.team2[0] === matchup.team2[0] && 
      result.team2[1] === matchup.team2[1]
    );
  };

  const TeamDisplay = ({ team }: { team: [string, string] }) => (
    <div className="flex items-center justify-center gap-2">
      {team.map((playerId, index) => (
        <div key={playerId} className="flex items-center gap-1">
          <Avatar className="h-6 w-6">
            <AvatarImage src={getPlayerPhoto(playerId)} />
            <AvatarFallback className="text-xs">
              {getInitials(getPlayerName(playerId))}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{getPlayerName(playerId) === "Me" ? "You" : getPlayerName(playerId)}</span>
          {index === 0 && <span className="text-muted-foreground">&</span>}
        </div>
      ))}
    </div>
  );

  const isMatchupSelected = (matchup: typeof possibleMatchups[0]) => {
    return matchups.some(m => 
      m.team1[0] === matchup.team1[0] && 
      m.team1[1] === matchup.team1[1] && 
      m.team2[0] === matchup.team2[0] && 
      m.team2[1] === matchup.team2[1]
    );
  };

  const getMatchupScores = (matchup: typeof possibleMatchups[0]) => {
    return matchups.find(m => 
      m.team1[0] === matchup.team1[0] && 
      m.team1[1] === matchup.team1[1] && 
      m.team2[0] === matchup.team2[0] && 
      m.team2[1] === matchup.team2[1]
    );
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {possibleMatchups.map((matchup) => {
        const isQueued = isMatchupAlreadyQueued(matchup);
        const isScoring = scoringMatchup === matchup.id;
        const isHidden = scoringMatchup && scoringMatchup !== matchup.id;
        
        if (isHidden) return null; // Hide non-selected cards during scoring
        
        return (
          <Card 
            key={matchup.id} 
            className={`transition-all duration-300 ${
              isQueued
                ? "border-primary bg-primary/5 shadow-md cursor-default" 
                : isScoring
                ? "border-primary bg-primary/5 shadow-lg cursor-default"
                : "border-dashed hover:bg-accent/50 cursor-pointer hover:shadow-md"
            }`}
            onClick={() => !isScoring && !isQueued && handleMatchupClick(matchup)}
          >
            <CardContent className={`transition-all duration-300 ${isScoring ? "p-8" : "p-6"}`}>
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <TeamDisplay team={matchup.team1} />
                   {isQueued && (
                     <div className="text-lg font-bold text-primary mt-2">
                       {queuedResults.find(r => 
                         r.team1[0] === matchup.team1[0] && 
                         r.team1[1] === matchup.team1[1] && 
                         r.team2[0] === matchup.team2[0] && 
                         r.team2[1] === matchup.team2[1]
                       )?.team1Score}
                     </div>
                   )}
                   {isScoring && (
                     <div className="mt-4">
                       <Input
                         value={team1Score !== null ? team1Score.toString() : ""}
                         readOnly
                         placeholder="0"
                         className={`w-16 text-center text-lg font-bold transition-all duration-200 ${
                           activeTeam === "team1" 
                             ? "ring-2 ring-primary bg-primary/10" 
                             : "bg-muted"
                         }`}
                       />
                     </div>
                   )}
                 </div>
                 
                 <div className="text-xl font-bold text-muted-foreground px-4">VS</div>
                 
                 <div className="flex flex-col items-center">
                   <TeamDisplay team={matchup.team2} />
                   {isQueued && (
                     <div className="text-lg font-bold text-primary mt-2">
                       {queuedResults.find(r => 
                         r.team1[0] === matchup.team1[0] && 
                         r.team1[1] === matchup.team1[1] && 
                         r.team2[0] === matchup.team2[0] && 
                         r.team2[1] === matchup.team2[1]
                       )?.team2Score}
                     </div>
                   )}
                  {isScoring && (
                    <div className="mt-4">
                      <Input
                        value={team2Score !== null ? team2Score.toString() : ""}
                        readOnly
                        placeholder="0"
                        className={`w-16 text-center text-lg font-bold transition-all duration-200 ${
                          activeTeam === "team2" 
                            ? "ring-2 ring-primary bg-primary/10" 
                            : "bg-muted"
                        }`}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {isScoring && activeTeam && (
                <div className="mt-6 flex justify-center">
                  <NumberSelector onSelect={handleNumberSelect} />
                </div>
              )}
              
              {isScoring && !activeTeam && team1Score !== null && team2Score !== null && (
                <div className="mt-6 flex justify-center gap-3">
                  <Button variant="outline" onClick={handleCancelScoring}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddResult}>
                    Add Result
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};