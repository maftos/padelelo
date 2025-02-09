
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TeamFormationStepProps {
  players: string[];
  getPlayerName: (id: string) => string;
  getPlayerPhoto: (id: string) => string;
  onPlayerSelect: (playerId: string) => void;
  selectedPartnerId: string | undefined;
  onBack: () => void;
  isCalculating: boolean;
}

export const TeamFormationStep = ({
  players,
  getPlayerName,
  getPlayerPhoto,
  onPlayerSelect,
  selectedPartnerId,
  onBack,
  isCalculating
}: TeamFormationStepProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {players.map((playerId) => {
          const isSelected = selectedPartnerId === playerId;
          return (
            <Card
              key={playerId}
              className={`p-4 cursor-pointer transition-all ${
                isSelected ? "bg-primary/10 ring-2 ring-primary" : "hover:shadow-md"
              } ${isCalculating ? "opacity-50 pointer-events-none" : ""}`}
              onClick={() => onPlayerSelect(playerId)}
            >
              <div className="flex flex-col items-center space-y-3">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={getPlayerPhoto(playerId)}
                    alt={getPlayerName(playerId)}
                  />
                  <AvatarFallback>
                    {getPlayerName(playerId).substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-center">
                  {getPlayerName(playerId)}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onBack}
          size="sm"
        >
          Back
        </Button>
      </div>
    </div>
  );
};
