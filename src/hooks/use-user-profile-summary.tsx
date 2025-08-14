import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface UserProfileSummary {
  rank: number;
  current_mmr: number | null;
  profile_photo: string | null;
  first_name: string | null;
}

export const useUserProfileSummary = () => {
  const { user } = useAuth();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['userProfileSummary', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      try {
        console.log('Fetching profile summary for user:', user.id);
        // Call the public.user_profile function using raw query since it's not in generated types
        const { data, error } = await supabase
          .rpc('user_profile' as any);
        
        if (error) throw error;
        
        console.log('User profile summary response:', data);
        return data as UserProfileSummary;
      } catch (error) {
        console.error('Profile summary fetch error:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
  });

  return {
    profile,
    isLoading,
    error,
    userId: user?.id
  };
};