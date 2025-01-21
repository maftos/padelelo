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
      
      // First get the user data from auth
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      // Then get the extended profile data from our custom function
      const { data, error: profileError } = await supabase.rpc('get_user_profile', {
        user_id: userId
      });
      
      if (profileError) throw profileError;
      
      // Combine auth user data with profile data
      return data?.[0] as UserProfile;
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