import { Link } from "react-router-dom";
import { PageContainer } from "@/components/layouts/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Navigation } from "@/components/Navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Check, MapPin, Users, Calendar, Plus, ArrowUpDown, Bell } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { TournamentStatusBadge } from "@/components/tournament/TournamentStatusBadge";
import { useState } from "react";

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
  const [sortBy, setSortBy] = useState("newest");

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "soonest", label: "Soonest" },
    { value: "popular", label: "Most Popular" }
  ];

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
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tournaments</h1>
            <p className="text-muted-foreground">Discover and join upcoming tournaments</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              Tournament Alerts
            </Button>
            <Link to="/tournament/create-tournament">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Tournament
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter and Sort Section */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">All Tournaments</Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-accent">This Week</Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-accent">Next Month</Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-accent">My Level</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-1">
              {sortOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={sortBy === option.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSortBy(option.value)}
                  className="text-xs"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Tournaments Grid - Single Column Layout */}
        <div className="grid gap-4">
          {tournaments?.map((tournament) => {
            const primaryAdmin = tournament.admins?.[0] || {
              user_id: '',
              profile_photo: null,
              display_name: 'TO'
            };
            
            return (
              <Card key={tournament.tournament_id} className="hover:shadow-md transition-shadow">
                <div className="relative h-48 w-full">
                  <img
                    src={tournament.main_photo || '/placeholder.svg'}
                    alt={tournament.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  <div className="absolute top-3 left-3">
                    <TournamentStatusBadge status={tournament.status} />
                  </div>
                </div>
                
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <Link to={`/tournaments/${tournament.tournament_id}`}>
                        <CardTitle className="text-lg hover:text-primary transition-colors cursor-pointer line-clamp-2">
                          {tournament.name}
                        </CardTitle>
                      </Link>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={primaryAdmin.profile_photo || undefined} />
                          <AvatarFallback className="text-xs">
                            {primaryAdmin.display_name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>TO: {primaryAdmin.display_name}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0 space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {tournament.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">
                        {formatTournamentDate(tournament.start_date, tournament.end_date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>
                        <span className="font-medium">{tournament.recommended_mmr}</span>
                        <span className="text-muted-foreground ml-1">MMR</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-green-500" />
                      <span>
                        <span className="font-medium">{tournament.responded_count}</span>
                        <span className="text-muted-foreground ml-1">interested</span>
                      </span>
                    </div>
                  </div>

                  {/* Interest Button */}
                  <div className="pt-2">
                    <Button
                      variant={tournament.user_interest === 'INTERESTED' ? "secondary" : "default"}
                      size="sm"
                      className="w-full gap-2"
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
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {tournaments && tournaments.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tournaments yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to create a tournament!</p>
            <Link to="/tournament/create-tournament">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Tournament
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
