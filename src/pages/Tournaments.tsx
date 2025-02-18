
import { Link } from "react-router-dom";
import { PageContainer } from "@/components/layouts/PageContainer";
import { PageHeader } from "@/components/match/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Navigation } from "@/components/Navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

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
  user_interest: 'INTERESTED' | 'NOT_INTERESTED' | null;
  main_photo: string;
  admin_display_name: string;
  admin_profile_photo: string;
}

// Sample data for UI development
const sampleTournaments: Tournament[] = [
  {
    tournament_id: "1",
    name: "Summer Championship 2024",
    description: "Join us for an exciting summer tournament with players from all skill levels. Great prizes and networking opportunities await!",
    start_date: "2024-06-01",
    end_date: "2024-06-03",
    status: "UPCOMING",
    venue_id: "venue1",
    recommended_mmr: 2000,
    interested_count: 42,
    user_interest: "INTERESTED",
    main_photo: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    admin_display_name: "John Doe",
    admin_profile_photo: "",
  },
  {
    tournament_id: "2",
    name: "Weekly Tournament",
    description: "Our regular weekly tournament for all players. Come join us for some competitive matches!",
    start_date: "2024-03-15",
    end_date: null,
    status: "UPCOMING",
    venue_id: "venue2",
    recommended_mmr: 1500,
    interested_count: 28,
    user_interest: null,
    main_photo: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    admin_display_name: "Jane Smith",
    admin_profile_photo: "",
  },
  {
    tournament_id: "3",
    name: "Pro League Qualifiers",
    description: "Qualify for the upcoming Pro League season. High-level competition expected.",
    start_date: "2024-04-20",
    end_date: "2024-04-22",
    status: "UPCOMING",
    venue_id: "venue3",
    recommended_mmr: 2500,
    interested_count: 56,
    user_interest: "NOT_INTERESTED",
    main_photo: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    admin_display_name: "Mike Johnson",
    admin_profile_photo: "",
  },
];

export default function Tournaments() {
  const formatTournamentDate = (startDate: string, endDate: string | null) => {
    try {
      const formattedStartDate = format(new Date(startDate), 'PPP');
      
      if (endDate) {
        const formattedEndDate = format(new Date(endDate), 'PPP');
        return `${formattedStartDate} - ${formattedEndDate}`;
      }
      
      return formattedStartDate;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleTournaments.map((tournament) => (
            <div key={tournament.tournament_id} className="relative">
              <Link to={`/tournaments/${tournament.tournament_id}`}>
                <Card className="transition-all hover:bg-accent h-full">
                  <div className="relative h-48 w-full">
                    <img
                      src={tournament.main_photo || '/placeholder.svg'}
                      alt={tournament.name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start gap-4">
                      <span>{tournament.name}</span>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={tournament.admin_profile_photo} />
                          <AvatarFallback>
                            {tournament.admin_display_name?.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">{tournament.description}</p>
                      <p className="text-sm font-medium">
                        {formatTournamentDate(tournament.start_date, tournament.end_date)}
                      </p>
                      <div className="flex justify-between items-center text-sm">
                        <span>MMR: {tournament.recommended_mmr}</span>
                        <span>{tournament.interested_count} interested</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <div className="absolute bottom-4 right-4 z-10">
                <Button
                  variant={tournament.user_interest === 'INTERESTED' ? "secondary" : "default"}
                  size="sm"
                  className="gap-2"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Interest toggled for tournament:', tournament.tournament_id);
                  }}
                >
                  <Star className={tournament.user_interest === 'INTERESTED' ? "fill-current" : ""} />
                  Interested
                </Button>
              </div>
            </div>
          ))}
        </div>
      </PageContainer>
    </>
  );
}
