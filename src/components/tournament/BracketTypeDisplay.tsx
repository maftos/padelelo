
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Clock, MapPin } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BracketTypeDisplayProps {
  bracketType: string;
  maxPlayers?: number;
}

export function BracketTypeDisplay({ bracketType, maxPlayers = 8 }: BracketTypeDisplayProps) {
  if (bracketType === "AMERICANO_SOLO" || bracketType === "AMERICANO_TEAM") {
    return <AmericanoDisplay maxPlayers={maxPlayers} />;
  }

  // Default display for other tournament types
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-muted-foreground" />
          Bracket Type
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{formatBracketType(bracketType)}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function AmericanoDisplay({ maxPlayers }: { maxPlayers: number }) {
  const numTeams = maxPlayers / 2;
  const courts = 2;
  const rounds = generateAmericanoRounds(maxPlayers);
  const playerRankings = generatePlayerRankings(maxPlayers);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-muted-foreground" />
          Tournament Format: Americano
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="rankings">Rankings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{maxPlayers}</div>
                <div className="text-sm text-muted-foreground">Players</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <Trophy className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{numTeams}</div>
                <div className="text-sm text-muted-foreground">Teams</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <MapPin className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{courts}</div>
                <div className="text-sm text-muted-foreground">Courts</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{rounds.length}</div>
                <div className="text-sm text-muted-foreground">Rounds</div>
              </div>
            </div>
            <div className="prose prose-sm max-w-none">
              <h4>How Americano Works:</h4>
              <p>
                In Americano format, all players rotate partners and opponents throughout the tournament. 
                Each player will partner with different teammates and face all other players as opponents, 
                ensuring a fair and balanced competition.
              </p>
              <ul>
                <li>Players form temporary teams that change each round</li>
                <li>Points are tracked individually for final ranking</li>
                <li>Multiple courts run simultaneously</li>
                <li>Equal playing time for all participants</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="schedule" className="space-y-4">
            <div className="space-y-4">
              {rounds.map((round, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground">
                    Round {index + 1}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MatchCard 
                      courtNumber={1}
                      team1Player1={round.court1.teamA[0]}
                      team1Player2={round.court1.teamA[1]}
                      team2Player1={round.court1.teamB[0]}
                      team2Player2={round.court1.teamB[1]}
                    />
                    <MatchCard 
                      courtNumber={2}
                      team1Player1={round.court2.teamA[0]}
                      team1Player2={round.court2.teamA[1]}
                      team2Player1={round.court2.teamB[0]}
                      team2Player2={round.court2.teamB[1]}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="rankings" className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-center">Points</TableHead>
                    <TableHead className="text-center">Matches</TableHead>
                    <TableHead className="text-center">Win Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {playerRankings.map((player, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{index + 1}</span>
                          {index < 3 && (
                            <Trophy className={`h-4 w-4 ${
                              index === 0 ? 'text-yellow-500' : 
                              index === 1 ? 'text-gray-400' : 'text-amber-600'
                            }`} />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={player.profilePhoto} />
                            <AvatarFallback>{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{player.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {player.points}
                      </TableCell>
                      <TableCell className="text-center">
                        {player.matchesPlayed}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`font-medium ${
                          player.winRate >= 70 ? 'text-green-600' :
                          player.winRate >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {player.winRate}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function MatchCard({ 
  courtNumber, 
  team1Player1, 
  team1Player2, 
  team2Player1, 
  team2Player2 
}: {
  courtNumber: number;
  team1Player1: string;
  team1Player2: string;
  team2Player1: string;
  team2Player2: string;
}) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="p-3 hover:bg-muted/50 transition-colors">
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>Court {courtNumber}</span>
          <span>20 min</span>
        </div>
        
        <div className="flex items-center justify-between gap-2">
          {/* Team 1 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <Avatar className="h-5 w-5 shrink-0">
                <AvatarFallback>{getInitials(team1Player1)}</AvatarFallback>
              </Avatar>
              <span className="text-xs truncate">{team1Player1}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <Avatar className="h-5 w-5 shrink-0">
                <AvatarFallback>{getInitials(team1Player2)}</AvatarFallback>
              </Avatar>
              <span className="text-xs truncate">{team1Player2}</span>
            </div>
          </div>

          {/* VS indicator */}
          <div className="px-2">
            <span className="text-xs text-muted-foreground">vs</span>
          </div>

          {/* Team 2 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-end gap-1.5">
              <span className="text-xs truncate">{team2Player1}</span>
              <Avatar className="h-5 w-5 shrink-0">
                <AvatarFallback>{getInitials(team2Player1)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex items-center justify-end gap-1.5 mt-1">
              <span className="text-xs truncate">{team2Player2}</span>
              <Avatar className="h-5 w-5 shrink-0">
                <AvatarFallback>{getInitials(team2Player2)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function formatBracketType(bracketType: string): string {
  const formats: Record<string, string> = {
    'SINGLE_ELIM': 'Single Elimination',
    'DOUBLE_ELIM': 'Double Elimination',
    'ROUND_ROBIN': 'Round Robin',
    'AMERICANO_SOLO': 'Americano Solo',
    'MEXICANO_SOLO': 'Mexicano Solo',
    'AMERICANO_TEAM': 'Americano Team',
    'MEXICANO_TEAM': 'Mexicano Team',
    'MIXICANO': 'Mixicano'
  };
  return formats[bracketType] || bracketType;
}

function generateAmericanoRounds(numPlayers: number) {
  // Generate sample rounds for 8-player Americano
  const players = Array.from({ length: numPlayers }, (_, i) => `Player ${i + 1}`);
  
  // Sample rounds - in a real implementation, this would use proper Americano rotation logic
  return [
    {
      court1: { teamA: [players[0], players[1]], teamB: [players[2], players[3]] },
      court2: { teamA: [players[4], players[5]], teamB: [players[6], players[7]] }
    },
    {
      court1: { teamA: [players[0], players[4]], teamB: [players[1], players[5]] },
      court2: { teamA: [players[2], players[6]], teamB: [players[3], players[7]] }
    },
    {
      court1: { teamA: [players[0], players[2]], teamB: [players[4], players[6]] },
      court2: { teamA: [players[1], players[3]], teamB: [players[5], players[7]] }
    },
    {
      court1: { teamA: [players[0], players[7]], teamB: [players[1], players[6]] },
      court2: { teamA: [players[2], players[5]], teamB: [players[3], players[4]] }
    },
    {
      court1: { teamA: [players[0], players[3]], teamB: [players[2], players[7]] },
      court2: { teamA: [players[1], players[4]], teamB: [players[5], players[6]] }
    },
    {
      court1: { teamA: [players[0], players[5]], teamB: [players[3], players[6]] },
      court2: { teamA: [players[1], players[2]], teamB: [players[4], players[7]] }
    }
  ];
}

function generatePlayerRankings(numPlayers: number) {
  // Generate sample player rankings with realistic data
  const players = Array.from({ length: numPlayers }, (_, i) => ({
    name: `Player ${i + 1}`,
    profilePhoto: `https://api.dicebear.com/7.x/avataaars/svg?seed=player${i + 1}`,
    points: Math.floor(Math.random() * 20) + 5, // 5-25 points
    matchesPlayed: 6, // In Americano, each player plays same number of matches
    winRate: Math.floor(Math.random() * 60) + 20 // 20-80% win rate
  }));

  // Sort by points (descending)
  return players.sort((a, b) => b.points - a.points);
}
