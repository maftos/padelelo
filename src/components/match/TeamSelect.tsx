import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface PlayerOption {
  id: string;
  name: string;
}

interface TeamSelectProps {
  players: PlayerOption[];
  selectedPlayers: string[];
  onPlayerSelect: (playerId: string) => void;
}

export const TeamSelect: React.FC<TeamSelectProps> = ({
  players,
  selectedPlayers,
  onPlayerSelect,
}) => {
  return (
    <div className="space-y-4">
      <RadioGroup
        onValueChange={onPlayerSelect}
        className="space-y-2"
      >
        {players.map((player) => {
          const isSelected = selectedPlayers.includes(player.id);
          const isDisabled = selectedPlayers.length >= 3 && !isSelected;

          return (
            <div key={player.id} className="flex items-center space-x-2">
              <RadioGroupItem
                value={player.id}
                id={player.id}
                disabled={isDisabled}
                checked={isSelected}
              />
              <Label
                htmlFor={player.id}
                className={`flex items-center space-x-2 ${
                  isDisabled ? "opacity-50" : ""
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={player.name} />
                  <AvatarFallback>
                    {player.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{player.name}</span>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};