
import { useEffect } from "react";
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

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch user's experience data
  const { data: userExperience } = useQuery({
    queryKey: ['userExperience', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_experience')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (error) throw error;
      return data as UserExperience;
    },
    enabled: !!user?.id
  });

  // Fetch available achievements
  const { data: achievements } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('minimum_level_requirement', { ascending: true });

      if (error) throw error;
      return data as Achievement[];
    }
  });

  // Fetch level requirements
  const { data: levelRequirements } = useQuery({
    queryKey: ['levelRequirements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('level_requirements')
        .select('*')
        .order('level', { ascending: true });

      if (error) throw error;
      return data as LevelRequirement[];
    }
  });

  // Calculate progress to next level
  const calculateLevelProgress = () => {
    if (!userExperience || !levelRequirements) return 0;
    
    const currentLevelReq = levelRequirements.find(
      req => req.level === userExperience.level
    );
    
    if (!currentLevelReq) return 0;
    
    const xpInCurrentLevel = userExperience.total_xp - currentLevelReq.min_xp;
    const xpRequiredForNextLevel = currentLevelReq.max_xp - currentLevelReq.min_xp;
    
    return Math.round((xpInCurrentLevel / xpRequiredForNextLevel) * 100);
  };

  if (!user) return null;

  return (
    <PageContainer>
      {/* Level Progress Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Level {userExperience?.level || 1}</CardTitle>
          <CardDescription>
            {userExperience?.total_xp || 0} XP Total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={calculateLevelProgress()} className="w-full h-2" />
        </CardContent>
      </Card>

      {/* Available Achievements Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {achievements?.map((achievement) => (
          <Card key={achievement.id}>
            <CardHeader>
              <CardTitle className="text-lg">{achievement.title}</CardTitle>
              <CardDescription>{achievement.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {achievement.xp_amount} XP
                </span>
                {achievement.minimum_level_requirement > (userExperience?.level || 1) && (
                  <span className="text-sm text-destructive">
                    Unlocks at level {achievement.minimum_level_requirement}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
