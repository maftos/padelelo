
import { useParams } from "react-router-dom";
import { PageContainer } from "@/components/layouts/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, addHours } from "date-fns";
import { Navigation } from "@/components/Navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Trophy, Users, ChevronDown, ChevronUp } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

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
    display_name: string;
  }>;
  mutual_friends_interested: Array<{
    friend_id: string;
    profile_photo: string;
    display_name: string;
  }>;
  mutual_friends_count: number;
  interested_users: Array<{
    user_id: string;
    status: string;
    profile_photo: string;
    display_name: string;
  }>;
  approved_users: Array<{
    user_id: string;
    status: string;
    profile_photo: string;
    display_name: string;
  }>;
}

export default function TournamentDetail() {
  const { tournamentId } = useParams();
  const { user } = useAuth();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

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
      
      const utcStart = addHours(new Date(startDate), 4);
      const formattedStartDate = format(utcStart, 'EEE, MMM d, h:mm a');
      
      if (endDate) {
        const utcEnd = addHours(new Date(endDate), 4);
        const formattedEndDate = format(utcEnd, 'EEE, MMM d, h:mm a');
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

      const { error } = await (supabase.rpc as any)('notify_tournament_interest', {
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
      <PageContainer>
        <div className="relative h-64 -mx-4 sm:-mx-6 mb-6">
          <img
            src={tournament.main_photo}
            alt={tournament.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-background/0" />
          <Button 
            className="absolute top-4 right-4 px-6"
            size="sm"
          >
            Invite Friends
          </Button>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{tournament.name}</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span className="text-lg">{tournament.venue_name}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="text-lg">{formatTournamentDate(tournament.start_date, tournament.end_date)}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {tournament.admins?.map((admin) => (
                <div key={admin.user_id} className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={admin.profile_photo} />
                    <AvatarFallback>
                      {admin.display_name?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-muted-foreground">
                    {tournament.admins.indexOf(admin) === 0 ? 'Organized by ' : 'Co-organized by '}{admin.display_name}
                  </span>
                </div>
              ))}
              <Button 
                variant={tournament.user_interest === 'INTERESTED' ? "secondary" : "default"}
                onClick={handleInterestToggle}
                className="shrink-0"
              >
                {tournament.user_interest === 'INTERESTED' ? 'Not Interested' : 'I\'m Interested'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tournament Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className={`relative ${!isDescriptionExpanded ? 'max-h-[120px] overflow-hidden' : ''}`}>
                    {tournament.description?.split('\n').map((paragraph, index) => (
                      <p key={index} className="text-muted-foreground mb-2">{paragraph}</p>
                    ))}
                    {!isDescriptionExpanded && tournament.description && (
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent" />
                    )}
                  </div>
                  {tournament.description && tournament.description.length > 100 && (
                    <Button
                      variant="ghost"
                      className="w-full flex items-center gap-2"
                      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    >
                      {isDescriptionExpanded ? (
                        <>
                          Read Less
                          <ChevronUp className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Read More
                          <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                  
                  <div className="space-y-3">                    
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-muted-foreground" />
                      <span>Recommended Level: {tournament.recommended_mmr}</span>
                    </div>

                    <Card className="bg-muted/50">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">Bracket Type: {tournament.bracket_type}</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <span>{tournament.interested_count} responded</span>
                      </div>
                      <div className="flex -space-x-2 overflow-hidden pl-7">
                        {tournament.mutual_friends_interested?.map((friend) => (
                          <Avatar key={friend.friend_id} className="h-8 w-8 border-2 border-background">
                            <AvatarImage src={friend.profile_photo} />
                            <AvatarFallback>{friend.display_name.substring(0, 2).toUpperCase()}</AvatarFallback>
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
                          <AvatarFallback>{user.display_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{user.display_name}</p>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="approved" className="space-y-4">
                    {tournament.approved_users?.map(user => (
                      <div key={user.user_id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.profile_photo} />
                          <AvatarFallback>{user.display_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{user.display_name}</p>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
