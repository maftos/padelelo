
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfileSummary } from "@/hooks/use-user-profile-summary";
import { PageContainer } from "@/components/layouts/PageContainer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, ChevronRight, Users, TrendingUp, TrendingDown, Star, UserPlus, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SuggestedFriends } from "@/components/dashboard/SuggestedFriends";
import { RecentMatches } from "@/components/RecentMatches";
import { useIsMobile } from "@/hooks/use-mobile";

interface UserProfile {
  first_name: string | null;
  last_name: string | null;
  profile_photo: string;
  current_mmr: number;
}

interface Tournament {
  tournament_id: string;
  name: string;
  start_date: string;
  status: string;
  recommended_mmr: number;
}

interface RecentMatch {
  match_id: string;
  created_at: string;
  change_type: string;
  change_amount: number;
  new_mmr: number;
  old_mmr: number;
  team1_score: number;
  team2_score: number;
  completed_by: string;
  player1_id: string;
  player1_display_name: string;
  player1_profile_photo: string;
  player2_id: string;
  player2_display_name: string;
  player2_profile_photo: string;
  player3_id: string;
  player3_display_name: string;
  player3_profile_photo: string;
  player4_id: string;
  player4_display_name: string;
  player4_profile_photo: string;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { profile: profileData } = useUserProfileSummary();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const { data: nextGame } = useQuery({
    queryKey: ['nextGame', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .rpc('get_bookings_closed', {
          p_user_id: user.id
        });
      if (error) throw error;
      
      // Type assertion for the JSON array response
      const bookings = Array.isArray(data) ? data : [];
      const upcomingBookings = bookings
        .filter((booking: any) => new Date(booking.start_time) > new Date())
        .sort((a: any, b: any) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
      
      return upcomingBookings.length > 0 ? upcomingBookings[0] : null;
    },
    enabled: !!user?.id
  });


  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-4xl">
        <div className="space-y-3 sm:space-y-6">
          {/* Profile Card - Mobile optimized */}
          <Link to="/profile" className="block">
            <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.01] group touch-manipulation">
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border-2 border-primary/20 flex-shrink-0">
                      <AvatarImage src={profileData?.profile_photo} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm sm:text-base">
                        {profileData?.first_name?.substring(0, 2)?.toUpperCase() || 'NP'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-lg sm:text-xl truncate">{profileData?.first_name || 'User'}</CardTitle>
                        <span className="text-sm text-muted-foreground">#{profileData?.rank || 'Unranked'}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 bg-background/60 backdrop-blur rounded-lg px-2 sm:px-3 py-1 border w-fit">
                        <div className="text-xs sm:text-sm">
                          <span className="font-bold text-foreground">{profileData?.current_mmr || 0}</span>
                          <span className="text-muted-foreground ml-1">MMR</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
              </CardHeader>
            </Card>
          </Link>

          {/* Content Grid - Stack on mobile, side by side on larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
            {/* Next Game */}
            <Card>
              <CardHeader className="pb-3 space-y-0">
                <div className="flex items-center gap-2 min-w-0">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
                  <CardTitle className="text-base sm:text-lg truncate">Next Game</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                 {nextGame ? (
                  <div className="p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors border border-accent/40">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <div className="flex flex-col">
                            <span className="font-medium text-sm leading-tight">
                              {new Date((nextGame as any).start_time).toLocaleDateString('en-GB', { 
                                weekday: 'short', 
                                day: 'numeric', 
                                month: 'short' 
                              })}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date((nextGame as any).start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-muted-foreground leading-tight truncate">{(nextGame as any).venue_name}</span>
                        </div>
                      </div>
                      
                      {/* Players - Simplified for mobile */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>{((nextGame as any).participants || []).length} players</span>
                        </div>
                        
                        <div className="flex items-center -space-x-1">
                          {((nextGame as any).participants || []).slice(0, 4).map((participant: any) => (
                            <Avatar key={participant.player_id} className="h-6 w-6 border-2 border-background">
                              <AvatarImage src={participant.profile_photo} />
                              <AvatarFallback className="text-xs">
                                {`${participant.first_name[0] || ''}${participant.last_name[0] || ''}`.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {((nextGame as any).participants || []).length > 4 && (
                            <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                              +{((nextGame as any).participants || []).length - 4}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground text-xs sm:text-sm">No upcoming games</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Suggested Friends */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
                <div className="flex items-center gap-2 min-w-0">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 flex-shrink-0" />
                  <CardTitle className="text-base sm:text-lg truncate">Suggested Friends</CardTitle>
                </div>
                <Link to="/friends">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3 flex-shrink-0">
                    Manage
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="pt-0">
                <SuggestedFriends userId={user?.id} />
              </CardContent>
            </Card>
          </div>

          {/* Recent Matches - Full Width, Mobile optimized */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
              <div className="flex items-center gap-2 min-w-0">
                <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 flex-shrink-0" />
                <CardTitle className="text-base sm:text-lg truncate">Recent Matches</CardTitle>
              </div>
              <Link to="/matches">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3 flex-shrink-0">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-0">
              <RecentMatches />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
