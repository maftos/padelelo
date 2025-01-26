import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { useUserProfile } from "@/hooks/use-user-profile";
import { MatchHistoryCard } from "@/components/match/MatchHistoryCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

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

const Matches = () => {
  const { toast } = useToast();
  const { userId } = useUserProfile();
  const navigate = useNavigate();
  const { session, loading } = useAuth();

  // Check authentication status
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

      return data as MatchDetails[];
    },
    enabled: !!userId && !!session,
  });

  // Show loading state while checking auth
  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <p>Loading...</p>
    </div>;
  }

  // Don't render anything if not authenticated
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

        <div className="space-y-4 max-w-2xl mx-auto">
          {isLoading ? (
            <p className="text-center">Loading matches...</p>
          ) : matches.length === 0 ? (
            <p className="text-center text-muted-foreground">No matches found</p>
          ) : (
            matches.map((match) => (
              <MatchHistoryCard 
                key={match.match_id}
                match_id={match.match_id}
                old_mmr={0} // These will be fetched by the MatchHistoryCard component
                change_amount={0}
                change_type=""
                created_at={match.created_at}
                partner_id=""
                new_mmr={0}
                status="COMPLETED"
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Matches;