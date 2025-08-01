
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
import { Trophy, Calendar, ChevronRight, Users, TrendingUp, TrendingDown, Star, UserPlus, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SuggestedFriends } from "@/components/dashboard/SuggestedFriends";
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
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      if (error) throw error;
      return data as UserProfile;
    },
    enabled: !!user?.id
  });

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

  const { data: recentMatchSets } = useQuery({
    queryKey: ['recentMatchSets', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase.rpc('get_my_completed_matches', {
        user_a_id: user.id,
        page_number: 1,
        page_size: 10
      });
      if (error) throw error;
      
      // Handle the new JSON response format with pagination and nested team structure
      const matchesData = (data as any)?.matches || [];
      
      // Flatten all sets from all matches into a single list
      const allSets: any[] = [];
      
      matchesData.forEach((match: any) => {
        const sets = match.sets || [];
        sets.forEach((set: any) => {
          const team1 = match.team1 || {};
          const team2 = match.team2 || {};
          
          allSets.push({
            match_id: match.match_id,
            set_number: set.set_number,
            team1_score: set.team1_score,
            team2_score: set.team2_score,
            created_at: match.created_at,
            change_type: match.change_type,
            change_amount: match.change_amount,
            team1_player1: team1.player1 ? `${team1.player1.first_name || ''} ${team1.player1.last_name || ''}`.trim() : '',
            team1_player2: team1.player2 ? `${team1.player2.first_name || ''} ${team1.player2.last_name || ''}`.trim() : '',
            team2_player1: team2.player1 ? `${team2.player1.first_name || ''} ${team2.player1.last_name || ''}`.trim() : '',
            team2_player2: team2.player2 ? `${team2.player2.first_name || ''} ${team2.player2.last_name || ''}`.trim() : '',
          });
        });
      });
      
      // Sort by match creation date and take the latest 10 sets
      return allSets
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10);
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
                        {`${profileData?.first_name || ''} ${profileData?.last_name || ''}`.trim().substring(0, 2) || 'NP'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <CardTitle className="text-lg sm:text-xl truncate">{`${profileData?.first_name || ''} ${profileData?.last_name || ''}`.trim() || 'User'}</CardTitle>
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
            {/* Next Game */}
            <Card>
              <CardHeader className="pb-3 space-y-0">
                <div className="flex items-center gap-2 min-w-0">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
                  <CardTitle className="text-base sm:text-lg truncate">Next Game</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                 {nextGame ? (
                  <div className="p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors border border-accent/40">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="font-medium text-sm sm:text-base leading-tight">
                            {new Date((nextGame as any).start_time).toLocaleDateString('en-GB', { 
                              weekday: 'long', 
                              day: 'numeric', 
                              month: 'long' 
                            })} @ {new Date((nextGame as any).start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-muted-foreground leading-tight">{(nextGame as any).venue_name}</span>
                        </div>
                      </div>
                      
                      {/* Players */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>Players</span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2">
                          {((nextGame as any).participants || []).map((participant: any, index: number) => (
                            <div key={participant.player_id} className="flex items-center gap-1.5">
                              <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                                <AvatarImage src={participant.profile_photo} />
                                <AvatarFallback className="text-xs">
                                  {`${participant.first_name[0] || ''}${participant.last_name[0] || ''}`.toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs sm:text-sm font-medium">{participant.first_name}</span>
                              {index < ((nextGame as any).participants || []).length - 1 && (
                                <span className="text-muted-foreground text-xs mx-0.5">•</span>
                              )}
                            </div>
                          ))}
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
            <CardContent>
              {recentMatchSets && recentMatchSets.length > 0 ? (
                <div className="space-y-1">
                  {/* Header */}
                  <div className="grid grid-cols-4 gap-3 px-3 py-2 text-xs font-medium text-muted-foreground border-b">
                    <div>Partner</div>
                    <div>Date/Time</div>
                    <div className="text-center">Score</div>
                    <div className="text-right">Result</div>
                  </div>
                  
                  {/* Matches List */}
                  {recentMatchSets.map((set) => {
                    // Find the user's partner (the other player on their team)
                    const isUserOnTeam1 = set.team1_player1.includes(profileData?.first_name || '') || set.team1_player2.includes(profileData?.first_name || '');
                    const partnerName = isUserOnTeam1 
                      ? (set.team1_player1.includes(profileData?.first_name || '') ? set.team1_player2 : set.team1_player1)
                      : (set.team2_player1.includes(profileData?.first_name || '') ? set.team2_player2 : set.team2_player1);
                    
                    // Format date as dd/mmm
                    const matchDate = new Date(set.created_at);
                    const formattedDate = matchDate.toLocaleDateString('en-GB', { 
                      day: '2-digit', 
                      month: 'short' 
                    });
                    
                    return (
                      <div key={`${set.match_id}-${set.set_number}`} className="grid grid-cols-4 gap-3 px-3 py-3 rounded-lg hover:bg-accent/20 transition-colors items-center">
                        {/* Partner */}
                        <div className="flex items-center gap-2 min-w-0">
                          <Avatar className="h-6 w-6 flex-shrink-0">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {partnerName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium truncate">{partnerName.split(' ')[0]}</span>
                        </div>
                        
                        {/* Date/Time */}
                        <div className="text-sm text-muted-foreground">
                          {formattedDate}
                        </div>
                        
                        {/* Score */}
                        <div className="flex items-center justify-center">
                          <div className="flex items-center gap-1 px-2 py-1 bg-background rounded border text-xs">
                            <span className="font-bold">{set.team1_score}</span>
                            <span className="text-muted-foreground">-</span>
                            <span className="font-bold">{set.team2_score}</span>
                          </div>
                        </div>
                        
                        {/* Result */}
                        <div className="flex items-center justify-end gap-2">
                          <span className={`text-sm font-medium ${
                            set.change_type === 'WIN' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {set.change_type === 'WIN' ? 'Won' : 'Lost'} ({set.change_type === 'WIN' ? '+' : ''}{set.change_amount})
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
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
