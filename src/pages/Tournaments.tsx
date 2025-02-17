import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { PageContainer } from "@/components/layouts/PageContainer";
import { PageHeader } from "@/components/match/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { Navigation } from "@/components/Navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Star } from "lucide-react";

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
}

export default function Tournaments() {
  const queryClient = useQueryClient();

  const { data: tournaments, isLoading } = useQuery({
    queryKey: ['tournaments'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('view_tournaments');
      if (error) throw error;
      
      if (!data || !Array.isArray(data)) {
        return [] as Tournament[];
      }

      return data.map(item => ({
        tournament_id: item.tournament_id,
        name: item.name,
        description: item.description,
        date: item.date,
        status: item.status,
        venue_id: item.venue_id,
        recommended_mmr: item.recommended_mmr,
        interested_count: item.interested_count,
        is_user_interested: item.is_user_interested,
        tournament_photo: item.tournament_photo,
        admin_display_name: item.admin_display_name,
        admin_profile_photo: item.admin_profile_photo,
      } as Tournament));
    }
  });

  const { mutate: toggleInterest } = useMutation({
    mutationFn: async (tournamentId: string) => {
      const { data, error } = await supabase.functions.invoke('notify_tournament_interest', {
        body: { tournament_id: tournamentId }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    },
    onError: () => {
      toast.error("Failed to update interest");
    }
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

  return (
    <>
      <Navigation />
      <PageContainer>
        <div className="flex justify-between items-center mb-6">
          <PageHeader title="Tournaments" description="View upcoming tournaments" />
          <Link to="/tournament/create-tournament">
            <Button>Create Tournament</Button>
          </Link>
        </div>

        {isLoading ? (
          <div>Loading tournaments...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments?.map((tournament) => (
              <div key={tournament.tournament_id} className="relative">
                <Link to={`/tournaments/${tournament.tournament_id}`}>
                  <Card className="transition-all hover:bg-accent h-full">
                    <div className="relative h-48 w-full">
                      <img
                        src={tournament.tournament_photo || '/placeholder.svg'}
                        alt={tournament.name}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-start gap-4">
                        <span>{tournament.name}</span>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={tournament.admin_profile_photo} />
                            <AvatarFallback>
                              {tournament.admin_display_name?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground line-clamp-2">{tournament.description}</p>
                        <p className="text-sm font-medium">{formatTournamentDate(tournament.date)}</p>
                        <div className="flex justify-between items-center text-sm">
                          <span>MMR: {tournament.recommended_mmr}</span>
                          <span>{tournament.interested_count} interested</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <div className="absolute bottom-4 right-4 z-10">
                  <Button
                    variant={tournament.is_user_interested ? "secondary" : "default"}
                    size="sm"
                    className="gap-2"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleInterest(tournament.tournament_id);
                    }}
                  >
                    <Star className={tournament.is_user_interested ? "fill-current" : ""} />
                    {tournament.is_user_interested ? "Interested" : "Interest"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </PageContainer>
    </>
  );
}
