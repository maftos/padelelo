import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

interface PlayerOption {
  id: string;
  name: string;
}

interface PartnerSelectProps {
  players: PlayerOption[];
  selectedPartner: string | null;
  onPartnerSelect: (playerId: string) => void;
}

export const PartnerSelect: React.FC<PartnerSelectProps> = ({
  players,
  selectedPartner,
  onPartnerSelect,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {players.map((player) => (
        <Card
          key={player.id}
          className={`p-4 cursor-pointer transition-all ${
            selectedPartner === player.id
              ? "ring-2 ring-primary"
              : "hover:bg-accent"
          }`}
          onClick={() => onPartnerSelect(player.id)}
        >
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="h-16 w-16">
              <AvatarImage src="" alt={player.name} />
              <AvatarFallback>
                {player.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{player.name}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};