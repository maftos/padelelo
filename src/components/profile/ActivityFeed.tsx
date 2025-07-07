
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Trophy, MapPin, Clock } from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'match' | 'tournament' | 'achievement';
  title: string;
  date: string;
  status: 'won' | 'lost' | 'participating' | 'completed' | 'achieved';
  location?: string;
  details: string;
  time?: string;
}

// Mock data for now - this will be replaced with real data later
const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'match',
    title: 'Match vs Sarah & Mike',
    date: '2024-01-15',
    time: '2 days ago',
    status: 'won',
    location: 'Padel Club Central',
    details: 'Won 6-4, 6-2'
  },
  {
    id: '2',
    type: 'achievement',
    title: 'First Tournament Win',
    date: '2024-01-12',
    time: '5 days ago',
    status: 'achieved',
    details: 'Completed your first tournament victory'
  },
  {
    id: '3',
    type: 'tournament',
    title: 'Summer Championship 2024',
    date: '2024-01-10',
    time: '1 week ago',
    status: 'participating',
    location: 'Tennis Club Mauritius',
    details: 'Quarter-finals'
  },
  {
    id: '4',
    type: 'match',
    title: 'Match vs Alex & Emma',
    date: '2024-01-08',
    time: '1 week ago',
    status: 'lost',
    location: 'Sports Complex',
    details: 'Lost 4-6, 3-6'
  },
];

export const ActivityFeed = () => {
  const getStatusBadge = (status: string, type: string) => {
    if (type === 'achievement') {
      return <Badge className="bg-purple-500 hover:bg-purple-600">Achievement</Badge>;
    }
    
    switch (status) {
      case 'won':
        return <Badge className="bg-green-500 hover:bg-green-600">Won</Badge>;
      case 'lost':
        return <Badge variant="destructive">Lost</Badge>;
      case 'participating':
        return <Badge variant="secondary">Participating</Badge>;
      case 'completed':
        return <Badge variant="outline">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'match':
        return <Users className="h-4 w-4" />;
      case 'tournament':
        return <Trophy className="h-4 w-4" />;
      case 'achievement':
        return <Trophy className="h-4 w-4 text-purple-500" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

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
          {mockActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg bg-card/50 hover:bg-card/80 transition-colors">
              <div className="flex-shrink-0 mt-1 p-2 rounded-full bg-background">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-sm">{activity.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{activity.details}</p>
                  </div>
                  {getStatusBadge(activity.status, activity.type)}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {activity.time && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </span>
                  )}
                  {activity.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {activity.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
