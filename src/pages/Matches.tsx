
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
}

const Matches = () => {
  const { toast } = useToast();
  const { userId } = useUserProfile();
  const navigate = useNavigate();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && !session) {
      navigate('/login');
    }
  }, [session, loading, navigate]);

  const { data: matches = [], isLoading } = useQuery({
    queryKey: ["myCompletedMatches", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase.rpc("get_my_completed_matches", {
        user_a_id: userId,
        page_number: 1,
        page_size: 10
      });

      if (error) {
        toast({
          title: "Error fetching matches",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      // Handle the new JSON response format with pagination
      const matchesData = (data as any)?.matches || [];
      
      return matchesData.map((match: any) => {
        const team1 = match.team1 || {};
        const team2 = match.team2 || {};
        
        return {
          match_id: match.match_id,
          old_mmr: match.old_mmr,
          change_amount: match.change_amount,
          change_type: match.change_type,
          created_at: match.created_at,
          partner_id: "",
          new_mmr: match.new_mmr,
          status: "COMPLETED",
          team1_score: match.team1_score,
          team2_score: match.team2_score,
          team1_player1_display_name: team1.player1 ? `${team1.player1.first_name || ''} ${team1.player1.last_name || ''}`.trim() : '',
          team1_player1_profile_photo: team1.player1?.profile_photo || '',
          team1_player2_display_name: team1.player2 ? `${team1.player2.first_name || ''} ${team1.player2.last_name || ''}`.trim() : '',
          team1_player2_profile_photo: team1.player2?.profile_photo || '',
          team2_player1_display_name: team2.player1 ? `${team2.player1.first_name || ''} ${team2.player1.last_name || ''}`.trim() : '',
          team2_player1_profile_photo: team2.player1?.profile_photo || '',
          team2_player2_display_name: team2.player2 ? `${team2.player2.first_name || ''} ${team2.player2.last_name || ''}`.trim() : '',
          team2_player2_profile_photo: team2.player2?.profile_photo || '',
          completed_by: match.completed_by,
          player1_id: team1.player1?.id,
          player2_id: team1.player2?.id,
          player3_id: team2.player1?.id,
          player4_id: team2.player2?.id,
        };
      });
    },
    enabled: !!userId && !!session,
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
