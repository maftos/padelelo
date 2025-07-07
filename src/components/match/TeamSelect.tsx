
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

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
  const maxPlayersSelected = selectedPlayers.length >= 4;

  return (
    <div className="space-y-1">
      {players.map((player) => {
        const isSelected = selectedPlayers.includes(player.id);
        const isCurrentUser = player.id === currentUserProfile?.id;
        const profilePhoto = isCurrentUser ? currentUserProfile?.profile_photo : player.profile_photo;
        const isDisabled = isCurrentUser || (!isSelected && maxPlayersSelected);

        return (
          <Card
            key={player.id}
            className={cn(
              "p-3 transition-all cursor-pointer",
              isSelected
                ? "ring-2 ring-primary bg-accent shadow-md"
                : "hover:shadow-md hover:bg-accent/50",
              isDisabled && !isSelected && "opacity-50 cursor-not-allowed",
              isCurrentUser && "cursor-default"
            )}
            onClick={() => {
              if (!isDisabled || isSelected) {
                onPlayerSelect(player.id);
              }
            }}
          >
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={profilePhoto || ""} alt={player.name} />
                <AvatarFallback>
                  {player.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <span className="font-medium text-sm">{player.name}</span>
              </div>
              {isSelected && (
                <div className="w-2 h-2 bg-primary rounded-full" />
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};
