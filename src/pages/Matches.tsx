
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
      });

      if (error) {
        toast({
          title: "Error fetching matches",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data.map((match: any) => ({
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
        team1_player1_display_name: match.player1_display_name,
        team1_player1_profile_photo: match.player1_profile_photo,
        team1_player2_display_name: match.player2_display_name,
        team1_player2_profile_photo: match.player2_profile_photo,
        team2_player1_display_name: match.player3_display_name,
        team2_player1_profile_photo: match.player3_profile_photo,
        team2_player2_display_name: match.player4_display_name,
        team2_player2_profile_photo: match.player4_profile_photo,
        completed_by: match.completed_by,
        player1_id: match.player1_id,
        player2_id: match.player2_id,
        player3_id: match.player3_id,
        player4_id: match.player4_id,
      }));
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
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container py-8 px-4 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Match History</h1>
          <p className="text-muted-foreground">View your recent matches</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <MatchesList matches={matches} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
};

export default Matches;
