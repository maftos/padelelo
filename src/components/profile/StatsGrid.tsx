
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, MapPin, Trophy } from "lucide-react";

interface StatsGridProps {
  profileData: {
    current_mmr: number;
    level?: number;
    total_xp?: number;
  };
}

export const StatsGrid = ({ profileData }: StatsGridProps) => {
  // Mock data for now - will be replaced with real data later
  const stats = {
    friends: 12,
  };

  // Mock data for upcoming tournament - will be replaced with real data later
  const upcomingTournament = {
    name: "Summer Championship 2024",
    date: "2024-02-15",
    location: "Tennis Club Mauritius",
    status: "confirmed" as const,
    teamPartner: "Sarah Johnson",
    registrationDate: "2024-01-20"
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Upcoming Tournament Card */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            Upcoming Tournament
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h4 className="font-semibold text-sm">{upcomingTournament.name}</h4>
            <Badge variant="secondary" className="bg-green-100 text-green-800 mt-1">
              {upcomingTournament.status === 'confirmed' ? 'Confirmed' : 'Pending'}
            </Badge>
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
          
          <div className="text-xs text-muted-foreground border-t pt-2">
            Registered on {new Date(upcomingTournament.registrationDate).toLocaleDateString()}
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
