import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Users } from "lucide-react";
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

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: '100%' }}
        />
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          <MatchupsStep
            players={players}
            matchups={matchups}
            onMatchupsChange={setMatchups}
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
              disabled={matchups.length === 0 || isSubmitting}
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