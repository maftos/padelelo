
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer } from "@/components/layouts/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, ChevronRight, Users, TrendingUp, TrendingDown, Star, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SuggestedFriends } from "@/components/dashboard/SuggestedFriends";
import { useIsMobile } from "@/hooks/use-mobile";

interface UserProfile {
  display_name: string;
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

  // Mock data for ranking - will be replaced with real data later
  const ranking = 45;
  const rankingChange = -3;

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const { data: profileData } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase.rpc('get_user_profile', {
        user_a_id: user.id
      });
      if (error) throw error;
      return data[0] as UserProfile;
    },
    enabled: !!user?.id
  });

  const { data: upcomingTournaments } = useQuery({
    queryKey: ['upcomingTournaments', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .rpc('view_tournaments', {
          p_user_a_id: user.id
        });
      if (error) throw error;
      return ((data as unknown) as Tournament[])
        .filter(t => t.status === 'UPCOMING')
        .slice(0, 3);
    },
    enabled: !!user?.id
  });

  const { data: recentMatches } = useQuery({
    queryKey: ['recentMatches', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase.rpc('get_my_completed_matches', {
        user_a_id: user.id
      });
      if (error) throw error;
      return (data as RecentMatch[]).slice(0, 3);
    },
    enabled: !!user?.id
  });

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-4xl">
        <div className="space-y-4 sm:space-y-6">
          {/* Profile Card - Mobile optimized */}
          <Link to="/profile" className="block">
            <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.01] group touch-manipulation">
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border-2 border-primary/20 flex-shrink-0">
                      <AvatarImage src={profileData?.profile_photo} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm sm:text-base">
                        {profileData?.display_name?.substring(0, 2) || 'NP'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <CardTitle className="text-lg sm:text-xl truncate">{profileData?.display_name}</CardTitle>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-sm text-muted-foreground">#{ranking}</span>
                          <Badge 
                            variant="secondary" 
                            className={`${rankingChange < 0 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"} flex items-center gap-1 text-xs px-1 py-0 h-4`}
                          >
                            {rankingChange < 0 ? (
                              <TrendingDown className="h-2 w-2" />
                            ) : (
                              <TrendingUp className="h-2 w-2" />
                            )}
                            {rankingChange > 0 ? '+' : ''}{rankingChange}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription className="mt-1 text-xs sm:text-sm">View and edit your profile</CardDescription>
                      <div className="flex items-center gap-2 mt-2 bg-background/60 backdrop-blur rounded-lg px-2 sm:px-3 py-1 border w-fit">
                        <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 flex-shrink-0" />
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Your Tournaments */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
                <div className="flex items-center gap-2 min-w-0">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
                  <CardTitle className="text-base sm:text-lg truncate">Your Tournaments</CardTitle>
                </div>
                <Link to="/tournaments">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3 flex-shrink-0">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                {upcomingTournaments && upcomingTournaments.length > 0 ? (
                  upcomingTournaments.map((tournament) => (
                    <Link 
                      key={tournament.tournament_id} 
                      to={`/tournaments/${tournament.tournament_id}`}
                      className="block p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors border border-accent/40 touch-manipulation"
                    >
                      <div className="flex justify-between items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground text-sm sm:text-base line-clamp-1">{tournament.name}</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {new Date(tournament.start_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="text-xs sm:text-sm font-medium">{tournament.recommended_mmr}</span>
                          </div>
                          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground mt-1 ml-auto" />
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground text-xs sm:text-sm">No upcoming tournaments</p>
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
              <CardContent>
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
            <CardContent className="space-y-3 sm:space-y-4">
              {recentMatches && recentMatches.length > 0 ? (
                recentMatches.map((match) => (
                  <div key={match.match_id} className="p-3 sm:p-4 rounded-lg bg-accent/30 border border-accent/40">
                    <div className="flex justify-between items-start mb-2 sm:mb-3 gap-3">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          match.change_type === 'WIN' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {match.change_type === 'WIN' ? (
                            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                          ) : (
                            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 rotate-180" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground text-sm sm:text-base">
                            {match.change_type === 'WIN' ? 'Victory' : 'Defeat'}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {new Date(match.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                        match.change_type === 'WIN' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {match.change_type === 'WIN' ? '+' : '-'}{match.change_amount} MMR
                      </div>
                    </div>
                    
                    {/* Match Details with Player Photos - Mobile optimized */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 p-2 sm:p-3 bg-background/60 rounded-lg border">
                      {/* Team 1 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 sm:mb-2">
                          <Avatar className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0">
                            <AvatarImage src={match.player1_profile_photo} />
                            <AvatarFallback className="text-xs">
                              {match.player1_display_name?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs sm:text-sm font-medium truncate">{match.player1_display_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0">
                            <AvatarImage src={match.player2_profile_photo} />
                            <AvatarFallback className="text-xs">
                              {match.player2_display_name?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs sm:text-sm font-medium truncate">{match.player2_display_name}</span>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="flex items-center justify-center gap-2 px-2 sm:px-3 py-1 rounded-lg bg-background border flex-shrink-0">
                        <span className="text-base sm:text-lg font-bold">{match.team1_score}</span>
                        <span className="text-muted-foreground text-sm">-</span>
                        <span className="text-base sm:text-lg font-bold">{match.team2_score}</span>
                      </div>

                      {/* Team 2 */}
                      <div className="flex-1 min-w-0 text-left sm:text-right">
                        <div className="flex items-center gap-2 mb-1 sm:mb-2 sm:justify-end">
                          <span className="text-xs sm:text-sm font-medium truncate order-2 sm:order-1">{match.player3_display_name}</span>
                          <Avatar className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 order-1 sm:order-2">
                            <AvatarImage src={match.player3_profile_photo} />
                            <AvatarFallback className="text-xs">
                              {match.player3_display_name?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex items-center gap-2 sm:justify-end">
                          <span className="text-xs sm:text-sm font-medium truncate order-2 sm:order-1">{match.player4_display_name}</span>
                          <Avatar className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 order-1 sm:order-2">
                            <AvatarImage src={match.player4_profile_photo} />
                            <AvatarFallback className="text-xs">
                              {match.player4_display_name?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-xs sm:text-sm">No recent matches</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
