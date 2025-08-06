
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Trophy, MapPin, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { useConfirmedMatches } from "@/hooks/use-confirmed-matches";

interface MatchActivity {
  id: string;
  type: 'match';
  title: string;
  date: string;
  status: 'won' | 'lost';
  location: string;
  details: string;
  time: string;
}

export const ActivityFeed = () => {
  const { confirmedMatches, isLoading } = useConfirmedMatches(1, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'won':
        return <Badge className="bg-green-500 hover:bg-green-600">Won</Badge>;
      case 'lost':
        return <Badge variant="destructive">Lost</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getActivityIcon = () => {
    return <Users className="h-4 w-4" />;
  };

  // Transform confirmed matches to match-level activities
  const recentMatches: MatchActivity[] = confirmedMatches
    ?.flatMap(booking => 
      booking.matches.map(match => {
        // Calculate overall match result and score from all sets
        const totalSets = match.sets?.length || 0;
        const setsWon = match.sets?.filter((set: any) => set.result === 'WIN').length || 0;
        const setsLost = totalSets - setsWon;
        const matchWon = setsWon > setsLost;
        
        // Get opponent names
        const opponent1Name = match.team2_player1_display_name?.split(' ')[0] || 'Player';
        const opponent2Name = match.team2_player2_display_name?.split(' ')[0] || 'Player';

        return {
          id: match.match_id,
          type: 'match' as const,
          title: `Match vs ${opponent1Name} & ${opponent2Name}`,
          date: booking.start_time,
          status: matchWon ? 'won' as const : 'lost' as const,
          location: booking.venue_name,
          details: `${matchWon ? 'Won' : 'Lost'} ${setsWon}-${setsLost}`,
          time: formatDistanceToNow(new Date(booking.start_time), { addSuffix: true })
        };
      })
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5) || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-card/50">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentMatches.length > 0 ? (
            recentMatches.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg bg-card/50 hover:bg-card/80 transition-colors">
                <div className="flex-shrink-0 mt-1 p-2 rounded-full bg-background">
                  {getActivityIcon()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-sm">{activity.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{activity.details}</p>
                    </div>
                    {getStatusBadge(activity.status)}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {activity.location}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p className="text-sm">No recent matches</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
