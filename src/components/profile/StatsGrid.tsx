
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, MapPin, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StatsGridProps {
  profileData: {
    current_mmr: number;
    level?: number;
    total_xp?: number;
  };
}

export const StatsGrid = ({ profileData }: StatsGridProps) => {
  const navigate = useNavigate();
  
  // Mock data for now - will be replaced with real data later
  const stats = {
    friends: 12,
  };

  // Mock data for upcoming tournament - will be replaced with real data later
  const upcomingTournament = {
    id: "tournament-123", // This would come from real data
    name: "Summer Championship 2024",
    date: "2024-02-15",
    location: "Tennis Club Mauritius",
    teamPartner: "Sarah Johnson"
  };

  const handleTournamentClick = () => {
    navigate(`/tournaments/${upcomingTournament.id}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Upcoming Tournament Card */}
      <Card 
        className="hover:shadow-md transition-shadow cursor-pointer" 
        onClick={handleTournamentClick}
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            Upcoming Tournament
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h4 className="font-semibold text-sm">{upcomingTournament.name}</h4>
          </div>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span>{new Date(upcomingTournament.date).toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              <span>{upcomingTournament.location}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="h-3 w-3" />
              <span>Partner: {upcomingTournament.teamPartner}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Card */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-500" />
            Social
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Friends</span>
            <span className="font-semibold">{stats.friends}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
