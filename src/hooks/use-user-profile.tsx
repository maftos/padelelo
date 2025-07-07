
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  display_name?: string | null; // Computed field
  created_at: string | null;
  gender: string | null;
  location: string | null;
  profile_photo: string | null;
  current_mmr: number | null;
  nationality: string | null;
  is_onboarded: boolean | null;
  friend_requests_count: number | null;
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
        // Get user profile and friend requests count in parallel
        const [profileResponse, friendRequestsResponse] = await Promise.all([
          supabase.rpc('get_user_profile', { user_a_id: user.id }),
          supabase.rpc('friend_requests_counter', { user_a_id: user.id })
        ]);
        
        console.log('Friend requests response:', friendRequestsResponse);

        // First cast to unknown, then to our defined type, and extract count
        const requestCount = ((friendRequestsResponse.data as unknown) as FriendRequestsCountResponse)?.count || 0;
        console.log('Extracted request count:', requestCount);
        
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
            friend_requests_count: requestCount
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
            friend_requests_count: requestCount
          } as UserProfile;
        }
        
        // Cast the JSON response to UserProfile after verifying it has the required shape
        const typedData = profileResponse.data as unknown as UserProfile;
        if (!typedData.id) {
          throw new Error('Invalid profile data structure');
        }
        
        const finalProfile = {
          ...typedData,
          friend_requests_count: requestCount
        } as UserProfile;
        
        console.log('Final profile with friend requests:', finalProfile);
        return finalProfile;
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
