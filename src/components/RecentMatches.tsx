import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useConfirmedMatches } from "@/hooks/use-confirmed-matches";
import { useAuth } from "@/contexts/AuthContext";

export const RecentMatches = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  
  const { confirmedMatches, isLoading } = useConfirmedMatches(1, 5);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="space-y-2 w-full animate-pulse">
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-3">
              <div className="h-12 bg-muted rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Get recent sets from all bookings, limit to 5 most recent
  const recentSets = confirmedMatches
    ?.flatMap(booking => 
      booking.matches.flatMap(match => 
        match.sets?.map((set: any) => {
          return {
            match_id: match.match_id,
            set_id: `${match.match_id}-${set.set_number}`,
            booking_id: booking.booking_id,
            venue_name: booking.venue_name,
            start_time: booking.start_time,
            created_at: booking.start_time,
            set_number: set.set_number,
            team1_score: set.team1_score,
            team2_score: set.team2_score,
            // Determine if user won this specific set (assuming user is on team1)
            set_won: set.team1_score > set.team2_score,
            // Use individual set rating change (already flattened by useConfirmedMatches)
            change_amount: set.change_amount || 0,
            change_type: set.result || 'LOSS',
            // Opponents (team2 players)
            opponent1_name: match.team2_player1_display_name,
            opponent1_photo: match.team2_player1_profile_photo,
            opponent2_name: match.team2_player2_display_name,
            opponent2_photo: match.team2_player2_profile_photo,
          };
        }) || []
      )
    )
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5) || [];

  return (
    <div className="space-y-2 w-full animate-slide-up">
      {recentSets.length > 0 ? (
        recentSets.map((set) => (
          <Card 
            key={set.set_id} 
            className="p-3 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              {/* 1. Opponents */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                <div className="flex items-center -space-x-1 sm:space-x-0 sm:gap-1">
                  <Avatar className="h-5 w-5 sm:h-6 sm:w-6 shrink-0 border border-background">
                    <AvatarImage src={set.opponent1_photo} />
                    <AvatarFallback className="text-xs">{getInitials(set.opponent1_name)}</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-5 w-5 sm:h-6 sm:w-6 shrink-0 border border-background">
                    <AvatarImage src={set.opponent2_photo} />
                    <AvatarFallback className="text-xs">{getInitials(set.opponent2_name)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-1 min-w-0">
                  <span className="text-sm font-medium truncate">
                    {set.opponent1_name.split(" ")[0]} & {set.opponent2_name.split(" ")[0]}
                  </span>
                  <div className="text-xs text-muted-foreground sm:hidden">
                    {formatDistanceToNow(new Date(set.created_at), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                {/* 2. Timestamp - hidden on mobile */}
                <div className="hidden sm:block text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(set.created_at), {
                    addSuffix: true,
                  })}
                </div>

                {/* 3. Score */}
                <div className="flex items-center gap-0.5 px-1.5 sm:px-2 py-1 bg-background rounded border text-sm">
                  <span className="font-medium">{set.team1_score}</span>
                  <span className="text-muted-foreground">-</span>
                  <span className="font-medium">{set.team2_score}</span>
                </div>

                {/* 4. Change amount */}
                <Badge 
                  variant={set.change_type === 'WIN' ? "default" : "destructive"}
                  className={`px-1.5 sm:px-2 py-0.5 text-xs font-semibold ${
                    set.change_type === 'WIN' 
                      ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white" 
                      : ""
                  }`}
                >
                  {set.change_type === 'WIN' ? `+${Math.abs(set.change_amount)}` : `-${Math.abs(set.change_amount)}`}
                </Badge>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <div className="text-center py-4 text-muted-foreground">
          <p className="text-sm">No recent matches</p>
        </div>
      )}
    </div>
  );
};