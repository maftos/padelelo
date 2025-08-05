
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
  const matches: MatchDetails[] = confirmedMatches.flatMap((booking) => {
    const allMatches: MatchDetails[] = [];
    
    // Since confirmed matches now contain the booking data with nested matches
    // We need to extract matches from the booking structure
    if (booking && typeof booking === 'object' && 'matches' in booking) {
      const bookingData = booking as any;
      if (bookingData.matches && Array.isArray(bookingData.matches)) {
        bookingData.matches.forEach((match: any) => {
          const team1 = match.team1 || {};
          const team2 = match.team2 || {};
          const sets = match.sets || [];
          
          // Calculate total scores from sets won
          const team1_score = match.team1_sets_won || 0;
          const team2_score = match.team2_sets_won || 0;
          
          allMatches.push({
            match_id: match.match_id,
            old_mmr: 0,
            change_amount: 0,
            change_type: '',
            created_at: bookingData.start_time,
            partner_id: "",
            new_mmr: 0,
            status: "COMPLETED",
            team1_score,
            team2_score,
            team1_player1_display_name: team1.player1 ? `${team1.player1.first_name || ''} ${team1.player1.last_name || ''}`.trim() : '',
            team1_player1_profile_photo: team1.player1?.profile_photo || '',
            team1_player2_display_name: team1.player2 ? `${team1.player2.first_name || ''} ${team1.player2.last_name || ''}`.trim() : '',
            team1_player2_profile_photo: team1.player2?.profile_photo || '',
            team2_player1_display_name: team2.player1 ? `${team2.player1.first_name || ''} ${team2.player1.last_name || ''}`.trim() : '',
            team2_player1_profile_photo: team2.player1?.profile_photo || '',
            team2_player2_display_name: team2.player2 ? `${team2.player2.first_name || ''} ${team2.player2.last_name || ''}`.trim() : '',
            team2_player2_profile_photo: team2.player2?.profile_photo || '',
            completed_by: undefined,
            player1_id: team1.player1?.id,
            player2_id: team1.player2?.id,
            player3_id: team2.player1?.id,
            player4_id: team2.player2?.id,
            sets: sets.map((set: any) => ({
              set_number: set.set_number,
              team1_score: set.team1_score,
              team2_score: set.team2_score,
            })),
          });
        });
      }
    }
    
    return allMatches;
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
