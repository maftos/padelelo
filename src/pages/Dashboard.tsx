
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer } from "@/components/layouts/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Calendar, ChevronRight, Users, TrendingUp, Star, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SuggestedFriends } from "@/components/dashboard/SuggestedFriends";

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
      <PageContainer>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Card */}
          <Link to="/profile" className="block">
            <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.01] group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/20">
                      <AvatarImage src={profileData?.profile_photo} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {profileData?.display_name?.substring(0, 2) || 'NP'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{profileData?.display_name}</CardTitle>
                      <CardDescription className="mt-1">View and edit your profile</CardDescription>
                      <div className="flex items-center gap-2 mt-2 bg-background/60 backdrop-blur rounded-lg px-3 py-1 border w-fit">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <div className="text-sm">
                          <span className="font-bold text-foreground">{profileData?.current_mmr || 0}</span>
                          <span className="text-muted-foreground ml-1">MMR</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                </div>
              </CardHeader>
            </Card>
          </Link>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Your Tournaments */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-lg">Your Tournaments</CardTitle>
                </div>
                <Link to="/tournaments">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingTournaments && upcomingTournaments.length > 0 ? (
                  upcomingTournaments.map((tournament) => (
                    <Link 
                      key={tournament.tournament_id} 
                      to={`/tournaments/${tournament.tournament_id}`}
                      className="block p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors border border-accent/40"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-foreground">{tournament.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(tournament.start_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="text-sm font-medium">{tournament.recommended_mmr}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground mt-1" />
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground text-sm">No upcoming tournaments</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Suggested Friends */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  <CardTitle className="text-lg">Suggested Friends</CardTitle>
                </div>
                <Link to="/friends">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                    Manage
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <SuggestedFriends userId={user?.id} />
              </CardContent>
            </Card>
          </div>

          {/* Recent Matches - Full Width */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-purple-500" />
                <CardTitle className="text-lg">Recent Matches</CardTitle>
              </div>
              <Link to="/matches">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentMatches && recentMatches.length > 0 ? (
                recentMatches.map((match) => (
                  <div key={match.match_id} className="p-4 rounded-lg bg-accent/30 border border-accent/40">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          match.change_type === 'WIN' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {match.change_type === 'WIN' ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {match.change_type === 'WIN' ? 'Victory' : 'Defeat'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(match.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        match.change_type === 'WIN' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {match.change_type === 'WIN' ? '+' : '-'}{match.change_amount} MMR
                      </div>
                    </div>
                    
                    {/* Match Details with Player Photos */}
                    <div className="flex items-center justify-between gap-4 p-3 bg-background/60 rounded-lg border">
                      {/* Team 1 */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={match.player1_profile_photo} />
                            <AvatarFallback className="text-xs">
                              {match.player1_display_name?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{match.player1_display_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={match.player2_profile_photo} />
                            <AvatarFallback className="text-xs">
                              {match.player2_display_name?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{match.player2_display_name}</span>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-background border">
                        <span className="text-lg font-bold">{match.team1_score}</span>
                        <span className="text-muted-foreground">-</span>
                        <span className="text-lg font-bold">{match.team2_score}</span>
                      </div>

                      {/* Team 2 */}
                      <div className="flex-1 text-right">
                        <div className="flex items-center justify-end gap-2 mb-1">
                          <span className="text-sm font-medium">{match.player3_display_name}</span>
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={match.player3_profile_photo} />
                            <AvatarFallback className="text-xs">
                              {match.player3_display_name?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-sm font-medium">{match.player4_display_name}</span>
                          <Avatar className="h-6 w-6">
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
                <div className="text-center py-8">
                  <Trophy className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">No recent matches</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </>
  );
}
