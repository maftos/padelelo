import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Users } from "lucide-react";
import { MatchupsStep } from "./MatchupsStep";
import { ResultsCart } from "./ResultsCart";
import { useAddResults } from "@/hooks/match/use-add-results";

interface QueuedResult {
  id: string;
  team1: [string, string];
  team2: [string, string];
  team1Score: number;
  team2Score: number;
}

interface AddResultsWizardProps {
  matchId: string;
  players: {
    id: string;
    name: string;
    photo?: string;
  }[];
  onClose: () => void;
}

export const AddResultsWizard = ({ matchId, players, onClose }: AddResultsWizardProps) => {
  const [queuedResults, setQueuedResults] = useState<QueuedResult[]>([]);
  const {
    matchups,
    setMatchups,
    submitResults,
    isSubmitting
  } = useAddResults(matchId);

  const handleAddResult = (result: QueuedResult) => {
    setQueuedResults(prev => [...prev, result]);
  };

  const handleRemoveResult = (resultId: string) => {
    setQueuedResults(prev => prev.filter(r => r.id !== resultId));
  };

  const handleSubmit = async () => {
    // Convert queued results to matchups format for the hook
    const matchupsFromQueue = queuedResults.map(result => ({
      id: result.id,
      team1: result.team1,
      team2: result.team2,
      team1Score: result.team1Score,
      team2Score: result.team2Score
    }));
    
    setMatchups(matchupsFromQueue);
    const success = await submitResults();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Add Match Results</h1>
          <p className="text-sm text-muted-foreground">
            Select which matchups were played and add their scores
          </p>
        </div>
      </div>

      {/* Results Cart */}
      <ResultsCart
        queuedResults={queuedResults}
        players={players}
        onRemoveResult={handleRemoveResult}
      />

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          <MatchupsStep
            players={players}
            matchups={matchups}
            onMatchupsChange={setMatchups}
            queuedResults={queuedResults}
            onAddResult={handleAddResult}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between">
            <Button
              onClick={onClose}
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={queuedResults.length === 0 || isSubmitting}
              size="lg"
            >
              <Users className="h-4 w-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save Results"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};