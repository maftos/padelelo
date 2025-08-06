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
          // Determine user's partner - for now assume user is on team1 and show team1_player2 as partner
          // This could be enhanced to actually check which team the user is on
          const partnerName = match.team1_player2_display_name;
          const partnerPhoto = match.team1_player2_profile_photo;
          
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
            change_amount: booking.mmr_after - booking.mmr_before,
            partner_name: partnerName,
            partner_photo: partnerPhoto,
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
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(set.created_at), {
                    addSuffix: true,
                  })}
                </div>
                
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6 shrink-0">
                    <AvatarImage src={set.partner_photo} />
                    <AvatarFallback className="text-xs">{getInitials(set.partner_name)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{set.partner_name.split(" ")[0]}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 px-2 py-1 bg-background rounded border text-sm">
                  <span className="font-medium">{set.team1_score}</span>
                  <span className="text-muted-foreground">-</span>
                  <span className="font-medium">{set.team2_score}</span>
                </div>
                
                <Badge 
                  variant={set.set_won ? "default" : "destructive"}
                  className={`px-2 py-0.5 text-xs font-semibold ${
                    set.set_won 
                      ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white" 
                      : ""
                  }`}
                >
                  {set.set_won ? "+" : ""}{set.change_amount}
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