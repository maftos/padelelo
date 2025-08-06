import { Card } from "@/components/ui/card";
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
      <div className="space-y-4 w-full max-w-md animate-pulse">
        <h2 className="text-xl font-semibold">Latest Matches</h2>
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

  // Get recent matches from all bookings, limit to 5 most recent
  const recentMatches = confirmedMatches
    ?.flatMap(booking => 
      booking.matches.map(match => ({
        match_id: match.match_id,
        booking_id: booking.booking_id,
        venue_name: booking.venue_name,
        start_time: booking.start_time,
        created_at: booking.start_time,
        team1_score: match.total_team1_score,
        team2_score: match.total_team2_score,
        team1_player1_display_name: match.team1_player1_display_name,
        team1_player1_profile_photo: match.team1_player1_profile_photo,
        team1_player2_display_name: match.team1_player2_display_name,
        team1_player2_profile_photo: match.team1_player2_profile_photo,
        team2_player1_display_name: match.team2_player1_display_name,
        team2_player1_profile_photo: match.team2_player1_profile_photo,
        team2_player2_display_name: match.team2_player2_display_name,
        team2_player2_profile_photo: match.team2_player2_profile_photo,
      }))
    )
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5) || [];

  return (
    <div className="space-y-4 w-full animate-slide-up">
      <h2 className="text-xl font-semibold">Latest Matches</h2>
      <div className="space-y-2">
        {recentMatches.length > 0 ? (
          recentMatches.map((match) => (
            <Card 
              key={match.match_id} 
              className="p-3 hover:bg-muted/50 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>
                    {formatDistanceToNow(new Date(match.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                  <span className="text-xs font-medium">
                    {match.team1_score} - {match.team2_score}
                  </span>
                </div>
                
                <div className="flex items-center justify-between gap-2">
                  {/* Team 1 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Avatar className="h-5 w-5 shrink-0">
                        <AvatarImage src={match.team1_player1_profile_photo} />
                        <AvatarFallback>{getInitials(match.team1_player1_display_name)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs truncate">{match.team1_player1_display_name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Avatar className="h-5 w-5 shrink-0">
                        <AvatarImage src={match.team1_player2_profile_photo} />
                        <AvatarFallback>{getInitials(match.team1_player2_display_name)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs truncate">{match.team1_player2_display_name}</span>
                    </div>
                  </div>

                  {/* VS indicator */}
                  <div className="flex items-center justify-center px-2">
                    <span className="text-xs text-muted-foreground font-medium">VS</span>
                  </div>

                  {/* Team 2 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="text-xs truncate">{match.team2_player1_display_name}</span>
                      <Avatar className="h-5 w-5 shrink-0">
                        <AvatarImage src={match.team2_player1_profile_photo} />
                        <AvatarFallback>{getInitials(match.team2_player1_display_name)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex items-center justify-end gap-1.5 mt-1">
                      <span className="text-xs truncate">{match.team2_player2_display_name}</span>
                      <Avatar className="h-5 w-5 shrink-0">
                        <AvatarImage src={match.team2_player2_profile_photo} />
                        <AvatarFallback>{getInitials(match.team2_player2_display_name)}</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p className="text-sm">No recent matches</p>
          </div>
        )}
      </div>
    </div>
  );
};