export type TournamentStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface Tournament {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  status: TournamentStatus;
  prizePool: string;
  maxTeams: number;
  registeredTeams: number;
  organizer: {
    name: string;
    contact: string;
  };
}