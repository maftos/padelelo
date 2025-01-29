import { useParams } from "react-router-dom";
import { PageContainer } from "@/components/layouts/PageContainer";
import { PageHeader } from "@/components/match/PageHeader";
import { sampleTournaments } from "@/data/sampleTournaments";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Trophy, Users, Image as ImageIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      
      <div className="space-y-6">
        {/* Tournament Banner */}
        <AspectRatio ratio={21/9} className="bg-muted rounded-lg overflow-hidden">
          <img 
            src="/lovable-uploads/04e56511-999f-4c17-b7f5-0b050bfb0722.png" 
            alt={tournament.title}
            className="object-cover w-full h-full"
          />
        </AspectRatio>

        {/* Tournament Info Card */}
        <Card>
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

        {/* Tournament Content Tabs */}
        <Tabs defaultValue="bracket" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bracket">Bracket</TabsTrigger>
            <TabsTrigger value="players">Players</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="bracket" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <ScrollArea className="w-full overflow-x-auto">
                  <div className="min-w-[1000px] p-4">
                    <img 
                      src="/lovable-uploads/04e56511-999f-4c17-b7f5-0b050bfb0722.png" 
                      alt="Tournament Bracket"
                      className="w-full"
                    />
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="players" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Registered Teams</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Sample Players List - Replace with actual data */}
                  {Array.from({length: 4}).map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10" />
                        <div>
                          <p className="font-medium">Team {index + 1}</p>
                          <p className="text-sm text-muted-foreground">MMR: 3000</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Registered</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Tournament Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Array.from({length: 6}).map((_, index) => (
                    <AspectRatio key={index} ratio={1} className="bg-muted rounded-lg overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </AspectRatio>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}