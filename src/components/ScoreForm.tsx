import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Score {
  team1: string;
  team2: string;
}

interface ScoreFormProps {
  onBack: () => void;
  scores: Score[];
  setScores: (scores: Score[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
}

export const ScoreForm = ({
  onBack,
  scores,
  setScores,
  onSubmit,
  isSubmitting = false,
}: ScoreFormProps) => {
  const handleScoreChange = (index: number, team: 'team1' | 'team2', value: string) => {
    const newScores = [...scores];
    newScores[index] = {
      ...newScores[index],
      [team]: value
    };
    setScores(newScores);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (scores[0].team1 === scores[0].team2) {
      toast.error("Scores cannot be equal - there must be a winner!");
      return;
    }
    
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="score1">Team 1 Score</Label>
          <Input
            id="score1"
            type="number"
            inputMode="numeric"
            placeholder="0"
            value={scores[0].team1}
            onChange={(e) => handleScoreChange(0, 'team1', e.target.value)}
            min="0"
            max="99"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="score2">Team 2 Score</Label>
          <Input
            id="score2"
            type="number"
            inputMode="numeric"
            placeholder="0"
            value={scores[0].team2}
            onChange={(e) => handleScoreChange(0, 'team2', e.target.value)}
            min="0"
            max="99"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onBack}
          disabled={isSubmitting}
        >
          Start Over
        </Button>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register Match"}
        </Button>
      </div>
    </form>
  );
};