import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer } from "@/components/layouts/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Navigation } from "@/components/Navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, GamepadIcon, Star, Copy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import confetti from 'canvas-confetti';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
function isClaimAchievementResponse(data: unknown): data is ClaimAchievementResponse {
  if (typeof data !== 'object' || data === null) return false;
  const response = data as Partial<ClaimAchievementResponse>;
  return typeof response.success === 'boolean';
}
export default function Dashboard() {
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const [xpProgress, setXpProgress] = useState(0);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [recentlyClaimed, setRecentlyClaimed] = useState<number | null>(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);
  const {
    data: profileData,
    refetch: refetchProfile
  } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const {
        data,
        error
      } = await supabase.rpc('get_user_profile', {
        user_a_id: user.id
      });
      if (error) throw error;
      return data[0] as UserProfile;
    },
    enabled: !!user?.id
  });
  const {
    data: achievements,
    refetch: refetchAchievements
  } = useQuery({
    queryKey: ['userAchievements', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const {
        data,
        error
      } = await supabase.rpc('get_user_achievements', {
        i_user_id: user.id
      });
      if (error) throw error;
      return data as Achievement[];
    },
    enabled: !!user?.id
  });
  const triggerConfetti = () => {
    const duration = 2000;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0
    };
    const count = 200;
    const origin = {
      x: 0.5,
      y: 0.5
    };
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
  const animateXPProgress = (oldXP: number, newXP: number, totalXP: number, duration: number = 3000) => {
    const startTime = performance.now();
    const startProgress = (totalXP - oldXP) / totalXP * 100;
    const endProgress = (totalXP - newXP) / totalXP * 100;
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
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
  useEffect(() => {
    if (profileData?.xp_levelup && profileData?.total_xp_levelup) {
      const remainingXp = profileData.total_xp_levelup - profileData.xp_levelup;
      const progressValue = remainingXp / profileData.total_xp_levelup * 100;
      setXpProgress(progressValue);
    }
  }, [profileData?.xp_levelup, profileData?.total_xp_levelup]);
  const handleClaimReward = async (achievementId: number) => {
    try {
      if (!user?.id) return;
      setRecentlyClaimed(achievementId);
      const {
        data: result,
        error
      } = await supabase.rpc('claim_achievement', {
        i_user_id: user.id,
        i_achievement_id: achievementId
      });
      if (error) throw error;
      if (!isClaimAchievementResponse(result)) {
        throw new Error('Invalid response from server');
      }
      if (!result.success) {
        throw new Error(result.message || 'Failed to claim achievement');
      }
      await Promise.all([refetchProfile(), refetchAchievements()]);
      const oldXpLevelup = result.old_xp_levelup || 0;
      const newXpLevelup = result.new_xp_levelup || 0;
      const totalXpNewLevelup = result.total_xp_new_levelup || 100;
      if (result.did_level_up) {
        setIsLevelingUp(true);
        const fullProgressDuration = 1500;
        animateXPProgress(oldXpLevelup, 0, totalXpNewLevelup, fullProgressDuration);
        setTimeout(() => {
          triggerConfetti();
        }, fullProgressDuration);
        setTimeout(() => {
          setIsLevelingUp(false);
          setXpProgress(0);
          setTimeout(() => {
            animateXPProgress(totalXpNewLevelup, newXpLevelup, totalXpNewLevelup, 1500);
          }, 100);
        }, fullProgressDuration + 3000);
      } else {
        animateXPProgress(oldXpLevelup, newXpLevelup, totalXpNewLevelup, 1500);
      }
      setTimeout(() => {
        setRecentlyClaimed(null);
      }, 1000);
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast.error("Failed to claim reward. Please try again.");
      setRecentlyClaimed(null);
    }
  };
  const calculateRemainingXp = (xp_levelup: number, total_xp_levelup: number) => {
    return total_xp_levelup - xp_levelup;
  };
  const getAchievementCTA = (achievementId: number) => {
    switch (achievementId) {
      case 1:
        return <Link to="/profile">
          <Button variant="secondary" size="sm" className="bg-white/5 hover:bg-white/10">
            Complete Profile
          </Button>
        </Link>;
      case 2:
        return <Link to="/leaderboard">
          <Button variant="secondary" size="sm" className="bg-white/5 hover:bg-white/10">
            Add Friends
          </Button>
        </Link>;
      case 3:
        return <Link to="/register-match">
          <Button variant="secondary" size="sm" className="bg-white/5 hover:bg-white/10">
            Register Match
          </Button>
        </Link>;
      case 5:
        return <Button variant="secondary" size="sm" className="bg-white/5 hover:bg-white/10" onClick={() => setShowInviteDialog(true)}>
            Invite Friends
          </Button>;
      default:
        return null;
    }
  };
  if (loading) return <div>Loading...</div>;
  if (!user) return null;
  return (
    <>
      <Navigation />
      <PageContainer>
        <Link to="/profile" className="block">
          <Card className="mb-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-2 border-indigo-500/20 hover:scale-[1.01] transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/10 group">
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
                <ArrowRight className="h-6 w-6 text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:transform group-hover:translate-x-1 transition-all duration-200 self-center" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress 
                  value={xpProgress} 
                  className="h-3 transition-all duration-1000 ease-out bg-indigo-950"
                />
                <p className="text-sm text-muted-foreground">
                  {calculateRemainingXp(profileData?.xp_levelup || 0, profileData?.total_xp_levelup || 100)} / {profileData?.total_xp_levelup || 100} XP to next level
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="mb-6 bg-gradient-to-br from-amber-500/10 to-red-500/10 border-2 border-amber-500/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              <CardTitle>Achievements</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {achievements?.filter(a => !a.is_claimed).map(achievement => <div key={achievement.achievement_id} className={`bg-black/30 rounded-lg p-4 transition-all duration-1000 ease-in-out ${recentlyClaimed === achievement.achievement_id ? 'scale-0 opacity-0 translate-y-full' : 'scale-100 opacity-100 translate-y-0'} ${achievement.is_completed ? 'shadow-lg shadow-amber-500/30 border border-amber-500/50' : ''}`}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{achievement.title}</h3>
                    </div>
                    <span className="text-amber-500 font-bold">{achievement.xp_amount} XP</span>
                  </div>
                  <p className="text-sm text-muted-foreground py-[5px]">{achievement.description}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-medium text-muted-foreground">
                      {achievement.current_count} / {achievement.target_count}
                    </p>
                    {achievement.is_completed ? !achievement.is_claimed && <Button size="sm" className="bg-amber-500 hover:bg-amber-600 hover:scale-105 transition-all duration-200
                            hover:shadow-lg hover:shadow-amber-500/20" onClick={() => handleClaimReward(achievement.achievement_id)}>
                          Claim Reward
                        </Button> : getAchievementCTA(achievement.achievement_id)}
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card>

        {achievements?.some(a => a.is_claimed) && <Card className="mb-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-green-500" />
                <CardTitle>Claimed</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {achievements?.filter(a => a.is_claimed).map(achievement => <div key={achievement.achievement_id} className={`bg-black/30 rounded-lg p-4 transition-all duration-1000 ease-in-out ${recentlyClaimed === achievement.achievement_id ? 'animate-fade-in scale-100 opacity-100' : ''}`}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <span className="text-green-500 font-bold">{achievement.xp_amount} XP</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                  </div>)}
              </div>
            </CardContent>
          </Card>}
      </PageContainer>

      {user && <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Invite Friends</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <div className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    1
                  </div>
                  <h3 className="font-medium">Your Referral Link</h3>
                </div>
                <p className="text-sm text-muted-foreground pl-7">
                  This link is unique to your account and allows us to track successful referrals.
                </p>
                <Button className="w-full mt-2" variant="outline" onClick={() => {
              const inviteUrl = `${window.location.origin}/signup?ref=${user.id}`;
              navigator.clipboard.writeText(inviteUrl).then(() => toast.success("Invite URL copied to clipboard!")).catch(() => toast.error("Failed to copy invite URL"));
            }}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Referral Link
                </Button>
              </div>

              {/* Step 2 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <div className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    2
                  </div>
                  <h3 className="font-medium">Share with Friends</h3>
                </div>
                <p className="text-sm text-muted-foreground pl-7">
                  Send the link to your friends.
                </p>
              </div>

              {/* Step 3 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <div className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    3
                  </div>
                  <h3 className="font-medium">They Sign Up</h3>
                </div>
                <p className="text-sm text-muted-foreground pl-7">
                  The platform is invite-only. So once they click on your referral link to sign up, they will see this:
                </p>
                
                {/* Referrer Preview */}
                <div className="bg-accent rounded-lg p-4 mt-2">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={profileData?.profile_photo} />
                      <AvatarFallback>{profileData?.display_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Invited by</p>
                      <p className="font-medium">{profileData?.display_name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>}
    </>
  );
}
