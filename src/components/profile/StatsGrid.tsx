
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Calendar, Trophy, Users, Zap, Target } from "lucide-react";

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
    matches: { total: 45, won: 28, lost: 17 },
    winRate: Math.round((28 / 45) * 100),
    streak: 3,
    friends: 12,
    achievements: 8,
    level: profileData.level || 1,
    xp: profileData.total_xp || 0,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Performance Card */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Win Rate</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {stats.winRate}%
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Matches</span>
            <span className="font-semibold">{stats.matches.total}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {stats.matches.won}W - {stats.matches.lost}L
          </div>
        </CardContent>
      </Card>

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
              {stats.streak}
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
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Achievements</span>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              {stats.achievements}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            Joined 3 tournaments
          </div>
        </CardContent>
      </Card>

      {/* Experience Card */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Zap className="h-4 w-4 text-green-500" />
            Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Level</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {stats.level}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total XP</span>
            <span className="font-semibold">{stats.xp.toLocaleString()}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            MMR: {profileData.current_mmr || 0}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
