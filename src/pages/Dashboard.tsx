import { useEffect, useState } from "react";
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
  total_xp_levelup: number;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [xpProgress, setXpProgress] = useState(0);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [recentlyClaimed, setRecentlyClaimed] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Query user profile data
  const { data: profileData, refetch: refetchProfile } = useQuery({
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

  // Query achievements data
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

  // Animate XP progress smoothly
  const animateXPProgress = (oldXP: number, newXP: number, totalXP: number, duration: number = 3000) => {
    const startTime = performance.now();
    const startProgress = (1 - (oldXP / totalXP)) * 100;
    const endProgress = (1 - (newXP / totalXP)) * 100;
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = (x: number): number => {
        return 1 - Math.pow(1 - x, 3);
      };
      
      const easedProgress = easeOutCubic(progress);
      const currentProgress = startProgress + (endProgress - startProgress) * easedProgress;
      
      setXpProgress(currentProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  };

  // Set initial XP progress when profile data loads
  useEffect(() => {
    if (profileData?.xp_levelup && profileData?.total_xp_levelup) {
      const progressValue = (1 - (profileData.xp_levelup / profileData.total_xp_levelup)) * 100;
      setXpProgress(progressValue);
    }
  }, [profileData?.xp_levelup, profileData?.total_xp_levelup]);

  const handleClaimReward = async (achievementId: number) => {
    try {
      if (!user?.id) return;

      const oldLevel = profileData?.level;
      const oldXP = profileData?.xp_levelup;
      const totalXP = profileData?.total_xp_levelup;

      if (!oldXP || !totalXP) return;

      // Mark the achievement as being claimed (for animation)
      setRecentlyClaimed(achievementId);

      const { error } = await supabase.rpc('claim_achievement', {
        i_user_id: user.id,
        i_achievement_id: achievementId
      });

      if (error) throw error;

      // Refetch data
      const [profileResult, achievementsResult] = await Promise.all([
        refetchProfile(),
        refetchAchievements()
      ]);

      // Get the new profile data
      const newProfile = profileResult.data[0] as UserProfile;

      // If level changed, show level up animation
      if (newProfile.level > oldLevel!) {
        setIsLevelingUp(true);

        // Animate to 100% first
        animateXPProgress(oldXP, 0, totalXP, 3000);
        
        toast.success(
          <div className="flex flex-col items-center space-y-2">
            <div className="text-xl font-bold">Level Up!</div>
            <div className="text-lg">You are now level {newProfile.level}!</div>
          </div>,
          {
            duration: 5000,
            className: "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-2 border-yellow-500/50"
          }
        );

        // Wait for the animation to complete
        setTimeout(() => {
          setIsLevelingUp(false);
          // Reset to the new level's progress with animation
          animateXPProgress(0, newProfile.xp_levelup, newProfile.total_xp_levelup, 3000);
        }, 3500);
      } else {
        // Smoothly animate to new XP value
        animateXPProgress(oldXP, newProfile.xp_levelup, newProfile.total_xp_levelup, 3000);
        toast.success("Achievement claimed!");
      }

      // Clear the recently claimed state after animation
      setTimeout(() => {
        setRecentlyClaimed(null);
      }, 1000);

    } catch (error) {
      console.error('Error claiming reward:', error);
      toast.error("Failed to claim reward. Please try again.");
      setRecentlyClaimed(null);
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
                  <CardTitle className="text-2xl font-bold">
                    {profileData?.display_name}
                  </CardTitle>
                  <CardDescription className="text-lg flex items-center">
                    Level {profileData?.level || 1}
                    {isLevelingUp && (
                      <div className="inline-flex items-center ml-2 space-x-2">
                        <span className="inline-block animate-bounce">
                          <Star className="h-5 w-5 text-yellow-500" />
                        </span>
                        <span className="inline-block animate-pulse">
                          <Trophy className="h-5 w-5 text-amber-500" />
                        </span>
                        <span className="inline-block animate-bounce delay-100">
                          <Star className="h-5 w-5 text-yellow-500" />
                        </span>
                      </div>
                    )}
                  </CardDescription>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <span className="text-base">{profileData?.current_mmr || 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GamepadIcon className="h-5 w-5 text-green-500" />
                      <span className="text-base">0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress 
                value={xpProgress} 
                className={`h-3 transition-all duration-1000 ease-out ${
                  isLevelingUp ? 'bg-yellow-500' : 'bg-indigo-950'
                }`}
              />
              <p className="text-sm text-muted-foreground">
                {profileData?.xp_levelup || 0} / {profileData?.total_xp_levelup || 100} XP to next level
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-gradient-to-br from-amber-500/10 to-red-500/10 border-2 border-amber-500/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              <CardTitle>Achievements</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {achievements?.filter(a => !a.is_claimed).map((achievement) => (
              <div 
                key={achievement.achievement_id} 
                className={`bg-black/30 rounded-lg p-4 transition-all duration-1000 ease-in-out ${
                  recentlyClaimed === achievement.achievement_id 
                    ? 'scale-0 opacity-0 translate-y-full' 
                    : 'scale-100 opacity-100 translate-y-0'
                }`}
              >
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
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Claimed Achievements Section */}
        {achievements?.some(a => a.is_claimed) && (
          <Card className="mb-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-green-500" />
                <CardTitle>Claimed Achievements</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements?.filter(a => a.is_claimed).map((achievement) => (
                <div 
                  key={achievement.achievement_id}
                  className={`bg-black/30 rounded-lg p-4 transition-all duration-1000 ease-in-out ${
                    recentlyClaimed === achievement.achievement_id 
                      ? 'animate-fade-in scale-100 opacity-100' 
                      : ''
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{achievement.title}</h3>
                    <span className="text-green-500 font-bold">{achievement.xp_amount} XP</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </PageContainer>
    </>
  );
}
