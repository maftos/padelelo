
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Users } from "lucide-react";

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Activity Card */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-500" />
            Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Win Streak</span>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              3
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">This Month</span>
            <span className="font-semibold">8 matches</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Last played 2 days ago
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
