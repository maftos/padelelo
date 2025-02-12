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
import { Trophy, Users, GamepadIcon, Repeat, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Achievement {
  id: number;
  title: string;
  description: string;
  action_type_trigger: "EDIT_PROFILE" | "SEND_FRIEND_REQUEST" | "REGISTER_MATCH" | "MATCH_PLAYED" | "SIGN_UP_COMPLETE";
  minimum_level_requirement: number;
  xp_amount: number;
  prerequisites: number[];
  category: string;
  icon: string;
  is_unique: boolean;
  current_progress?: number;
  target_progress?: number;
  is_completed?: boolean;
  is_claimed?: boolean;
}

interface RepeatableAction {
  id: number;
  title: string;
  description: string;
  xp_amount: number;
  icon: string;
  action_type: string;
}

interface UserExperience {
  level: number;
  xp_levelup: number;
  current_xp: number;
  total_xp: number;
}

interface LevelRequirement {
  level: number;
  min_xp: number;
  max_xp: number;
}

interface UserBadge {
  id: number;
  title: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  description: string;
}

const sampleRepeatableActions: RepeatableAction[] = [
  {
    id: 1,
    title: "Play a Match",
    description: "Complete a match to earn XP",
    xp_amount: 10,
    icon: "🎮",
    action_type: "MATCH_PLAYED"
  },
  {
    id: 2,
    title: "Register Match Results",
    description: "Register match results to earn XP",
    xp_amount: 5,
    icon: "📝",
    action_type: "REGISTER_MATCH"
  },
  {
    id: 3,
    title: "Daily Login",
    description: "Log in to earn daily XP",
    xp_amount: 15,
    icon: "📅",
    action_type: "DAILY_LOGIN"
  }
];

const sampleAchievements: Achievement[] = [
  {
    id: 1,
    title: "Profile Master",
    description: "Complete your profile information",
    action_type_trigger: "EDIT_PROFILE",
    minimum_level_requirement: 1,
    xp_amount: 1000,
    prerequisites: [],
    category: "Profile",
    icon: "👤",
    is_unique: true,
    current_progress: 5,
    target_progress: 5,
    is_completed: true,
    is_claimed: false
  },
  {
    id: 2,
    title: "Social Butterfly",
    description: "Send friend requests to 5 players",
    action_type_trigger: "SEND_FRIEND_REQUEST",
    minimum_level_requirement: 1,
    xp_amount: 1500,
    prerequisites: [1],
    category: "Social",
    icon: "🦋",
    is_unique: true,
    current_progress: 2,
    target_progress: 5,
    is_completed: false,
    is_claimed: false
  },
  {
    id: 3,
    title: "Match Maker",
    description: "Register your first match",
    action_type_trigger: "REGISTER_MATCH",
    minimum_level_requirement: 2,
    xp_amount: 2000,
    prerequisites: [],
    category: "Matches",
    icon: "🎮",
    is_unique: true,
    current_progress: 1,
    target_progress: 1,
    is_completed: true,
    is_claimed: false
  }
];

const sampleUserExperience: UserExperience = {
  level: 2,
  xp_levelup: 5000,
  current_xp: 3500,
  total_xp: 8500
};

const sampleUserStats = {
  displayName: "John Doe",
  profilePhoto: "/lovable-uploads/14a55cb7-6df6-47ec-af26-fab66670c638.png",
  totalMatches: 25,
  currentMmr: 3200
};

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
  const [achievements, setAchievements] = useState<Achievement[]>(sampleAchievements);
  const [userExperience, setUserExperience] = useState<UserExperience>(sampleUserExperience);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const calculateLevelProgress = () => {
    return Math.round((userExperience.current_xp / userExperience.xp_levelup) * 100);
  };

  const handleClaimReward = (achievementId: number) => {
    setAchievements(prevAchievements =>
      prevAchievements.map(achievement =>
        achievement.id === achievementId
          ? { ...achievement, is_claimed: true }
          : achievement
      )
    );
    toast.success("Reward claimed successfully!");
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
                  <AvatarImage src={sampleUserStats.profilePhoto} />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl font-bold">{sampleUserStats.displayName}</CardTitle>
                  <CardDescription className="text-lg">
                    Level {userExperience.level} • {userExperience.total_xp} XP Total
                  </CardDescription>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-sm">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span>MMR: {sampleUserStats.currentMmr}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <GamepadIcon className="h-4 w-4 text-green-500" />
                      <span>{sampleUserStats.totalMatches} Matches</span>
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
                {userExperience.current_xp} / {userExperience.xp_levelup} XP to next level
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Repeat className="h-5 w-5 text-green-500" />
              <CardTitle>Repeatable Actions</CardTitle>
            </div>
            <CardDescription>Actions you can perform multiple times to earn XP</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sampleRepeatableActions.map((action) => (
              <div key={action.id} className="bg-black/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{action.icon}</span>
                  <div>
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-green-500 font-bold text-sm">+{action.xp_amount} XP per action</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="bg-gradient-to-br from-amber-500/10 to-red-500/10 border-2 border-amber-500/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                <CardTitle>Daily Quests</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="bg-black/30 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{achievement.icon}</span>
                      <h3 className="font-semibold">{achievement.title}</h3>
                    </div>
                    <span className="text-amber-500 font-bold">{achievement.xp_amount} XP</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                  <div className="space-y-1">
                    <Progress 
                      value={(achievement.current_progress! / achievement.target_progress!) * 100} 
                      className="h-2 bg-amber-950"
                    />
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">
                        {achievement.current_progress} / {achievement.target_progress}
                      </p>
                      {achievement.is_completed && !achievement.is_claimed && (
                        <Button 
                          size="sm" 
                          className="bg-amber-500 hover:bg-amber-600 hover:scale-105 transition-all duration-200
                            hover:shadow-lg hover:shadow-amber-500/20"
                          onClick={() => handleClaimReward(achievement.id)}
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

          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-blue-500" />
                <CardTitle>Weekly Challenges</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.id + "_weekly"} className="bg-black/30 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{achievement.icon}</span>
                      <h3 className="font-semibold">{achievement.title}</h3>
                    </div>
                    <span className="text-blue-500 font-bold">{achievement.xp_amount * 2} XP</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                  <div className="space-y-1">
                    <Progress 
                      value={(achievement.current_progress! / achievement.target_progress!) * 100} 
                      className="h-2 bg-blue-950"
                    />
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">
                        {achievement.current_progress} / {achievement.target_progress}
                      </p>
                      {achievement.is_completed && !achievement.is_claimed && (
                        <Button 
                          size="sm" 
                          className="bg-blue-500 hover:bg-blue-600 hover:scale-105 transition-all duration-200
                            hover:shadow-lg hover:shadow-blue-500/20"
                          onClick={() => handleClaimReward(achievement.id)}
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
        </div>
      </PageContainer>
    </>
  );
}
