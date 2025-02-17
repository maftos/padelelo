
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer } from "@/components/layouts/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { Navigation } from "@/components/Navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Trophy, Users } from "lucide-react";

interface Tournament {
  tournament_id: string;
  name: string;
  description: string;
  date: string;
  status: string;
  venue_id: string;
  recommended_mmr: number;
  interested_count: number;
  is_user_interested: boolean;
  tournament_photo: string;
  admin_display_name: string;
  admin_profile_photo: string;
  venue_name: string;
  venue_location: [number, number];
  total_participants: number;
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
      const tournaments = data as unknown as Tournament[];
      return tournaments[0];
    },
    enabled: !!tournamentId
  });

  const formatTournamentDate = (dateRange: string) => {
    try {
      if (!dateRange) return "TBD";
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
        <div className="relative h-64 -mx-4 sm:-mx-6 mb-6">
          <img
            src={tournament.tournament_photo || '/placeholder.svg'}
            alt={tournament.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-background/0" />
        </div>

        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{tournament.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={tournament.admin_profile_photo} />
                  <AvatarFallback>
                    {tournament.admin_display_name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-muted-foreground">
                  Organized by {tournament.admin_display_name}
                </span>
              </div>
            </div>
            <Button 
              variant={tournament.is_user_interested ? "secondary" : "default"}
              onClick={() => toggleInterest()}
              className="shrink-0"
            >
              {tournament.is_user_interested ? "Remove Interest" : "I'm Interested"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tournament Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">{tournament.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <span>{formatTournamentDate(tournament.date)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <span>{tournament.venue_name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-muted-foreground" />
                      <span>Recommended MMR: {tournament.recommended_mmr}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span>{tournament.total_participants} participants • {tournament.interested_count} interested</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Map view coming soon</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
