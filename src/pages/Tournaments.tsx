import { PageContainer } from "@/components/layouts/PageContainer";
import { PageHeader } from "@/components/match/PageHeader";
import { sampleTournaments } from "@/data/sampleTournaments";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Trophy, Users } from "lucide-react";
import { Link } from "react-router-dom";

const statusColors = {
  PENDING: "bg-yellow-500/10 text-yellow-500",
  IN_PROGRESS: "bg-green-500/10 text-green-500",
  COMPLETED: "bg-blue-500/10 text-blue-500",
};

export default function Tournaments() {
  return (
    <PageContainer>
      <PageHeader 
        title="Tournaments" 
        description="Browse upcoming and ongoing padel tournaments in Mauritius"
      />

      <div className="space-y-4">
        {sampleTournaments.map((tournament) => (
          <Link 
            key={tournament.id} 
            to={`/tournaments/${tournament.id}`}
            className="block transition-transform hover:scale-[1.01]"
          >
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{tournament.title}</CardTitle>
                  <Badge 
                    variant="secondary" 
                    className={statusColors[tournament.status]}
                  >
                    {tournament.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{tournament.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    <span>Prize Pool: {tournament.prizePool}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{tournament.registeredTeams} / {tournament.maxTeams} teams registered</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
}