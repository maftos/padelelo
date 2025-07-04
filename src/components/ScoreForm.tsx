
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Match Scores</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="score1" className="text-sm font-medium text-foreground">
                Team 1 Score
              </Label>
              <Input
                id="score1"
                type="number"
                inputMode="numeric"
                placeholder="0"
                value={scores[0].team1}
                onChange={(e) => handleScoreChange(0, 'team1', e.target.value)}
                min="0"
                max="99"
                className="text-center text-lg font-semibold"
              />
            </div>
            
            <div className="flex items-center justify-center py-2">
              <div className="text-2xl font-bold text-muted-foreground">VS</div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="score2" className="text-sm font-medium text-foreground">
                Team 2 Score
              </Label>
              <Input
                id="score2"
                type="number"
                inputMode="numeric"
                placeholder="0"
                value={scores[0].team2}
                onChange={(e) => handleScoreChange(0, 'team2', e.target.value)}
                min="0"
                max="99"
                className="text-center text-lg font-semibold"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-11"
              onClick={onBack}
              disabled={isSubmitting}
            >
              Start Over
            </Button>
            <Button 
              type="submit" 
              className="flex-1 h-11" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register Match"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
