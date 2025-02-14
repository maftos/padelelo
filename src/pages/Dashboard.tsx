import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer } from "@/components/layouts/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Navigation } from "@/components/Navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, GamepadIcon, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Achievement {
  achievement_id: number;
  title: string;
  description: string;
  current_count: number;
  target_count: number;
  xp_amount: number;
  is_completed: boolean;
  is_claimed: boolean;
}

interface UserProfile {
  display_name: string;
  profile_photo: string;
  current_mmr: number;
  level: number;
  xp_levelup: number;
}

interface UserBadge {
  id: number;
  title: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  description: string;
}

const sampleBadges: UserBadge[] = [
  {
    id: 1,
    title: "Tournament Victor",
    icon: "🏆",
    rarity: "legendary",
    description: "Won an M25 tournament"
  },
  {
    id: 2,
    title: "Rising Star",
    icon: "⭐",
    rarity: "epic",
    description: "Reached 3000+ MMR"
  },
  {
    id: 3,
    title: "Veteran",
    icon: "🎯",
    rarity: "rare",
    description: "Played 100+ matches"
  }
];

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

  const { data: achievements, refetch: refetchAchievements } = useQuery({
    queryKey: ['userAchievements', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase.rpc('get_user_achievements', {
        i_user_id: user.id
      });
      if (error) throw error;
      return data as Achievement[];
    },
    enabled: !!user?.id
  });

  const handleClaimReward = async (achievementId: number) => {
    try {
      if (!user?.id) return;

      const { error } = await supabase.rpc('claim_achievement', {
        i_user_id: user.id,
        i_achievement_id: achievementId
      });

      if (error) throw error;

      await refetchAchievements();
      toast.success("Reward claimed successfully!");
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast.error("Failed to claim reward. Please try again.");
    }
  };

  const calculateLevelProgress = () => {
    if (!profileData?.xp_levelup) return 0;
    return Math.round((profileData.xp_levelup / 100) * 100);
  };

  const getBadgeColor = (rarity: UserBadge["rarity"]) => {
    switch (rarity) {
      case "legendary":
        return "text-amber-400 bg-amber-400/10";
      case "epic":
        return "text-purple-400 bg-purple-400/10";
      case "rare":
        return "text-blue-400 bg-blue-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <>
      <Navigation />
      <PageContainer>
        <Card className="mb-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-2 border-indigo-500/20">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20 border-2 border-indigo-500/20">
                  <AvatarImage src={profileData?.profile_photo} />
                  <AvatarFallback>
                    {profileData?.display_name?.substring(0, 2) || 'NP'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl font-bold">{profileData?.display_name}</CardTitle>
                  <CardDescription className="text-lg">
                    Level {profileData?.level || 1} • {profileData?.xp_levelup || 0} XP Total
                  </CardDescription>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-sm">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span>MMR: {profileData?.current_mmr || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <GamepadIcon className="h-4 w-4 text-green-500" />
                      <span>0 Matches</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {sampleBadges.map((badge) => (
                      <div
                        key={badge.id}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${getBadgeColor(badge.rarity)} 
                          transition-transform hover:scale-105 cursor-help`}
                        title={badge.description}
                      >
                        <span className="text-lg">{badge.icon}</span>
                        <span className="text-sm font-medium">{badge.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={calculateLevelProgress()} className="h-3 bg-indigo-950" />
              <p className="text-sm text-muted-foreground">
                {profileData?.xp_levelup || 0} XP to next level
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-gradient-to-br from-amber-500/10 to-red-500/10 border-2 border-amber-500/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              <CardTitle>Daily Quests</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {achievements?.map((achievement) => (
              <div key={achievement.achievement_id} className="bg-black/30 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{achievement.title}</h3>
                  </div>
                  <span className="text-amber-500 font-bold">{achievement.xp_amount} XP</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                <div className="space-y-1">
                  <Progress 
                    value={(achievement.current_count / achievement.target_count) * 100} 
                    className="h-2 bg-amber-950"
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                      {achievement.current_count} / {achievement.target_count}
                    </p>
                    {achievement.is_completed && !achievement.is_claimed && (
                      <Button 
                        size="sm" 
                        className="bg-amber-500 hover:bg-amber-600 hover:scale-105 transition-all duration-200
                          hover:shadow-lg hover:shadow-amber-500/20"
                        onClick={() => handleClaimReward(achievement.achievement_id)}
                      >
                        Claim Reward
                      </Button>
                    )}
                    {achievement.is_claimed && (
                      <span className="text-xs text-muted-foreground">Claimed</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </PageContainer>
    </>
  );
}
