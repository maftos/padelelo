
export type TournamentStatus = 'INCOMPLETE' | 'PENDING' | 'COMPLETED' | 'STARTED' | 'DELETED';

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
