import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { MatchupsStep } from "./MatchupsStep";
import { useAddResults } from "@/hooks/match/use-add-results";

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
  const {
    matchups,
    setMatchups,
    submitResults,
    isSubmitting
  } = useAddResults(matchId);

  const handleSubmit = async () => {
    const success = await submitResults();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">Add Match Results</h2>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Available Matchups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MatchupsStep
            players={players}
            matchups={matchups}
            onMatchupsChange={setMatchups}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
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
          disabled={matchups.length === 0 || isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Results"}
        </Button>
      </div>
    </div>
  );
};