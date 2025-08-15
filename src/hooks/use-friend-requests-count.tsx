import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface FriendRequestsCountResponse {
  count: number;
}

export const useFriendRequestsCount = () => {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['friendRequestsCount', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      try {
        const { data, error } = await supabase.rpc('friend_requests_counter');
        
        if (error) throw error;
        
        return data as unknown as FriendRequestsCountResponse;
      } catch (error) {
        console.error('Friend requests count fetch error:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
  });

  return {
    count: data?.count || 0,
    isLoading,
    error,
  };
};