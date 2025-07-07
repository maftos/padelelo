import { useParams, useNavigate } from "react-router-dom";
import { PageContainer } from "@/components/layouts/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Navigation } from "@/components/Navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Users, ChevronDown, ChevronUp, Settings, Star, Pencil, Check, ChevronLeft } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { TournamentInviteDialog } from "./TournamentInviteDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { TournamentStatusBadge } from "@/components/tournament/TournamentStatusBadge";
import { BracketTypeDisplay } from "@/components/tournament/BracketTypeDisplay";

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
  admin_first_name: string;
  admin_last_name: string;
  venue_name: string;
  venue_location: [number, number];
  total_participants: number;
  max_participants: number;
  confirmed_participants: number;
  bracket_type: string;
  format: {
    name: string;
    description: string;
    rules_image: string;
  };
  admins: Array<{
    user_id: string;
    profile_photo: string;
    first_name: string;
    last_name: string;
  }>;
  mutual_friends_interested: Array<{
    friend_id: string;
    profile_photo: string;
    first_name: string;
    last_name: string;
  }>;
  mutual_friends_count: number;
  interested_users: Array<{
    user_id: string;
    status: string;
    profile_photo: string;
    first_name: string;
    last_name: string;
  }>;
  approved_users: Array<{
    user_id: string;
    status: string;
    profile_photo: string;
    first_name: string;
    last_name: string;
  }>;
}

export default function TournamentDetail() {
  const { tournamentId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const { data: tournament, isLoading, error, refetch } = useQuery({
    queryKey: ['tournament', tournamentId, user?.id],
    queryFn: async () => {
      const { data, error } = await (supabase.rpc as any)('view_tournament', {
        p_tournament_id: tournamentId,
        p_user_a_id: user?.id || null
      });

      if (error) {
        console.error('Error fetching tournament:', error);
        throw error;
      }

      return data as Tournament;
    }
  });

  const formatTournamentDate = (startDate: string, endDate: string | null) => {
    try {
      if (!startDate) return "TBD";
      
      const formattedStartDate = format(new Date(startDate), 'EEE, MMM d, h:mm a');
      
      if (endDate) {
        const formattedEndDate = format(new Date(endDate), 'h:mm a');
        return `${formattedStartDate} - ${formattedEndDate}`;
      }
      
      return formattedStartDate;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const handleInterestToggle = async () => {
    try {
      if (!user || !tournament) {
        if (!user) {
          toast.error('Please log in to show interest in tournaments');
        }
        return;
      }

      const newStatus = tournament.user_interest === 'INTERESTED' ? 'NOT_INTERESTED' : 'INTERESTED';

      const { error } = await supabase.rpc('notify_interest_tournament', {
        p_tournament_id: tournament.tournament_id,
        p_player1_id: user.id,
        p_response_status: newStatus
      });

      if (error) {
        console.error('Error toggling interest:', error);
        toast.error('Failed to update interest status');
        return;
      }

      refetch();
      toast.success(`Successfully ${newStatus === 'INTERESTED' ? 'shown interest in' : 'removed interest from'} tournament`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred');
    }
  };

  const handleApplyToTournament = async () => {
    try {
      if (!user) {
        toast.error('Please log in to apply for tournaments');
        return;
      }

      const { error } = await supabase.rpc('apply_to_tournament', {
        p_tournament_id: tournament?.tournament_id,
        p_player1_id: user.id,
        p_response_status: 'APPLIED'
      });

      if (error) {
        console.error('Error applying to tournament:', error);
        toast.error(error.message);
        return;
      }

      toast.success('Successfully applied to tournament');
      refetch();
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while applying to the tournament');
    }
  };

  const handleNavigateToEdit = () => {
    navigate(`/tournaments/${tournament.tournament_id}/edit`);
  };

  const isAdmin = tournament?.admins?.some(admin => admin.user_id === user?.id) || false;

  if (isLoading) {
    return (
      <>
        <Navigation />
        <PageContainer>
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-pulse">Loading tournament details...</div>
          </div>
        </PageContainer>
      </>
    );
  }

  if (error || !tournament) {
    return (
      <>
        <Navigation />
        <PageContainer>
          <div className="text-center text-destructive">
            Error loading tournament details. Please try again later.
          </div>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <PageContainer className="pb-24 md:pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/tournaments')}
            className="mb-6"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Tournaments
          </Button>

          <div className="relative h-64 -mx-4 sm:-mx-6 mb-6">
            <img
              src={tournament.main_photo}
              alt={tournament.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-background/0" />
            {isAdmin && (
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-background"
                  onClick={handleNavigateToEdit}
                >
                  <Pencil className="h-4 w-4 text-primary mr-2" />
                  Edit Details
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setInviteDialogOpen(true)}
                >
                  Invite
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <span className="text-lg text-primary">{formatTournamentDate(tournament.start_date, tournament.end_date)}</span>
              
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{tournament.name}</h1>
                <TournamentStatusBadge status={tournament.status} />
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span className="text-lg">{tournament.venue_name}</span>
              </div>

              <div className="flex flex-wrap gap-4">
                {tournament.admins?.map((admin) => (
                  <div key={admin.user_id} className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={admin.profile_photo} />
                      <AvatarFallback>
                        {`${admin.first_name || ''} ${admin.last_name || ''}`.trim().substring(0, 2).toUpperCase() || 'TO'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-muted-foreground">
                      {tournament.admins.indexOf(admin) === 0 ? 'Organized by ' : 'Co-organized by '}{`${admin.first_name || ''} ${admin.last_name || ''}`.trim() || 'Tournament Organizer'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tournament Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className={`${!isDescriptionExpanded ? 'line-clamp-5' : ''}`}>
                        {tournament.description?.split('\n').map((paragraph, index) => (
                          <p key={index} className="text-muted-foreground mb-2">{paragraph}</p>
                        ))}
                      </div>
                      {tournament.description && tournament.description.length > 100 && (
                        <button
                          onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                          className="inline-flex items-center gap-1 text-secondary-foreground hover:underline mt-1"
                        >
                          {isDescriptionExpanded ? (
                            <>
                              See less
                              <ChevronUp className="h-4 w-4" />
                            </>
                          ) : (
                            <>
                              See more
                              <ChevronDown className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-3">                    
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-muted-foreground" />
                        <span>Recommended Level: {tournament.recommended_mmr}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-muted-foreground" />
                          <span>Your Friends</span>
                        </div>
                        <div className="flex -space-x-2 overflow-hidden pl-7">
                          {tournament.mutual_friends_interested?.map((friend) => (
                            <Avatar key={friend.friend_id} className="h-8 w-8 border-2 border-background">
                              <AvatarImage src={friend.profile_photo} />
                              <AvatarFallback>{`${friend.first_name || ''} ${friend.last_name || ''}`.trim().substring(0, 2).toUpperCase() || 'FR'}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Participants</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="interested" className="w-full">
                    <TabsList className="w-full">
                      <TabsTrigger value="interested" className="flex-1">
                        Interested ({tournament.interested_users?.length || 0})
                      </TabsTrigger>
                      <TabsTrigger value="approved" className="flex-1">
                        Approved ({tournament.approved_users?.length || 0})
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="interested" className="space-y-4">
                      {tournament.interested_users?.map(user => (
                        <div key={user.user_id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={user.profile_photo} />
                            <AvatarFallback>{`${user.first_name || ''} ${user.last_name || ''}`.trim().substring(0, 2).toUpperCase() || 'US'}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User'}</p>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="approved" className="space-y-4">
                      {tournament.approved_users?.map(user => (
                        <div key={user.user_id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={user.profile_photo} />
                            <AvatarFallback>{`${user.first_name || ''} ${user.last_name || ''}`.trim().substring(0, 2).toUpperCase() || 'US'}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User'}</p>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <BracketTypeDisplay 
              bracketType={tournament.bracket_type} 
              maxPlayers={tournament.max_participants || 8}
            />
          </div>

          {isMobile && (
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border flex gap-2">
              <Button 
                className="flex-1"
                variant={tournament.user_interest === 'INTERESTED' ? "secondary" : "outline"}
                onClick={handleInterestToggle}
              >
                {tournament.user_interest === 'INTERESTED' ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Interested
                  </>
                ) : (
                  <>
                    <Star className="h-4 w-4 mr-2" />
                    Interested
                  </>
                )}
              </Button>
              <Button 
                className="flex-1"
                variant="default"
                onClick={handleApplyToTournament}
                disabled={!user}
              >
                Register
              </Button>
            </div>
          )}
        </div>
      </PageContainer>
      <TournamentInviteDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        tournamentId={tournament.tournament_id}
        tournamentName={tournament.name}
      />
    </>
  );
}
