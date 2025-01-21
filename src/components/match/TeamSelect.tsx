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
    <div className="grid grid-cols-2 gap-4">
      <PlayerSelect
        label={`Team ${teamNumber} - Player 1`}
        value={player1Value}
        onChange={onPlayer1Change}
        players={players}
      />
      <PlayerSelect
        label={`Team ${teamNumber} - Player 2`}
        value={player2Value}
        onChange={onPlayer2Change}
        players={players}
      />
    </div>
  );
};