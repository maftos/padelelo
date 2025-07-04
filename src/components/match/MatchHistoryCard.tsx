
import { Card } from "@/components/ui/card";
import { MatchHeader } from "./MatchHeader";
import { TeamDisplay } from "./TeamDisplay";
import { MatchFooter } from "./MatchFooter";

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
    <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-all duration-200 p-4 space-y-4">
      <MatchHeader
        changeType={change_type}
        createdAt={created_at}
        changeAmount={change_amount}
      />
      
      <div className="flex items-center justify-between gap-4">
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
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-accent/20 to-accent/30 border border-accent/30">
          <span className="text-2xl font-bold text-foreground">{team1_score}</span>
          <span className="text-lg text-muted-foreground">-</span>
          <span className="text-2xl font-bold text-foreground">{team2_score}</span>
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

        {/* MMR Section - Moved to the right */}
        <div className="flex items-center gap-4 ml-6">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Previous</p>
            <p className="text-sm font-semibold text-foreground">{formatMmr(old_mmr)}</p>
          </div>
          <div className="flex items-center">
            <div className="h-px w-8 bg-gradient-to-r from-primary to-secondary"></div>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">New</p>
            <p className="text-sm font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {formatMmr(new_mmr)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
