
import { Tournament } from "@/types/tournament";

export const sampleTournaments: Tournament[] = [
  {
    id: "1",
    title: "Summer Slam Tournament",
    description: "Annual summer tournament featuring top players",
    startDate: "2024-07-15",
    endDate: "2024-07-16",
    location: "Central Sports Complex",
    status: "STARTED",
    prizePool: "$1000",
    maxTeams: 16,
    registeredTeams: 8,
    organizer: {
      name: "John Smith",
      contact: "john@example.com",
    },
  },
  {
    id: "2",
    title: "Winter Championship",
    description: "Winter championship with exciting prizes",
    startDate: "2024-12-10",
    endDate: "2024-12-12",
    location: "Indoor Sports Arena",
    status: "PENDING",
    prizePool: "$2000",
    maxTeams: 32,
    registeredTeams: 16,
    organizer: {
      name: "Sarah Johnson",
      contact: "sarah@example.com",
    },
  },
];
