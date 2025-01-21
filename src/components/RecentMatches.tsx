import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4">
              <div className="h-16 bg-gray-200 rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full max-w-md animate-slide-up">
      <h2 className="text-xl font-semibold">Latest Matches</h2>
      <div className="space-y-3">
        {matches?.map((match) => (
          <Card key={match.match_id} className="p-4 hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>
                  {formatDistanceToNow(new Date(match.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              
              <div className="flex items-center justify-between gap-4">
                {/* Team 1 */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={match.team1_player1_profile_photo} />
                      <AvatarFallback>{getInitials(match.team1_player1_display_name)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{match.team1_player1_display_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={match.team1_player2_profile_photo} />
                      <AvatarFallback>{getInitials(match.team1_player2_display_name)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{match.team1_player2_display_name}</span>
                  </div>
                  <div className="text-right font-semibold text-foreground">
                    {match.team1_score}
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="w-px bg-border self-stretch mx-2"></div>

                {/* Team 2 */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={match.team2_player1_profile_photo} />
                      <AvatarFallback>{getInitials(match.team2_player1_display_name)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{match.team2_player1_display_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={match.team2_player2_profile_photo} />
                      <AvatarFallback>{getInitials(match.team2_player2_display_name)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{match.team2_player2_display_name}</span>
                  </div>
                  <div className="text-left font-semibold text-foreground">
                    {match.team2_score}
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