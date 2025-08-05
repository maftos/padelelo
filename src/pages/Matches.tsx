
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useConfirmedMatches } from "@/hooks/use-confirmed-matches";
import { Navigation } from "@/components/Navigation";
import { Loading } from "@/components/ui/loading";
import { MatchesList } from "@/components/match/MatchesList";

interface MatchDetails {
  match_id: string;
  old_mmr: number;
  change_amount: number;
  change_type: string;
  created_at: string;
  partner_id: string;
  new_mmr: number;
  status: string;
  team1_score: number;
  team2_score: number;
  team1_player1_display_name: string;
  team1_player1_profile_photo: string;
  team1_player2_display_name: string;
  team1_player2_profile_photo: string;
  team2_player1_display_name: string;
  team2_player1_profile_photo: string;
  team2_player2_display_name: string;
  team2_player2_profile_photo: string;
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

const Matches = () => {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const { confirmedMatches, isLoading } = useConfirmedMatches();

  useEffect(() => {
    if (!loading && !session) {
      navigate('/login');
    }
  }, [session, loading, navigate]);

  // Transform confirmed matches to match the expected MatchDetails interface
  const matches: MatchDetails[] = confirmedMatches.map((match) => {
    const matchData = match as any;
    
    return {
      match_id: matchData.match_id || '',
      old_mmr: matchData.user_old_mmr || 0,
      change_amount: Math.abs(matchData.user_mmr_change || 0),
      change_type: matchData.change_type || (matchData.user_mmr_change > 0 ? 'WIN' : 'LOSS'),
      created_at: matchData.match_date || '',
      partner_id: "",
      new_mmr: matchData.user_new_mmr || 0,
      status: "COMPLETED",
      team1_score: matchData.team1_total_score || 0,
      team2_score: matchData.team2_total_score || 0,
      team1_player1_display_name: matchData.team1_player1_name || '',
      team1_player1_profile_photo: matchData.team1_player1_photo || '',
      team1_player2_display_name: matchData.team1_player2_name || '',
      team1_player2_profile_photo: matchData.team1_player2_photo || '',
      team2_player1_display_name: matchData.team2_player1_name || '',
      team2_player1_profile_photo: matchData.team2_player1_photo || '',
      team2_player2_display_name: matchData.team2_player2_name || '',
      team2_player2_profile_photo: matchData.team2_player2_photo || '',
      completed_by: undefined,
      player1_id: matchData.team1_player1_id,
      player2_id: matchData.team1_player2_id,
      player3_id: matchData.team2_player1_id,
      player4_id: matchData.team2_player2_id,
      sets: matchData.sets || [],
    };
  });

  if (loading) {
    return <Loading />;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Navigation />
      <main className="container py-12 px-4 max-w-4xl mx-auto">
        <div className="space-y-8 animate-fade-in">
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent leading-tight">
                Match History
              </h1>
              <p className="text-muted-foreground text-lg">Track your padel journey and performance</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Recent Matches</span>
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl p-6">
            <MatchesList matches={matches} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Matches;
