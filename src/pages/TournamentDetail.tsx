import { useParams } from "react-router-dom";
import { PageContainer } from "@/components/layouts/PageContainer";
import { PageHeader } from "@/components/match/PageHeader";
import { sampleTournaments } from "@/data/sampleTournaments";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Trophy, Users } from "lucide-react";

const statusColors = {
  PENDING: "bg-yellow-500/10 text-yellow-500",
  IN_PROGRESS: "bg-green-500/10 text-green-500",
  COMPLETED: "bg-blue-500/10 text-blue-500",
};

export default function TournamentDetail() {
  const { tournamentId } = useParams();
  const tournament = sampleTournaments.find(t => t.id === tournamentId);

  if (!tournament) {
    return (
      <PageContainer>
        <div className="text-center">Tournament not found</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title={tournament.title} />
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Tournament Details</CardTitle>
            <Badge 
              variant="secondary" 
              className={statusColors[tournament.status]}
            >
              {tournament.status.replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">{tournament.description}</p>
            
            <div className="space-y-2">
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

            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-2">Organizer Information</h3>
              <p className="text-sm text-muted-foreground">
                {tournament.organizer.name}<br />
                Contact: {tournament.organizer.contact}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tournament Bracket</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Tournament bracket will be available once the tournament begins
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}