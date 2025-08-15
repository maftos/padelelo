
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  display_name?: string | null;
  created_at: string | null;
  gender: string | null;
  location: string | null;
  profile_photo: string | null;
  current_mmr: number | null;
  nationality: string | null;
  is_onboarded: boolean | null;
  friend_requests_count: number | null;
  rank?: number; // Add rank as optional
}

export interface UserProfileSummary {
  rank: number;
  current_mmr: number | null;
  profile_photo: string | null;
  first_name: string | null;
}

// Define the type for the friend requests counter response
interface FriendRequestsCountResponse {
  count: number;
}

export const useUserProfile = () => {
  const { user } = useAuth();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      try {
        console.log('Fetching profile for user:', user.id);
        // Call the public.user_profile function with the user_id parameter
        const { data, error } = await supabase
          .rpc('user_profile' as any, { p_user_id: user.id });
        
        if (error) throw error;
        
        console.log('User profile response:', data);
        return data as UserProfile;
      } catch (error) {
        console.error('Profile fetch error:', error);
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
