
import { MatchHistoryCard } from "./MatchHistoryCard";

interface Match {
  match_id: string;
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

interface MatchesListProps {
  matches: Match[];
  isLoading: boolean;
}

export const MatchesList = ({ matches, isLoading }: MatchesListProps) => {
  if (isLoading) {
    return <p className="text-center">Loading matches...</p>;
  }

  if (matches.length === 0) {
    return <p className="text-center text-muted-foreground">No matches found</p>;
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <MatchHistoryCard key={match.match_id} {...match} />
      ))}
    </div>
  );
};
