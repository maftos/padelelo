
import { Link } from "react-router-dom";
import { PageContainer } from "@/components/layouts/PageContainer";
import { PageHeader } from "@/components/match/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Navigation } from "@/components/Navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Check, MapPin, Users, Calendar } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { TournamentStatusBadge } from "@/components/tournament/TournamentStatusBadge";

interface TournamentAdmin {
  user_id: string;
  profile_photo: string | null;
  display_name: string;
}

interface Tournament {
  tournament_id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string | null;
  status: string;
  venue_id: string;
  recommended_mmr: number;
  responded_count: number;
  user_interest: 'INTERESTED' | 'NOT_INTERESTED' | null;
  main_photo: string | null;
  admins: TournamentAdmin[];
}

export default function Tournaments() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: tournaments, isLoading, error } = useQuery({
    queryKey: ['tournaments', user?.id],
    queryFn: async () => {
      console.log('Fetching tournaments for user:', user?.id);
      
      const { data: tournamentData, error: tournamentError } = await supabase
        .rpc('view_tournaments', {
          p_user_a_id: user?.id || null
        });

      if (tournamentError) {
        console.error('Error fetching tournaments:', tournamentError);
        throw tournamentError;
      }

      if (!tournamentData) {
        return [] as Tournament[];
      }

      const typedData = (tournamentData as unknown) as Tournament[];
      console.log('Tournaments data received:', typedData);
      return typedData;
    },
    enabled: true,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const toggleInterestMutation = useMutation({
    mutationFn: async ({ tournamentId, newStatus }: { tournamentId: string, newStatus: 'INTERESTED' | 'NOT_INTERESTED' }) => {
      if (!user) throw new Error('User not authenticated');

      const { error: toggleError } = await supabase.rpc('notify_interest_tournament', {
        p_tournament_id: tournamentId,
        p_player1_id: user.id,
        p_response_status: newStatus
      });

      if (toggleError) throw toggleError;
      return { tournamentId, newStatus };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['tournaments', user?.id], (oldData: Tournament[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map(tournament => {
          if (tournament.tournament_id === data.tournamentId) {
            return {
              ...tournament,
              user_interest: data.newStatus,
              responded_count: data.newStatus === 'INTERESTED' 
                ? tournament.responded_count + 1 
                : tournament.responded_count - 1
            };
          }
          return tournament;
        });
      });

      toast({
        title: "Success",
        description: `You are ${data.newStatus === 'INTERESTED' ? 'now' : 'no longer'} interested in this tournament.`,
      });
    },
    onError: (error) => {
      console.error('Error toggling interest:', error);
      toast({
        title: "Error",
        description: "Failed to update your interest. Please try again.",
        variant: "destructive",
      });
    }
  });

  const formatTournamentDate = (startDate: string, endDate: string | null) => {
    try {
      const start = new Date(startDate);
      const formattedStartDate = format(start, 'MMM dd, yyyy');
      
      if (endDate) {
        const end = new Date(endDate);
        const formattedEndDate = format(end, 'MMM dd, yyyy');
        return `${formattedStartDate} - ${formattedEndDate}`;
      }
      
      return formattedStartDate;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const handleInterestToggle = (tournamentId: string, currentInterest: 'INTERESTED' | 'NOT_INTERESTED' | null) => {
    const newStatus = currentInterest === 'INTERESTED' ? 'NOT_INTERESTED' : 'INTERESTED';
    toggleInterestMutation.mutate({ tournamentId, newStatus });
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {tournaments?.map((tournament) => {
            const primaryAdmin = tournament.admins?.[0] || {
              user_id: '',
              profile_photo: null,
              display_name: 'TO'
            };
            
            return (
              <div key={tournament.tournament_id} className="relative">
                <Link to={`/tournaments/${tournament.tournament_id}`}>
                  <Card className="transition-all hover:bg-accent h-full overflow-hidden">
                    <div className="relative h-64 w-full">
                      <img
                        src={tournament.main_photo || '/placeholder.svg'}
                        alt={tournament.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <TournamentStatusBadge status={tournament.status} />
                      </div>
                    </div>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex justify-between items-start gap-4 text-xl">
                        <span className="line-clamp-2">{tournament.name}</span>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-shrink-0">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={primaryAdmin.profile_photo || undefined} />
                            <AvatarFallback className="text-xs">
                              {primaryAdmin.display_name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        <p className="text-muted-foreground line-clamp-3 text-base leading-relaxed">
                          {tournament.description}
                        </p>
                        
                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex items-center gap-3 text-sm">
                            <Calendar className="h-4 w-4 text-blue-500 flex-shrink-0" />
                            <span className="font-medium">
                              {formatTournamentDate(tournament.start_date, tournament.end_date)}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-sm">
                              <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                              <span>
                                <span className="font-medium">{tournament.recommended_mmr}</span>
                                <span className="text-muted-foreground ml-1">MMR</span>
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-3 text-sm">
                              <Users className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span>
                                <span className="font-medium">{tournament.responded_count}</span>
                                <span className="text-muted-foreground ml-1">interested</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="text-xs">Tournament Organizer:</span>
                          <span className="font-medium text-foreground">{primaryAdmin.display_name}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <div className="absolute bottom-6 right-6 z-10">
                  <Button
                    variant={tournament.user_interest === 'INTERESTED' ? "secondary" : "default"}
                    size="sm"
                    className="gap-2 shadow-lg"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleInterestToggle(tournament.tournament_id, tournament.user_interest);
                    }}
                    disabled={toggleInterestMutation.isPending}
                  >
                    {tournament.user_interest === 'INTERESTED' ? <Check className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                    {toggleInterestMutation.isPending ? 'Updating...' : 'Interested'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </PageContainer>
    </>
  );
}
