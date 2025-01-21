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
      
      const { data, error } = await supabase.rpc('get_user_profile', {
        user_id: userId
      });
      
      if (error) throw error;
      return data[0] as UserProfile;
    },
    enabled: !!userId, // Only run query if we have a userId
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep data in cache for 30 minutes (renamed from cacheTime)
  });

  return {
    profile,
    isLoading,
    error,
    userId
  };
};