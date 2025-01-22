import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Score {
  team1: string;
  team2: string;
}

interface ScoreFormProps {
  onBack: () => void;
  scores: Score[];
  setScores: (scores: Score[]) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ScoreForm = ({
  onBack,
  scores,
  setScores,
  onSubmit,
}: ScoreFormProps) => {
  const handleScoreChange = (index: number, team: 'team1' | 'team2', value: string) => {
    const newScores = [...scores];
    newScores[index] = {
      ...newScores[index],
      [team]: value
    };
    setScores(newScores);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="score1">Team 1 Score</Label>
          <Input
            id="score1"
            type="number"
            placeholder="0"
            value={scores[0].team1}
            onChange={(e) => handleScoreChange(0, 'team1', e.target.value)}
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
            value={scores[0].team2}
            onChange={(e) => handleScoreChange(0, 'team2', e.target.value)}
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