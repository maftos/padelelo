import { Card } from "@/components/ui/card";
import { MatchHeader } from "./MatchHeader";
import { TeamDisplay } from "./TeamDisplay";
import { TrendingUp, Trophy } from "lucide-react";

interface MatchHistoryCardProps {
  old_mmr: number;
  change_amount: number;
  change_type: string;
  created_at: string;
  new_mmr: number;
  team1_score?: number;
  team2_score?: number;
  team1_player1_display_name?: string;
  team1_player1_profile_photo?: string;
  team1_player2_display_name?: string;
  team1_player2_profile_photo?: string;
  team2_player1_display_name?: string;
  team2_player1_profile_photo?: string;
  team2_player2_display_name?: string;
  team2_player2_profile_photo?: string;
  completed_by?: string;
  player1_id?: string;
  player2_id?: string;
  player3_id?: string;
  player4_id?: string;
}

export const MatchHistoryCard = ({
  old_mmr,
  change_amount,
  change_type,
  created_at,
  new_mmr,
  team1_score,
  team2_score,
  team1_player1_display_name,
  team1_player1_profile_photo,
  team1_player2_display_name,
  team1_player2_profile_photo,
  team2_player1_display_name,
  team2_player1_profile_photo,
  team2_player2_display_name,
  team2_player2_profile_photo,
  completed_by,
  player1_id,
  player2_id,
  player3_id,
  player4_id,
}: MatchHistoryCardProps) => {
  console.log('Match completer ID:', completed_by);
  console.log('Player IDs:', { player1_id, player2_id, player3_id, player4_id });

  const isMatchCompleter = (playerId?: string) => {
    if (!completed_by || !playerId) return false;
    const isCompleter = completed_by === playerId;
    if (isCompleter) {
      console.log('Found match completer:', playerId);
    }
    return isCompleter;
  };

  const formatMmr = (mmr: number) => {
    return mmr?.toFixed(0) || '0';
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.01] p-4 space-y-4 bg-background border border-border">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            change_type === "WIN" ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {change_type === "WIN" ? (
              <Trophy className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingUp className="w-5 h-5 text-red-600 rotate-180" />
            )}
          </div>
          <div>
            <p className="font-semibold text-foreground text-base">
              {change_type === "WIN" ? "Victory" : "Defeat"}
            </p>
            <p className="text-sm text-muted-foreground">
              {new Date(created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold ${
          change_type === "WIN" 
            ? "bg-green-100 text-green-700 border border-green-200" 
            : "bg-red-100 text-red-700 border border-red-200"
        }`}>
          {change_type === "WIN" ? "+" : "-"}{change_amount} MMR
        </div>
      </div>
      
      {/* Match Details */}
      <div className="flex items-center justify-between gap-4 p-4 bg-accent/30 rounded-lg border border-accent/40">
        {/* Left side - Team 1 */}
        <div className="flex-1">
          <TeamDisplay
            player1DisplayName={team1_player1_display_name}
            player1ProfilePhoto={team1_player1_profile_photo}
            player2DisplayName={team1_player2_display_name}
            player2ProfilePhoto={team1_player2_profile_photo}
            player1IsCompleter={isMatchCompleter(player1_id)}
            player2IsCompleter={isMatchCompleter(player2_id)}
          />
        </div>

        {/* Center - Score */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-background border border-border shadow-sm">
          <span className="text-xl font-bold text-foreground">{team1_score}</span>
          <span className="text-lg text-muted-foreground">-</span>
          <span className="text-xl font-bold text-foreground">{team2_score}</span>
        </div>

        {/* Right side - Team 2 */}
        <div className="flex-1">
          <TeamDisplay
            player1DisplayName={team2_player1_display_name}
            player1ProfilePhoto={team2_player1_profile_photo}
            player2DisplayName={team2_player2_display_name}
            player2ProfilePhoto={team2_player2_profile_photo}
            player1IsCompleter={isMatchCompleter(player3_id)}
            player2IsCompleter={isMatchCompleter(player4_id)}
            isRightAligned
          />
        </div>
      </div>

      {/* MMR Change */}
      <div className="flex items-center justify-center gap-4 pt-2">
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Previous</p>
          <p className="text-sm font-semibold text-foreground">{formatMmr(old_mmr)}</p>
        </div>
        <div className="flex items-center">
          <div className="h-px w-8 bg-gradient-to-r from-primary/50 to-primary"></div>
          <TrendingUp className="h-4 w-4 text-primary mx-1" />
          <div className="h-px w-8 bg-gradient-to-r from-primary to-primary/50"></div>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">New</p>
          <p className="text-sm font-semibold text-primary">
            {formatMmr(new_mmr)}
          </p>
        </div>
      </div>
    </Card>
  );
};
