import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface PlayerOption {
  id: string;
  name: string;
  profile_photo?: string;
  current_mmr?: number;
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {players.map((player) => {
        const isSelected = selectedPlayers.includes(player.id);
        const isCurrentUser = player.id === currentUserProfile?.id;
        const profilePhoto = isCurrentUser ? currentUserProfile?.profile_photo : player.profile_photo;
        const isDisabled = isCurrentUser || (!isSelected && maxPlayersSelected);

        return (
          <Card
            key={player.id}
            className={cn(
              "p-4 transition-all",
              isSelected
                ? "ring-2 ring-primary bg-accent shadow-md"
                : "hover:shadow-md",
              isDisabled && !isSelected && "opacity-50 cursor-not-allowed",
              isCurrentUser && "cursor-default"
            )}
            onClick={() => {
              if (!isDisabled || isSelected) {
                onPlayerSelect(player.id);
              }
            }}
          >
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profilePhoto || ""} alt={player.name} />
                <AvatarFallback>
                  {player.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-center">
                <span className="font-medium text-center">{player.name}</span>
                {player.current_mmr && (
                  <span className="text-sm text-muted-foreground">
                    MMR: {player.current_mmr}
                  </span>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};