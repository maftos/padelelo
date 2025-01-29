import { Tournament } from "@/types/tournament";

export const sampleTournaments: Tournament[] = [
  {
    id: "t1",
    title: "Mauritius Open 2024",
    description: "The premier padel tournament in Mauritius featuring the island's top players.",
    startDate: "2024-04-15",
    endDate: "2024-04-20",
    location: "Belle Mare Padel Club",
    status: "PENDING",
    prizePool: "Rs 50,000",
    maxTeams: 16,
    registeredTeams: 10,
    organizer: {
      name: "Mauritius Padel Federation",
      contact: "federation@mrupadelelo.com"
    }
  },
  {
    id: "t2",
    title: "Corporate Challenge Cup",
    description: "Inter-company tournament bringing together corporate teams.",
    startDate: "2024-03-01",
    endDate: "2024-03-03",
    location: "Flic en Flac Padel Center",
    status: "IN_PROGRESS",
    prizePool: "Rs 25,000",
    maxTeams: 8,
    registeredTeams: 8,
    organizer: {
      name: "Corporate Sports League",
      contact: "corporate@mrupadelelo.com"
    }
  },
  {
    id: "t3",
    title: "Summer Championship 2024",
    description: "Annual summer championship with divisions for all skill levels.",
    startDate: "2024-01-10",
    endDate: "2024-01-15",
    location: "Grand Baie Padel Academy",
    status: "COMPLETED",
    prizePool: "Rs 35,000",
    maxTeams: 12,
    registeredTeams: 12,
    organizer: {
      name: "PadelELO Events",
      contact: "events@mrupadelelo.com"
    }
  }
];