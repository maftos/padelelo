
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer } from "@/components/layouts/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, GamepadIcon, ClipboardEdit, Calendar, History, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  team1_score: number;
  team2_score: number;
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
        {/* User Profile Header */}
        <Link to="/profile" className="block mb-8">
          <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-2 border-indigo-500/20 hover:scale-[1.01] transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/10 group relative">
            <div className="absolute right-6 top-1/2 -translate-y-1/2">
              <ChevronRight className="h-6 w-6 text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:transform group-hover:translate-x-1 transition-all duration-200" />
            </div>
            <CardHeader>
              <div className="flex items-start pr-8">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20 border-2 border-indigo-500/20">
                    <AvatarImage src={profileData?.profile_photo} />
                    <AvatarFallback>
                      {profileData?.display_name?.substring(0, 2) || 'NP'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl font-bold">
                      {profileData?.display_name}
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        <span className="text-base">{profileData?.current_mmr || 0} MMR</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/register-match">
            <Card className="h-full hover:shadow-lg transition-all duration-200 hover:scale-[1.02] bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/20">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-3">
                  <ClipboardEdit className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Register Match</CardTitle>
                <CardDescription>Record your latest padel match results</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/tournaments">
            <Card className="h-full hover:shadow-lg transition-all duration-200 hover:scale-[1.02] bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/20">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-3">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Tournaments</CardTitle>
                <CardDescription>View and join upcoming tournaments</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/matches">
            <Card className="h-full hover:shadow-lg transition-all duration-200 hover:scale-[1.02] bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/20">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-3">
                  <History className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Match History</CardTitle>
                <CardDescription>Review your recent matches</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Upcoming Tournaments */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Upcoming Tournaments
              </CardTitle>
              <CardDescription>Tournaments you might be interested in</CardDescription>
            </div>
            <Link to="/tournaments">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {upcomingTournaments && upcomingTournaments.length > 0 ? (
              <div className="space-y-3">
                {upcomingTournaments.map((tournament) => (
                  <Link 
                    key={tournament.tournament_id} 
                    to={`/tournaments/${tournament.tournament_id}`}
                    className="block p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{tournament.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(tournament.start_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{tournament.recommended_mmr} MMR</p>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No upcoming tournaments found</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Matches */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-purple-500" />
                Recent Matches
              </CardTitle>
              <CardDescription>Your latest match results</CardDescription>
            </div>
            <Link to="/matches">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentMatches && recentMatches.length > 0 ? (
              <div className="space-y-3">
                {recentMatches.map((match) => (
                  <div key={match.match_id} className="p-3 rounded-lg border">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          match.change_type === 'WIN' ? 'bg-green-500/20' : 'bg-red-500/20'
                        }`}>
                          <Trophy className={`h-4 w-4 ${
                            match.change_type === 'WIN' ? 'text-green-600' : 'text-red-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium">
                            {match.change_type === 'WIN' ? 'Victory' : 'Defeat'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(match.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          match.change_type === 'WIN' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {match.change_type === 'WIN' ? '+' : '-'}{match.change_amount} MMR
                        </p>
                        <p className="text-sm text-muted-foreground">
                          New: {match.new_mmr}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No recent matches found</p>
            )}
          </CardContent>
        </Card>
      </PageContainer>
    </>
  );
}
