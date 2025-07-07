
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, MapPin, Users } from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'match' | 'tournament';
  title: string;
  date: string;
  status: 'won' | 'lost' | 'participating' | 'completed';
  location?: string;
  details: string;
}

// Mock data for now - this will be replaced with real data later
const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'match',
    title: 'Match vs Sarah & Mike',
    date: '2024-01-15',
    status: 'won',
    location: 'Padel Club Central',
    details: 'Won 6-4, 6-2'
  },
  {
    id: '2',
    type: 'tournament',
    title: 'Summer Championship 2024',
    date: '2024-01-10',
    status: 'participating',
    location: 'Tennis Club Mauritius',
    details: 'Quarter-finals'
  },
  {
    id: '3',
    type: 'match',
    title: 'Match vs Alex & Emma',
    date: '2024-01-08',
    status: 'lost',
    location: 'Sports Complex',
    details: 'Lost 4-6, 3-6'
  },
];

interface UserActivityProps {
  userId?: string;
}

export const UserActivity = ({ userId }: UserActivityProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'won':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Won</Badge>;
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
      <CardContent className="space-y-4">
        {mockActivities.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No recent activity to display
          </p>
        ) : (
          mockActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border bg-card/50">
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium truncate">{activity.title}</h4>
                  {getStatusBadge(activity.status)}
                </div>
                <p className="text-xs text-muted-foreground mb-2">{activity.details}</p>
                <div className="flex items-center text-xs text-muted-foreground space-x-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(activity.date).toLocaleDateString()}
                  </span>
                  {activity.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {activity.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
