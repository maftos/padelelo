import { PlayerSelect } from "./PlayerSelect";

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
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Team {teamNumber}</h3>
      <div className="space-y-4">
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