
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Building2 } from "lucide-react";

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

  // Mock data for preferred courts - will be replaced with real data later
  const preferredCourts = [
    { name: "Tennis Club Mauritius", timesPlayed: 15 },
    { name: "Le Morne Sports Complex", timesPlayed: 12 },
    { name: "Belle Mare Tennis Club", timesPlayed: 8 }
  ];

  // Mock data for top partners - will be replaced with real data later
  const topPartners = [
    { name: "Sarah Johnson", gamesPlayed: 15 },
    { name: "Alex Chen", gamesPlayed: 12 },
    { name: "Maria Rodriguez", gamesPlayed: 8 }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Preferred Courts Card */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Building2 className="h-4 w-4 text-blue-500" />
            Preferred Courts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="space-y-2">
              {preferredCourts.map((court, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-foreground">{court.name}</span>
                  </div>
                  <span className="text-muted-foreground">{court.timesPlayed} games</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Card */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-500" />
            Social ({stats.friends} friends)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h5 className="text-sm font-medium mb-3">Top Partners</h5>
            <div className="space-y-2">
              {topPartners.map((partner, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-foreground">{partner.name}</span>
                  <span className="text-muted-foreground">{partner.gamesPlayed} games</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
