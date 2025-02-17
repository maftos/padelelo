
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer } from "@/components/layouts/PageContainer";
import { PageHeader } from "@/components/match/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Navigation } from "@/components/Navigation";
import { toast } from "sonner";

export default function TournamentDetail() {
  const { tournamentId } = useParams();
  const queryClient = useQueryClient();

  const { data: tournament, isLoading } = useQuery({
    queryKey: ['tournament', tournamentId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('view_tournament', {
        p_tournament_id: tournamentId
      });
      if (error) throw error;
      return data[0];
    },
    enabled: !!tournamentId
  });

  const { mutate: toggleInterest } = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc('notify_tournament_interest', {
        p_tournament_id: tournamentId
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (isInterested) => {
      queryClient.invalidateQueries({ queryKey: ['tournament', tournamentId] });
      toast.success(isInterested ? "You're now interested in this tournament" : "Interest removed");
    },
    onError: () => {
      toast.error("Failed to update interest");
    }
  });

  if (isLoading) return <div>Loading tournament details...</div>;
  if (!tournament) return <div>Tournament not found</div>;

  return (
    <>
      <Navigation />
      <PageContainer>
        <PageHeader title={tournament.name} description="Tournament Details" />
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>{tournament.description}</p>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Dates: {format(new Date(tournament.date[0]), 'PPP')} - {format(new Date(tournament.date[1]), 'PPP')}
                </p>
                <p className="text-sm text-muted-foreground">
                  Recommended MMR: {tournament.recommended_mmr}
                </p>
                <p className="text-sm text-muted-foreground">
                  {tournament.interested_count} interested players
                </p>
              </div>
              
              <Button 
                variant={tournament.is_user_interested ? "secondary" : "default"}
                onClick={() => toggleInterest()}
                className="w-full"
              >
                {tournament.is_user_interested ? "Remove Interest" : "I'm Interested"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    </>
  );
}
