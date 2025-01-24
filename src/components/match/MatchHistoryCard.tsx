import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/use-user-profile";

interface MatchHistoryCardProps {
  match_id: string;
  old_mmr: number;
  change_amount: number;
  change_type: string;
  created_at: string;
  partner_id: string;
  new_mmr: number;
  status: string;
}

interface MatchDetails {
  match_id: string;
  team1_player1_id: string;
  team1_player2_id: string;
  team2_player1_id: string;
  team2_player2_id: string;
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

export const MatchHistoryCard = ({
  old_mmr,
  change_amount,
  change_type,
  created_at,
  new_mmr,
  status,
  match_id,
}: MatchHistoryCardProps) => {
  const { userId } = useUserProfile();

  const { data: matchDetails } = useQuery({
    queryKey: ["matchDetails", match_id],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      const { data, error } = await supabase.rpc("get_my_completed_matches", {
        user_a_id: userId
      });
      if (error) throw error;
      const matchDetail = data.find((match) => match.match_id === match_id);
      return matchDetail as MatchDetails;
    },
    enabled: !!userId && !!match_id,
  });

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {matchDetails && (
            <div className="flex -space-x-2">
              <Avatar className="h-8 w-8 border-2 border-background">
                <AvatarImage src={matchDetails.team1_player1_profile_photo} />
                <AvatarFallback>{getInitials(matchDetails.team1_player1_display_name)}</AvatarFallback>
              </Avatar>
              <Avatar className="h-8 w-8 border-2 border-background">
                <AvatarImage src={matchDetails.team1_player2_profile_photo} />
                <AvatarFallback>{getInitials(matchDetails.team1_player2_display_name)}</AvatarFallback>
              </Avatar>
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">
                {change_type === "WIN" ? "Victory" : "Defeat"}
              </p>
              <img 
                src={change_type === "WIN" 
                  ? "/lovable-uploads/0358eddd-eaa0-4d76-ab94-9c1e6b47e269.png" 
                  : "/lovable-uploads/dfc03b48-66e1-4c1d-8450-f3b2f5355c4d.png"} 
                alt={change_type === "WIN" ? "Victory" : "Defeat"}
                className="w-6 h-6"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
        <Badge 
          variant={change_type === "WIN" ? "default" : "destructive"}
          className={change_type === "WIN" ? "bg-green-500 hover:bg-green-600" : ""}
        >
          {change_type === "WIN" ? "+" : "-"}{change_amount} MMR
        </Badge>
      </div>
      
      {matchDetails && (
        <div className="text-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Score:</span>
            <span className="font-medium">
              {matchDetails.team1_score} - {matchDetails.team2_score}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Opponents:</span>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={matchDetails.team2_player1_profile_photo} />
                <AvatarFallback>{getInitials(matchDetails.team2_player1_display_name)}</AvatarFallback>
              </Avatar>
              <Avatar className="h-6 w-6">
                <AvatarImage src={matchDetails.team2_player2_profile_photo} />
                <AvatarFallback>{getInitials(matchDetails.team2_player2_display_name)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between text-sm">
        <span>Previous MMR: {old_mmr}</span>
        <span>New MMR: {new_mmr}</span>
      </div>
      <div className="text-xs text-muted-foreground text-right">
        Status: {status}
      </div>
    </Card>
  );
};