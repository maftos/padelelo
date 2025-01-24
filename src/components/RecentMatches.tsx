import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

interface MatchData {
  match_id: string;
  team1_score: number;
  team2_score: number;
  created_at: string;
  team1_player1_display_name: string;
  team1_player1_profile_photo: string;
  team1_player2_display_name: string;
  team1_player2_profile_photo: string;
  team2_player1_display_name: string;
  team2_player1_profile_photo: string;
  team2_player2_display_name: string;
  team2_player2_profile_photo: string;
}

export const RecentMatches = () => {
  const isMobile = useIsMobile();
  const { data: matches, isLoading } = useQuery({
    queryKey: ["recentMatches"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_latest_completed_matches");
      if (error) throw error;
      return data as MatchData[];
    },
  });

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

  return (
    <div className="space-y-4 w-full max-w-md animate-slide-up">
      <h2 className="text-xl font-semibold">Latest Matches</h2>
      <div className="space-y-2">
        {matches?.map((match) => (
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

                {/* Scores */}
                <div className={`flex items-center gap-2 font-semibold ${isMobile ? 'px-2' : 'px-4'}`}>
                  <span>{match.team1_score}</span>
                  <span className="text-muted-foreground">-</span>
                  <span>{match.team2_score}</span>
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
        ))}
      </div>
    </div>
  );
};