import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ScoreFormProps {
  onBack: () => void;
  player1Score: string;
  player2Score: string;
  setPlayer1Score: (score: string) => void;
  setPlayer2Score: (score: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ScoreForm = ({
  onBack,
  player1Score,
  player2Score,
  setPlayer1Score,
  setPlayer2Score,
  onSubmit,
}: ScoreFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="score1">Team 1 Score</Label>
          <Input
            id="score1"
            type="number"
            placeholder="0"
            value={player1Score}
            onChange={(e) => setPlayer1Score(e.target.value)}
            min="0"
            max="99"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="score2">Team 2 Score</Label>
          <Input
            id="score2"
            type="number"
            placeholder="0"
            value={player2Score}
            onChange={(e) => setPlayer2Score(e.target.value)}
            min="0"
            max="99"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onBack}
        >
          Back
        </Button>
        <Button type="submit" className="w-full">
          Register Match
        </Button>
      </div>
    </form>
  );
};