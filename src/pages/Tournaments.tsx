import { Link } from "react-router-dom";
import { PageContainer } from "@/components/layouts/PageContainer";
import { PageHeader } from "@/components/match/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Navigation } from "@/components/Navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Tournament {
  tournament_id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string | null;
  status: string;
  venue_id: string;
  recommended_mmr: number;
  interested_count: number;
  user_interest: 'INTERESTED' | 'NOT_INTERESTED' | null;
  main_photo: string;
  admin_display_name: string;
  admin_profile_photo: string;
}

export default function Tournaments() {
  const { user } = useAuth();

  const { data: tournaments, isLoading, error } = useQuery({
    queryKey: ['tournaments', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('view_tournaments', {
        p_user_a_id: user?.id || null
      });

      if (error) {
        console.error('Error fetching tournaments:', error);
        throw error;
      }

      // Type assertion to handle the conversion
      return data as unknown as Tournament[];
    }
  });

  const formatTournamentDate = (startDate: string, endDate: string | null) => {
    try {
      const formattedStartDate = format(new Date(startDate), 'PPP');
      
      if (endDate) {
        const formattedEndDate = format(new Date(endDate), 'PPP');
        return `${formattedStartDate} - ${formattedEndDate}`;
      }
      
      return formattedStartDate;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const handleInterestToggle = async (tournamentId: string, currentInterest: 'INTERESTED' | 'NOT_INTERESTED' | null) => {
    try {
      if (!user) {
        return;
      }

      const { error } = await supabase.rpc('notify_tournament_interest', {
        p_tournament_id: tournamentId,
        p_user_id: user.id
      });

      if (error) {
        console.error('Error toggling interest:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error toggling interest:', error);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navigation />
        <PageContainer>
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-pulse">Loading tournaments...</div>
          </div>
        </PageContainer>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navigation />
        <PageContainer>
          <div className="text-center text-destructive">
            Error loading tournaments. Please try again later.
          </div>
        </PageContainer>
      </>
    );
  }

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments?.map((tournament) => (
            <div key={tournament.tournament_id} className="relative">
              <Link to={`/tournaments/${tournament.tournament_id}`}>
                <Card className="transition-all hover:bg-accent h-full">
                  <div className="relative h-48 w-full">
                    <img
                      src={tournament.main_photo || '/placeholder.svg'}
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
                      <p className="text-sm font-medium">
                        {formatTournamentDate(tournament.start_date, tournament.end_date)}
                      </p>
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
                  variant={tournament.user_interest === 'INTERESTED' ? "secondary" : "default"}
                  size="sm"
                  className="gap-2"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleInterestToggle(tournament.tournament_id, tournament.user_interest);
                  }}
                >
                  <Star className={tournament.user_interest === 'INTERESTED' ? "fill-current" : ""} />
                  Interested
                </Button>
              </div>
            </div>
          ))}
        </div>
      </PageContainer>
    </>
  );
}
