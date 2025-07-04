
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Clock, MapPin } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
            <TabsTrigger value="teams">Teams & Rotations</TabsTrigger>
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
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Round</TableHead>
                    <TableHead>Court 1</TableHead>
                    <TableHead>Court 2</TableHead>
                    <TableHead className="w-20">Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rounds.map((round, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">Team A</Badge>
                            <span className="text-sm">{round.court1.teamA.join(" & ")}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">vs</div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">Team B</Badge>
                            <span className="text-sm">{round.court1.teamB.join(" & ")}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">Team C</Badge>
                            <span className="text-sm">{round.court2.teamA.join(" & ")}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">vs</div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">Team D</Badge>
                            <span className="text-sm">{round.court2.teamB.join(" & ")}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">20 min</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="teams" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: maxPlayers }, (_, i) => `Player ${i + 1}`).map((player, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="font-medium mb-2">{player}</div>
                  <div className="text-sm text-muted-foreground">
                    Partners with: {getPlayerPartners(index + 1, rounds).join(", ")}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Plays against: {getPlayerOpponents(index + 1, rounds).join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
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

function getPlayerPartners(playerNum: number, rounds: any[]): string[] {
  const partners = new Set<string>();
  const playerName = `Player ${playerNum}`;
  
  rounds.forEach(round => {
    [round.court1, round.court2].forEach(court => {
      [court.teamA, court.teamB].forEach(team => {
        if (team.includes(playerName)) {
          team.forEach((player: string) => {
            if (player !== playerName) {
              partners.add(player);
            }
          });
        }
      });
    });
  });
  
  return Array.from(partners);
}

function getPlayerOpponents(playerNum: number, rounds: any[]): string[] {
  const opponents = new Set<string>();
  const playerName = `Player ${playerNum}`;
  
  rounds.forEach(round => {
    [round.court1, round.court2].forEach(court => {
      if (court.teamA.includes(playerName)) {
        court.teamB.forEach((player: string) => opponents.add(player));
      } else if (court.teamB.includes(playerName)) {
        court.teamA.forEach((player: string) => opponents.add(player));
      }
    });
  });
  
  return Array.from(opponents);
}
