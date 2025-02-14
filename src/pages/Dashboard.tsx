
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
import { Trophy, GamepadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import confetti from 'canvas-confetti';

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

interface ClaimAchievementResponse {
  success: boolean;
  message?: string;
  xp_amount?: number;
  old_xp_levelup?: number;
  new_xp_levelup?: number;
  total_xp_new_levelup?: number;
  old_level?: number;
  new_level?: number;
  did_level_up?: boolean;
}

// Helper function to type check the response
function isClaimAchievementResponse(data: unknown): data is ClaimAchievementResponse {
  if (typeof data !== 'object' || data === null) return false;
  
  const response = data as Partial<ClaimAchievementResponse>;
  return typeof response.success === 'boolean';
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

  const triggerConfetti = () => {
    const duration = 2000;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    
    // Launch multiple confetti bursts
    const count = 200;
    const origin = { x: 0.5, y: 0.5 };
    
    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(() => {
      const particleCount = 50;
      confetti({
        ...defaults,
        particleCount,
        origin: {
          x: randomInRange(0.1, 0.9),
          y: randomInRange(0.1, 0.9)
        }
      });
    }, 250);

    setTimeout(() => {
      clearInterval(interval);
    }, duration);
  };

  // Animate XP progress smoothly
  const animateXPProgress = (oldXP: number, newXP: number, totalXP: number, duration: number = 3000) => {
    const startTime = performance.now();
    const startProgress = ((totalXP - oldXP) / totalXP) * 100;
    const endProgress = ((totalXP - newXP) / totalXP) * 100;
    
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
      const progressValue = ((profileData.total_xp_levelup - profileData.xp_levelup) / profileData.total_xp_levelup) * 100;
      setXpProgress(progressValue);
    }
  }, [profileData?.xp_levelup, profileData?.total_xp_levelup]);

  const handleClaimReward = async (achievementId: number) => {
    try {
      if (!user?.id) return;

      // Mark the achievement as being claimed (for animation)
      setRecentlyClaimed(achievementId);

      const { data: result, error } = await supabase.rpc('claim_achievement', {
        i_user_id: user.id,
        i_achievement_id: achievementId
      });

      if (error) throw error;

      // Type check the response
      if (!isClaimAchievementResponse(result)) {
        throw new Error('Invalid response from server');
      }

      if (!result.success) {
        throw new Error(result.message || 'Failed to claim achievement');
      }

      // Refetch data
      await Promise.all([refetchProfile(), refetchAchievements()]);

      const oldXpLevelup = result.old_xp_levelup || 0;
      const newXpLevelup = result.new_xp_levelup || 0;
      const totalXpNewLevelup = result.total_xp_new_levelup || 100;

      // Handle level up if detected in the response
      if (result.did_level_up) {
        setIsLevelingUp(true);

        // First animate to 100%
        animateXPProgress(oldXpLevelup, 0, totalXpNewLevelup, 1500);
        
        // Trigger confetti effect
        setTimeout(() => {
          triggerConfetti();
          toast.success(
            <div className="text-center">
              <div className="text-xl font-bold">Level Up!</div>
              <div className="text-lg">You are now level {result.new_level}!</div>
            </div>,
            {
              duration: 5000,
              className: "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-2 border-yellow-500/50"
            }
          );
        }, 1500);

        // After the first animation completes, animate to the new progress
        setTimeout(() => {
          setIsLevelingUp(false);
          animateXPProgress(totalXpNewLevelup, newXpLevelup, totalXpNewLevelup, 1500);
        }, 3000);
      } else {
        // Regular XP gain animation
        animateXPProgress(oldXpLevelup, newXpLevelup, totalXpNewLevelup, 1500);
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
                  <CardDescription className="text-lg">
                    Level {profileData?.level || 1}
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
