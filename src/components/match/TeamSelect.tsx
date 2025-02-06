import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PlayerOption {
  id: string;
  name: string;
  profile_photo?: string;
}

interface TeamSelectProps {
  players: PlayerOption[];
  selectedPlayers: string[];
  onPlayerSelect: (playerId: string) => void;
  currentUserProfile?: {
    id: string;
    profile_photo?: string | null;
  };
}

export const TeamSelect: React.FC<TeamSelectProps> = ({
  players,
  selectedPlayers,
  onPlayerSelect,
  currentUserProfile,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {players.map((player) => {
        const isSelected = selectedPlayers.includes(player.id);
        const isCurrentUser = player.id === currentUserProfile?.id;
        const profilePhoto = isCurrentUser ? currentUserProfile?.profile_photo : player.profile_photo;

        return (
          <Card
            key={player.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              isSelected ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => onPlayerSelect(player.id)}
          >
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profilePhoto || ""} alt={player.name} />
                <AvatarFallback>
                  {player.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-center">{player.name}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};