
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer } from "@/components/layouts/PageContainer";
import { PageHeader } from "@/components/match/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { Navigation } from "@/components/Navigation";
import { toast } from "sonner";

interface Tournament {
  tournament_id: string;
  name: string;
  description: string;
  date: string;  // Changed from [string, string] to string since it's a tsrange
  status: string;
  venue_id: string;
  recommended_mmr: number;
  interested_count: number;
  is_user_interested: boolean;
}

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
      return (data as unknown as Tournament[])[0];
    },
    enabled: !!tournamentId
  });

  const formatTournamentDate = (dateRange: string) => {
    try {
      if (!dateRange) return "TBD";
      
      // PostgreSQL tsrange comes in format like "[2024-03-01,2024-03-02)"
      const matches = dateRange.match(/\[(.*?),(.*?)\)/);
      if (!matches) return "Invalid Date Range";
      
      const startDate = parseISO(matches[1]);
      const endDate = parseISO(matches[2]);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return "Invalid Date Range";
      }

      return `${format(startDate, 'PPP')} - ${format(endDate, 'PPP')}`;
    } catch (error) {
      console.error("Error formatting date range:", error, dateRange);
      return "Invalid Date Range";
    }
  };

  const { mutate: toggleInterest } = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('notify_tournament_interest', {
        body: { tournament_id: tournamentId }
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
                  Dates: {formatTournamentDate(tournament.date)}
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
