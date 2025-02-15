
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
}

export const useUserProfile = () => {
  const { user } = useAuth();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      try {
        const { data: rpcData, error: rpcError } = await supabase
          .rpc('get_user_profile', { user_a_id: user.id });
        
        if (rpcError) {
          console.error('RPC error:', rpcError);
          const { data: tableData, error: tableError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
          
          if (tableError) throw tableError;
          return tableData as UserProfile;
        }
        
        if (!rpcData || rpcData.length === 0) {
          const { data: tableData, error: tableError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
          
          if (tableError) throw tableError;
          return tableData as UserProfile;
        }
        
        return rpcData[0] as UserProfile;
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
