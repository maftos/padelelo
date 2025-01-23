import { PlayerSelect } from "./PlayerSelect";
import { Separator } from "@/components/ui/separator";

interface TeamSelectProps {
  teamNumber: number;
  player1Value: string;
  player2Value: string;
  onPlayer1Change: (value: string) => void;
  onPlayer2Change: (value: string) => void;
  players: Array<{ id: string; name: string; }>;
}

export const TeamSelect = ({
  teamNumber,
  player1Value,
  player2Value,
  onPlayer1Change,
  onPlayer2Change,
  players,
}: TeamSelectProps) => {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-lg">Team {teamNumber}</h3>
      <div className="grid grid-cols-2 gap-4 items-start">
        <PlayerSelect
          label="Left"
          value={player1Value}
          onChange={onPlayer1Change}
          players={players}
        />
        <PlayerSelect
          label="Right"
          value={player2Value}
          onChange={onPlayer2Change}
          players={players}
        />
      </div>
    </div>
  );
};