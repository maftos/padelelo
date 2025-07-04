
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageContainer } from "@/components/layouts/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Navigation } from "@/components/Navigation";
import { 
  Clock, 
  MapPin, 
  Users, 
  Plus, 
  Trophy,
  Calendar,
  AlertCircle
} from "lucide-react";
import { formatDate } from "@/lib/date";

// Mock data for demonstration - you'll replace this with actual data from your backend
const mockOpenGames = [
  {
    id: "1",
    courtName: "Le Morne Tennis Club - Court 2",
    date: "2025-01-08T10:00:00Z",
    duration: "1.5 hours",
    location: "Le Morne, Mauritius",
    spotsAvailable: 1,
    totalSpots: 4,
    averageMMR: 3200,
    players: [
      {
        id: "p1",
        name: "Sarah Johnson",
        mmr: 3100,
        profilePhoto: null
      },
      {
        id: "p2", 
        name: "Mike Chen",
        mmr: 3300,
        profilePhoto: null
      },
      {
        id: "p3",
        name: "Alex Rodriguez", 
        mmr: 3200,
        profilePhoto: null
      }
    ],
    hoursUntilGame: 26,
    createdBy: "Sarah Johnson"
  },
  {
    id: "2",
    courtName: "Tamarin Bay Sports Complex - Court 1",
    date: "2025-01-09T18:30:00Z", 
    duration: "2 hours",
    location: "Tamarin, Mauritius",
    spotsAvailable: 2,
    totalSpots: 4,
    averageMMR: 2900,
    players: [
      {
        id: "p4",
        name: "Emma Wilson",
        mmr: 2850,
        profilePhoto: null
      },
      {
        id: "p5",
        name: "David Park",
        mmr: 2950,
        profilePhoto: null
      }
    ],
    hoursUntilGame: 56,
    createdBy: "Emma Wilson"
  },
  {
    id: "3",
    courtName: "Grand Baie Padel Center - Court 3",
    date: "2025-01-06T16:00:00Z",
    duration: "1 hour",
    location: "Grand Baie, Mauritius", 
    spotsAvailable: 1,
    totalSpots: 4,
    averageMMR: 3500,
    players: [
      {
        id: "p6",
        name: "Lisa Martinez",
        mmr: 3600,
        profilePhoto: null
      },
      {
        id: "p7",
        name: "Tom Anderson",
        mmr: 3450,
        profilePhoto: null
      },
      {
        id: "p8",
        name: "Rachel Green",
        mmr: 3450,
        profilePhoto: null
      }
    ],
    hoursUntilGame: 8,
    createdBy: "Lisa Martinez"
  }
];

const getUrgencyColor = (hours: number) => {
  if (hours <= 12) return "destructive";
  if (hours <= 48) return "default"; 
  return "secondary";
};

const getUrgencyText = (hours: number) => {
  if (hours <= 12) return `${hours}h left`;
  if (hours <= 48) return `${Math.floor(hours / 24)}d ${hours % 24}h left`;
  return `${Math.floor(hours / 24)} days left`;
};

export default function PlayerMatching() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <>
      <Navigation />
      <PageContainer>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Player Matching</h1>
                <p className="text-muted-foreground mt-1">
                  Find players to complete your booked courts or join existing games
                </p>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Post Available Court
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{mockOpenGames.length}</p>
                      <p className="text-sm text-muted-foreground">Open Games</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Clock className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {mockOpenGames.filter(game => game.hoursUntilGame <= 24).length}
                      </p>
                      <p className="text-sm text-muted-foreground">Urgent (< 24h)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Trophy className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {Math.round(mockOpenGames.reduce((sum, game) => sum + game.averageMMR, 0) / mockOpenGames.length)}
                      </p>
                      <p className="text-sm text-muted-foreground">Avg MMR</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Available Games */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Available Games</h2>
            
            <div className="grid gap-4">
              {mockOpenGames.map((game) => (
                <Card key={game.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        {/* Court and Location */}
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <h3 className="font-semibold text-lg">{game.courtName}</h3>
                        </div>
                        <p className="text-muted-foreground text-sm mb-3">{game.location}</p>
                        
                        {/* Date and Time */}
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {formatDate(game.date)} at {new Date(game.date).toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit',
                                hour12: true 
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{game.duration}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Urgency Badge */}
                      <Badge variant={getUrgencyColor(game.hoursUntilGame)} className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {getUrgencyText(game.hoursUntilGame)}
                      </Badge>
                    </div>

                    {/* Players and MMR Info */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {game.totalSpots - game.spotsAvailable}/{game.totalSpots} players
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">{game.averageMMR} avg MMR</span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            Need <span className="font-semibold text-primary">{game.spotsAvailable}</span> more player{game.spotsAvailable !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      
                      {/* Current Players */}
                      <div>
                        <p className="text-sm font-medium mb-2">Current Players:</p>
                        <div className="flex flex-wrap gap-3">
                          {game.players.map((player) => (
                            <div key={player.id} className="flex items-center gap-2 bg-accent/30 rounded-lg px-3 py-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={player.profilePhoto || ''} />
                                <AvatarFallback className="text-xs">
                                  {player.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="text-sm">
                                <span className="font-medium">{player.name}</span>
                                <span className="text-muted-foreground ml-2">({player.mmr} MMR)</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex justify-between items-center pt-2 border-t">
                        <p className="text-xs text-muted-foreground">
                          Posted by {game.createdBy}
                        </p>
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          Join Game
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
