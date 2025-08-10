import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useOpenBookingsCount() {
  const query = useQuery<number>({
    queryKey: ["open-bookings-count"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("count_open_bookings" as any);
      if (error) throw error;
      return Number(data ?? 0);
    },
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    refetchInterval: 60_000,
  });

  return {
    count: query.data ?? 0,
    ...query,
  };
}
