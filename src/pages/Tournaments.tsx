
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { PageContainer } from "@/components/layouts/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Check, MapPin, Users, Calendar, Plus, ArrowUpDown, Bell } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { TournamentStatusBadge } from "@/components/tournament/TournamentStatusBadge";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

import { SocialShare } from "@/components/seo/SocialShare";

interface TournamentAdmin {
  user_id: string;
  profile_photo: string | null;
  first_name: string;
  last_name: string;
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
  const isMobile = useIsMobile();

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

      toast.success(`You are ${data.newStatus === 'INTERESTED' ? 'now' : 'no longer'} interested in this tournament.`);
    },
    onError: (error) => {
      console.error('Error toggling interest:', error);
      toast.error("Failed to update your interest. Please try again.");
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
      <PageContainer>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-pulse">Loading tournaments...</div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="text-center text-destructive">
          Error loading tournaments. Please try again later.
        </div>
      </PageContainer>
    );
  }

  const tournamentsCount = tournaments?.length || 0;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    "name": "PadelELO Tournaments",
    "description": "Discover and join padel tournaments in Mauritius",
    "url": "https://padel-elo.com/tournaments",
    "sport": "Padel",
    "location": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "MU",
        "addressLocality": "Mauritius"
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Padel Tournaments in Mauritius - Join & Compete | PadelELO</title>
        <meta 
          name="description" 
          content={`Discover ${tournamentsCount} upcoming padel tournaments in Mauritius. Join competitive events, meet players, and showcase your skills in the local padel community.`}
        />
        <meta name="keywords" content="padel tournaments mauritius, padel competitions, padel events mauritius, tournament registration" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Padel Tournaments in Mauritius - PadelELO" />
        <meta property="og:description" content={`Discover ${tournamentsCount} upcoming padel tournaments in Mauritius. Join competitive events and meet fellow players.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://padel-elo.com/tournaments" />
        <meta property="og:image" content="https://padel-elo.com/lovable-uploads/14a55cb7-6df6-47ec-af26-fab66670c638.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Padel Tournaments in Mauritius" />
        <meta name="twitter:description" content="Join competitive padel tournaments in Mauritius" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        
        <link rel="canonical" href="https://padel-elo.com/tournaments" />
      </Helmet>
      
      <div className="w-full min-h-screen">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-6 max-w-full sm:max-w-4xl">
          
          {/* Header - Mobile optimized */}
          <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
              <div className="min-w-0 flex-1 w-full">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">Tournaments</h1>
                <p className="text-sm sm:text-base text-muted-foreground">Discover and join upcoming tournaments</p>
              </div>
              
              {/* Action buttons - Stack on mobile, side by side on larger screens */}
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-center gap-2 text-sm h-9 sm:h-10 px-3 w-full sm:w-auto"
                  >
                    <Bell className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{isMobile ? "Alerts" : "Tournament Alerts"}</span>
                  </Button>
                  <SocialShare 
                    title="Discover Padel Tournaments in Mauritius"
                    description={`Join ${tournamentsCount} upcoming tournaments in the Mauritius padel community`}
                    hashtags={["padel", "mauritius", "tournaments"]}
                    showZapierIntegration={true}
                  />
                <Link to="/tournament/create-tournament" className="w-full sm:w-auto">
                  <Button className="flex items-center justify-center gap-2 text-sm h-9 sm:h-10 w-full px-3">
                    <Plus className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Create Tournament</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Sort Section - Mobile optimized */}
          <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
            {/* Sort options - Mobile friendly */}
            <div className="flex items-center justify-between gap-2 min-w-0">
              <div className="flex items-center gap-2 text-muted-foreground min-w-0 shrink">
                <ArrowUpDown className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm font-medium">Sort by:</span>
              </div>
              <div className="flex gap-1 shrink-0">
                {sortOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={sortBy === option.value ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSortBy(option.value)}
                    className="text-xs h-8 px-2 sm:px-3 whitespace-nowrap"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Tournaments Grid - Single column with mobile-optimized cards */}
          <div className="space-y-3 sm:space-y-4 w-full">
            {tournaments?.map((tournament) => {
              const primaryAdmin = tournament.admins?.[0] || {
                user_id: '',
                profile_photo: null,
                first_name: 'Tournament',
                last_name: 'Organizer'
              };
              
              return (
                <Card key={tournament.tournament_id} className="hover:shadow-md transition-shadow w-full overflow-hidden">
                  <div className="relative h-32 sm:h-48 w-full">
                    <img
                      src={tournament.main_photo || '/placeholder.svg'}
                      alt={tournament.name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                      <TournamentStatusBadge status={tournament.status} />
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6">
                    <div className="flex justify-between items-start gap-2 sm:gap-4 min-w-0">
                      <div className="flex-1 min-w-0">
                        <Link to={`/tournaments/${tournament.tournament_id}`}>
                          <CardTitle className="text-base sm:text-lg hover:text-primary transition-colors cursor-pointer line-clamp-2 leading-tight break-words">
                            {tournament.name}
                          </CardTitle>
                        </Link>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2 min-w-0">
                          <Avatar className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0">
                            <AvatarImage src={primaryAdmin.profile_photo || undefined} />
                            <AvatarFallback className="text-xs">
                              {`${primaryAdmin.first_name || ''} ${primaryAdmin.last_name || ''}`.trim().substring(0, 2).toUpperCase() || 'TO'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate">TO: {`${primaryAdmin.first_name || ''} ${primaryAdmin.last_name || ''}`.trim() || 'Tournament Organizer'}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 space-y-3 sm:space-y-4 px-3 sm:px-6">
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed break-words">
                      {tournament.description}
                    </p>
                    
                    {/* Tournament info - Stack on mobile */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1 min-w-0">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
                        <span className="font-medium truncate">
                          {formatTournamentDate(tournament.start_date, tournament.end_date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 flex-shrink-0" />
                          <span>
                            <span className="font-medium">{tournament.recommended_mmr}</span>
                            <span className="text-muted-foreground ml-1">MMR</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                          <span>
                            <span className="font-medium">{tournament.responded_count}</span>
                            <span className="text-muted-foreground ml-1">interested</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Interest Button - Full width on mobile */}
                    <div className="pt-2">
                      <Button
                        variant={tournament.user_interest === 'INTERESTED' ? "secondary" : "default"}
                        size="sm"
                        className="w-full gap-2 h-9 sm:h-10 touch-manipulation"
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

          {/* Empty State - Mobile optimized */}
          {tournaments && tournaments.length === 0 && (
            <div className="text-center py-8 sm:py-12 px-4">
              <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold mb-2">No tournaments yet</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">Be the first to create a tournament!</p>
              <Link to="/tournament/create-tournament">
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Tournament
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
