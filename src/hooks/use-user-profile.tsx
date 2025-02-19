
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface UserProfile {
  id: string;
  display_name: string | null;
  created_at: string | null;
  gender: string | null;
  date_of_birth: string | null;
  location: string | null;
  languages: string[] | null;
  preferred_language: string | null;
  profile_photo: string | null;
  whatsapp_number: string | null;
  current_mmr: number | null;
  nationality: string | null;
  is_onboarded: boolean | null;
  email: string | null;
  level: number | null;
  xp_levelup: number | null;
  total_xp_levelup: number | null;
  friend_requests_count: number | null;
}

export const useUserProfile = () => {
  const { user } = useAuth();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      try {
        // Get user profile and friend requests count in parallel
        const [profileResponse, friendRequestsResponse] = await Promise.all([
          supabase.rpc('get_user_profile', { user_a_id: user.id }),
          supabase.rpc('friend_requests_counter', { user_a_id: user.id })
        ]);
        
        if (profileResponse.error) {
          console.error('RPC error:', profileResponse.error);
          const { data: tableData, error: tableError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
          
          if (tableError) throw tableError;
          return {
            ...tableData,
            friend_requests_count: typeof friendRequestsResponse.data === 'number' ? friendRequestsResponse.data : 0
          } as UserProfile;
        }
        
        if (!profileResponse.data) {
          const { data: tableData, error: tableError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
          
          if (tableError) throw tableError;
          return {
            ...tableData,
            friend_requests_count: typeof friendRequestsResponse.data === 'number' ? friendRequestsResponse.data : 0
          } as UserProfile;
        }
        
        // Cast the JSON response to UserProfile after verifying it has the required shape
        const typedData = profileResponse.data as unknown as UserProfile;
        if (!typedData.id) {
          throw new Error('Invalid profile data structure');
        }
        
        return {
          ...typedData,
          friend_requests_count: typeof friendRequestsResponse.data === 'number' ? friendRequestsResponse.data : 0
        } as UserProfile;
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
