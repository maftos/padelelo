import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useActiveBookingsCount() {
  const { user } = useAuth();

  const query = useQuery<number>({
    queryKey: ["active-bookings-count", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("count_my_active_bookings" as any);
      if (error) throw error;
      return Number(data ?? 0);
    },
    enabled: !!user?.id,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    refetchInterval: 60_000,
  });

  return {
    count: query.data ?? 0,
    ...query,
  };
}
