import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserProfile } from "@/hooks/use-user-profile";

interface MatchHistory {
  match_id: string;
  user_id: string;
  old_mmr: number;
  change_amount: number;
  change_type: "WIN" | "LOSS";
  created_at: string;
  partner_id: string;
  new_mmr: number;
  status: string;
}

interface UserInfo {
  display_name: string;
  profile_photo: string | null;
}

const Matches = () => {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const { userId } = useUserProfile();

  const { data: matches, isLoading } = useQuery({
    queryKey: ["matches", page, userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase.rpc("get_latest_matches", {
        p_user_id: userId,
        page_number: page,
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load match history",
          variant: "destructive",
        });
        throw error;
      }

      return data as MatchHistory[];
    },
    enabled: !!userId,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Match History</h1>
        <Card className="p-4">
          {isLoading ? (
            <div className="text-center py-8">Loading match history...</div>
          ) : !matches?.length ? (
            <div className="text-center py-8 text-muted-foreground">
              No matches found. Start playing to see your match history!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>New Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matches.map((match) => (
                  <TableRow key={match.match_id}>
                    <TableCell>
                      {format(new Date(match.created_at), "MMM d, yyyy HH:mm")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={match.change_type === "WIN" ? "default" : "destructive"}
                      >
                        {match.change_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          match.change_type === "WIN"
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }
                      >
                        {match.change_type === "WIN" ? "+" : "-"}
                        {Math.abs(match.change_amount)}
                      </span>
                    </TableCell>
                    <TableCell>{match.new_mmr}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </main>
    </div>
  );
};

export default Matches;