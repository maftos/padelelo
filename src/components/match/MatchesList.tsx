
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
  sets?: Array<{
    set_number: number;
    team1_score: number;
    team2_score: number;
  }>;
}

interface MatchesListProps {
  matches: Match[];
  isLoading: boolean;
}

export const MatchesList = ({ matches, isLoading }: MatchesListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-primary/30 animate-pulse"></div>
          <div className="w-3 h-3 rounded-full bg-primary/30 animate-pulse delay-100"></div>
          <div className="w-3 h-3 rounded-full bg-primary/30 animate-pulse delay-200"></div>
        </div>
        <p className="text-muted-foreground mt-4">Loading match history...</p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20"></div>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No matches yet</h3>
        <p className="text-muted-foreground">Your match history will appear here once you start playing</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <MatchHistoryCard key={match.match_id} {...match} />
      ))}
    </div>
  );
};
