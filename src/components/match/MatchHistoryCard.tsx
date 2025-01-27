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

  return (
    <Card className="p-4 space-y-4">
      <MatchHeader
        changeType={change_type}
        createdAt={created_at}
        changeAmount={change_amount}
      />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <TeamDisplay
            player1DisplayName={team1_player1_display_name}
            player1ProfilePhoto={team1_player1_profile_photo}
            player2DisplayName={team1_player2_display_name}
            player2ProfilePhoto={team1_player2_profile_photo}
            player1IsCompleter={isMatchCompleter(player1_id)}
            player2IsCompleter={isMatchCompleter(player2_id)}
          />

          <div className="flex items-center gap-2 font-semibold">
            <span>{team1_score}</span>
            <span className="text-muted-foreground">-</span>
            <span>{team2_score}</span>
          </div>

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

        <MatchFooter oldMmr={old_mmr} newMmr={new_mmr} />
      </div>
    </Card>
  );
};