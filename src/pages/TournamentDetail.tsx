
import { useParams } from "react-router-dom";
import { PageContainer } from "@/components/layouts/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { Navigation } from "@/components/Navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Trophy, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Tournament {
  tournament_id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string | null;
  status: string;
  venue_id: string;
  recommended_mmr: number;
  interested_count: number;
  is_user_interested: boolean;
  main_photo: string;
  admin_display_name: string;
  admin_profile_photo: string;
  venue_name: string;
  venue_location: [number, number];
  total_participants: number;
  max_participants: number;
  confirmed_participants: number;
  format: {
    name: string;
    description: string;
    rules_image: string;
  };
}

// Sample user data for the participants list
const sampleUsers = [
  {
    id: "1",
    display_name: "John Smith",
    profile_photo: "",
    mutual_friends_count: 16,
    mutual_friends: [
      { id: "mf1", profile_photo: "" },
      { id: "mf2", profile_photo: "" },
      { id: "mf3", profile_photo: "" },
    ]
  },
  {
    id: "2",
    display_name: "Sarah Johnson",
    profile_photo: "",
    mutual_friends_count: 8,
    mutual_friends: [
      { id: "mf4", profile_photo: "" },
      { id: "mf5", profile_photo: "" },
    ]
  },
  // Add more sample users as needed
];

// Sample data for UI development
const sampleTournament: Tournament = {
  tournament_id: "1",
  name: "Summer Championship 2024",
  description: "Join us for an exciting summer tournament with players from all skill levels. Great prizes and networking opportunities await!",
  start_date: "2024-06-01",
  end_date: "2024-06-03",
  status: "UPCOMING",
  venue_id: "venue1",
  recommended_mmr: 2000,
  interested_count: 42,
  is_user_interested: true,
  main_photo: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
  admin_display_name: "John Doe",
  admin_profile_photo: "",
  venue_name: "Sports Complex Alpha",
  venue_location: [1.3521, 103.8198],
  total_participants: 32,
  max_participants: 16,
  confirmed_participants: 13,
  format: {
    name: "Mexicano",
    description: "A dynamic tournament format that ensures competitive matches throughout.",
    rules_image: "/lovable-uploads/ac20dcc5-9cfb-456e-a4ea-e0d7772672c4.png"
  }
};

export default function TournamentDetail() {
  const { tournamentId } = useParams();

  const formatTournamentDate = (startDate: string, endDate: string | null) => {
    try {
      if (!startDate) return "TBD";
      const formattedStartDate = format(parseISO(startDate), 'PPP');
      
      if (endDate) {
        const formattedEndDate = format(parseISO(endDate), 'PPP');
        return `${formattedStartDate} - ${formattedEndDate}`;
      }
      
      return formattedStartDate;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const handleToggleInterest = () => {
    console.log('Toggle interest for tournament:', tournamentId);
    toast.success("Interest updated successfully");
  };

  if (!sampleTournament) return <div>Tournament not found</div>;

  return (
    <>
      <Navigation />
      <PageContainer>
        <div className="relative h-64 -mx-4 sm:-mx-6 mb-6">
          <img
            src={sampleTournament.main_photo || '/placeholder.svg'}
            alt={sampleTournament.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-background/0" />
        </div>

        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{sampleTournament.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={sampleTournament.admin_profile_photo} />
                  <AvatarFallback>
                    {sampleTournament.admin_display_name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-muted-foreground">
                  Organized by {sampleTournament.admin_display_name}
                </span>
              </div>
            </div>
            <Button 
              variant={sampleTournament.is_user_interested ? "secondary" : "default"}
              onClick={handleToggleInterest}
              className="shrink-0"
            >
              {sampleTournament.is_user_interested ? "Remove Interest" : "I'm Interested"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tournament Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">{sampleTournament.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <span>{formatTournamentDate(sampleTournament.start_date, sampleTournament.end_date)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <span>{sampleTournament.venue_name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-muted-foreground" />
                      <span>Recommended MMR: {sampleTournament.recommended_mmr}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span>{sampleTournament.confirmed_participants} confirmed out of {sampleTournament.max_participants} slots • {sampleTournament.interested_count} interested</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Map view coming soon</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tournament Format - {sampleTournament.format.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">{sampleTournament.format.description}</p>
                  <img 
                    src={sampleTournament.format.rules_image} 
                    alt="Tournament Rules" 
                    className="w-full rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Participants</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="interested" className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="interested" className="flex-1">Interested ({sampleTournament.interested_count})</TabsTrigger>
                    <TabsTrigger value="participating" className="flex-1">Participating ({sampleTournament.confirmed_participants})</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="interested" className="space-y-4">
                    {sampleUsers.map(user => (
                      <div key={user.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.profile_photo} />
                          <AvatarFallback>{user.display_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{user.display_name}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{user.mutual_friends_count} mutual friends</span>
                            <div className="flex -space-x-2">
                              {user.mutual_friends.slice(0, 3).map((friend, index) => (
                                <Avatar key={friend.id} className="h-6 w-6 border-2 border-background">
                                  <AvatarImage src={friend.profile_photo} />
                                  <AvatarFallback>MF</AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="participating" className="space-y-4">
                    {sampleUsers.slice(0, 2).map(user => (
                      <div key={user.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.profile_photo} />
                          <AvatarFallback>{user.display_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{user.display_name}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{user.mutual_friends_count} mutual friends</span>
                            <div className="flex -space-x-2">
                              {user.mutual_friends.slice(0, 3).map((friend, index) => (
                                <Avatar key={friend.id} className="h-6 w-6 border-2 border-background">
                                  <AvatarImage src={friend.profile_photo} />
                                  <AvatarFallback>MF</AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
