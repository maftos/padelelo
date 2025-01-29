import { PageContainer } from "@/components/layouts/PageContainer";
import { PageHeader } from "@/components/match/PageHeader";
import { sampleTournaments } from "@/data/sampleTournaments";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Trophy, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const statusColors = {
  PENDING: "bg-yellow-500/10 text-yellow-500",
  IN_PROGRESS: "bg-green-500/10 text-green-500",
  COMPLETED: "bg-blue-500/10 text-blue-500",
};

const tournamentImages = [
  "/lovable-uploads/53adfa7a-da8e-47cc-92b3-333428670467.png",
  "/lovable-uploads/6d42bdae-d2d8-4c11-8c04-32104792c127.png",
  "/lovable-uploads/ea8dc7fb-5ec2-46e7-b1a5-976716dd832a.png",
  "/lovable-uploads/b0769f6f-387a-44ca-bd10-b9cadc7f2d8f.png"
];

export default function Tournaments() {
  return (
    <PageContainer className="max-w-7xl">
      <PageHeader 
        title="Tournaments" 
        description="Browse upcoming and ongoing padel tournaments in Mauritius"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleTournaments.map((tournament, index) => (
          <Link 
            key={tournament.id} 
            to={`/tournaments/${tournament.id}`}
            className="block transition-transform hover:scale-[1.01]"
          >
            <Card className="h-full">
              <CardHeader className="pb-2">
                <AspectRatio ratio={16/9} className="bg-muted rounded-lg overflow-hidden mb-4">
                  <img 
                    src={tournamentImages[index % tournamentImages.length]} 
                    alt={tournament.title}
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>
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