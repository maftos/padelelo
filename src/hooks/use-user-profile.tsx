import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface UserProfile {
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
}

export const useUserProfile = () => {
  const [userId, setUserId] = useState<string | null>(null);

  // Get the actual authenticated user ID
  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
    };
    
    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      try {
        // First try to get the profile using RPC with the correct parameter name
        const { data: rpcData, error: rpcError } = await supabase
          .rpc('get_user_profile', { user_a_id_auth: userId });
        
        if (rpcError) {
          console.error('RPC error:', rpcError);
          // If RPC fails, fallback to direct table query
          const { data: tableData, error: tableError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .maybeSingle();
          
          if (tableError) throw tableError;
          return tableData as UserProfile;
        }
        
        // If RPC succeeds but returns no data, try direct table query
        if (!rpcData || rpcData.length === 0) {
          const { data: tableData, error: tableError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
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
    enabled: !!userId,
  });

  return {
    profile,
    isLoading,
    error,
    userId
  };
};