import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ReferrerData {
  first_name: string | null;
  last_name: string | null;
  profile_photo: string | null;
}

export const useReferrer = (referrerId: string | null) => {
  return useQuery({
    queryKey: ['referrer', referrerId],
    queryFn: async (): Promise<ReferrerData | null> => {
      if (!referrerId) return null;
      
      const { data, error } = await supabase
        .from('users')
        .select('first_name, last_name, profile_photo')
        .eq('id', referrerId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching referrer:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!referrerId,
    retry: 1,
  });
};