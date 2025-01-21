import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { useUserProfile } from "@/hooks/use-user-profile";
import { MatchHistoryCard } from "@/components/match/MatchHistoryCard";

interface MatchHistory {
  match_id: string;
  user_id: string;
  old_mmr: number;
  change_amount: number;
  change_type: string;
  created_at: string;
  partner_id: string;
  new_mmr: number;
  status: string;
}

const Matches = () => {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const { userId } = useUserProfile();

  const { data: matches = [], isLoading } = useQuery({
    queryKey: ["matches", page, userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase.rpc("get_latest_matches", {
        p_user_id: userId,
        page_number: page,
      });

      if (error) {
        toast({
          title: "Error fetching matches",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data as MatchHistory[];
    },
    enabled: !!userId,
  });

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
              <MatchHistoryCard key={match.match_id} {...match} />
            ))
          )}

          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              onClick={() => setPage((p) => p + 1)}
              disabled={matches.length < 10}
            >
              Load More
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Matches;