
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { PageContainer } from "@/components/layouts/PageContainer";
import { PageHeader } from "@/components/match/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Navigation } from "@/components/Navigation";

interface Tournament {
  tournament_id: string;
  name: string;
  description: string;
  date: [string, string];
  status: string;
  venue_id: string;
  recommended_mmr: number;
  interested_count: number;
  is_user_interested: boolean;
}

export default function Tournaments() {
  const { data: tournaments, isLoading } = useQuery({
    queryKey: ['tournaments'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('view_tournaments');
      if (error) throw error;
      return data as unknown as Tournament[];
    }
  });

  return (
    <>
      <Navigation />
      <PageContainer>
        <div className="flex justify-between items-center mb-6">
          <PageHeader title="Tournaments" description="View upcoming tournaments" />
          <Link to="/tournament/create-tournament">
            <Button>Create Tournament</Button>
          </Link>
        </div>

        {isLoading ? (
          <div>Loading tournaments...</div>
        ) : (
          <div className="grid gap-4">
            {tournaments?.map((tournament) => (
              <Link key={tournament.tournament_id} to={`/tournaments/${tournament.tournament_id}`}>
                <Card className="transition-all hover:bg-accent">
                  <CardHeader>
                    <CardTitle>{tournament.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{tournament.description}</p>
                      <p className="text-sm">
                        {format(new Date(tournament.date[0]), 'PPP')} - {format(new Date(tournament.date[1]), 'PPP')}
                      </p>
                      <p className="text-sm">Recommended MMR: {tournament.recommended_mmr}</p>
                      <p className="text-sm">{tournament.interested_count} interested players</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </PageContainer>
    </>
  );
}
