import { useParams } from "react-router-dom";
import { PageContainer } from "@/components/layouts/PageContainer";
import { sampleTournaments } from "@/data/sampleTournaments";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Trophy, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TournamentDetail() {
  const { id } = useParams();
  const tournament = sampleTournaments.find((t) => t.id === id);

  if (!tournament) {
    return <div>Tournament not found</div>;
  }

  return (
    <PageContainer className="max-w-7xl">
      <div className="space-y-6">
        {/* Tournament Header */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4">
              <Badge className="w-fit" variant="secondary">
                {tournament.status}
              </Badge>
              <CardTitle className="text-2xl md:text-3xl">
                {tournament.title}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(tournament.startDate).toLocaleDateString()} -{" "}
                  {new Date(tournament.endDate).toLocaleDateString()}
                </span>
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
                <span>
                  {tournament.registeredTeams} / {tournament.maxTeams} teams
                  registered
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tournament Content */}
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="players">Players</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src="/lovable-uploads/53adfa7a-da8e-47cc-92b3-333428670467.png"
                      alt="Tournament banner"
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </AspectRatio>
                  <p className="text-muted-foreground">
                    {tournament.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="players" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {/* Player list will be implemented here */}
                    <p className="text-muted-foreground">
                      Player list coming soon...
                    </p>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
