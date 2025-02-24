
import { Badge } from "@/components/ui/badge";

export type TournamentStatus = 'INCOMPLETE' | 'PENDING' | 'STARTED' | 'COMPLETED' | 'DELETED';

interface TournamentStatusBadgeProps {
  status: string;  // Changed from TournamentStatus to string
}

const getStatusStyles = (status: string) => {  // Changed from TournamentStatus to string
  switch (status as TournamentStatus) {
    case 'INCOMPLETE':
      return 'bg-red-500 hover:bg-red-600';
    case 'PENDING':
      return 'bg-yellow-500 hover:bg-yellow-600';
    case 'STARTED':
      return 'bg-blue-500 hover:bg-blue-600';
    case 'COMPLETED':
    case 'DELETED':
      return 'bg-gray-500 hover:bg-gray-600';
    default:
      return 'bg-gray-500 hover:bg-gray-600';
  }
};

export function TournamentStatusBadge({ status }: TournamentStatusBadgeProps) {
  return (
    <Badge className={`${getStatusStyles(status)} text-white`}>
      {status}
    </Badge>
  );
}
