
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer } from "@/components/layouts/PageContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Achievement {
  id: number;
  title: string;
  description: string;
  action_type_trigger: "EDIT_PROFILE" | "SEND_FRIEND_REQUEST" | "REGISTER_MATCH" | "MATCH_PLAYED" | "SIGN_UP_COMPLETE";
  minimum_level_requirement: number;
  xp_amount: number;
  prerequisites: number[];  // Changed from string[] to number[]
  category: string;
  icon: string;
  is_unique: boolean;
  current_progress?: number;
  target_progress?: number;
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

// Sample data for development
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
    current_progress: 4,
    target_progress: 5
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
    target_progress: 5
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
    current_progress: 0,
    target_progress: 1
  }
];

const sampleUserExperience: UserExperience = {
  level: 2,
  xp_levelup: 5000,
  current_xp: 3500,
  total_xp: 8500
};

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState<Achievement[]>(sampleAchievements);
  const [userExperience, setUserExperience] = useState<UserExperience>(sampleUserExperience);

  // Modified auth check to handle loading state
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Calculate progress to next level
  const calculateLevelProgress = () => {
    return Math.round((userExperience.current_xp / userExperience.xp_levelup) * 100);
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <PageContainer>
      {/* Level Progress Section */}
      <Card className="mb-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-2 border-indigo-500/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Level {userExperience.level}</CardTitle>
          <CardDescription className="text-lg">
            {userExperience.total_xp} XP Total
          </CardDescription>
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

      {/* Achievement Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Daily Quests */}
        <Card className="bg-gradient-to-br from-amber-500/10 to-red-500/10 border-2 border-amber-500/20">
          <CardHeader>
            <CardTitle>Daily Quests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="bg-black/30 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{achievement.title}</h3>
                  <span className="text-amber-500 font-bold">{achievement.xp_amount} XP</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                <div className="space-y-1">
                  <Progress 
                    value={(achievement.current_progress! / achievement.target_progress!) * 100} 
                    className="h-2 bg-amber-950"
                  />
                  <p className="text-xs text-right text-muted-foreground">
                    {achievement.current_progress} / {achievement.target_progress}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Weekly Challenges */}
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/20">
          <CardHeader>
            <CardTitle>Weekly Challenges</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {achievements.map((achievement) => (
              <div key={achievement.id + "_weekly"} className="bg-black/30 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{achievement.title}</h3>
                  <span className="text-blue-500 font-bold">{achievement.xp_amount * 2} XP</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                <div className="space-y-1">
                  <Progress 
                    value={(achievement.current_progress! / achievement.target_progress!) * 100} 
                    className="h-2 bg-blue-950"
                  />
                  <p className="text-xs text-right text-muted-foreground">
                    {achievement.current_progress} / {achievement.target_progress}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
