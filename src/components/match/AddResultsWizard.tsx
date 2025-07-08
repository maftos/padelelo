import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Users } from "lucide-react";
import { MatchupSelectionStep } from "./MatchupSelectionStep";
import { ScoreEntryStep } from "./ScoreEntryStep";
import { ResultsCart } from "./ResultsCart";
import { useAddResults } from "@/hooks/match/use-add-results";

interface QueuedResult {
  id: string;
  team1: [string, string];
  team2: [string, string];
  team1Score: number;
  team2Score: number;
}

interface SelectedMatchup {
  id: string;
  team1: [string, string];
  team2: [string, string];
  order: number;
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
  const [currentStep, setCurrentStep] = useState<"selection" | "scoring" | "preview">("selection");
  const [selectedMatchups, setSelectedMatchups] = useState<SelectedMatchup[]>([]);
  const [queuedResults, setQueuedResults] = useState<QueuedResult[]>([]);
  const {
    matchups,
    setMatchups,
    submitResults,
    isSubmitting
  } = useAddResults(matchId);

  const handleMatchupSelect = (matchup: { id: string; team1: [string, string]; team2: [string, string] }) => {
    const order = selectedMatchups.length + 1;
    setSelectedMatchups(prev => [...prev, { ...matchup, order }]);
  };

  const handleAddResult = (result: QueuedResult) => {
    setQueuedResults(prev => [...prev, result]);
    
    // Check if all scores are entered
    if (queuedResults.length + 1 >= selectedMatchups.length) {
      setCurrentStep("preview");
    }
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

  const goToNextStep = () => {
    if (currentStep === "selection" && selectedMatchups.length > 0) {
      setCurrentStep("scoring");
    }
  };

  const goToPreviousStep = () => {
    if (currentStep === "scoring") {
      setCurrentStep("selection");
      setQueuedResults([]);
    } else if (currentStep === "preview") {
      setCurrentStep("scoring");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Add Match Results</h1>
          <p className="text-sm text-muted-foreground">
            {currentStep === "selection" && "Select which matchups were played in order"}
            {currentStep === "scoring" && "Enter scores for each matchup"}
            {currentStep === "preview" && "Review and save your results"}
          </p>
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {currentStep === "selection" && (
            <MatchupSelectionStep
              players={players}
              selectedMatchups={selectedMatchups}
              onMatchupSelect={handleMatchupSelect}
            />
          )}
          
          {currentStep === "scoring" && (
            <ScoreEntryStep
              players={players}
              selectedMatchups={selectedMatchups}
              onAddResult={handleAddResult}
            />
          )}
          
          {currentStep === "preview" && (
            <ResultsCart
              queuedResults={queuedResults}
              players={players}
              onRemoveResult={handleRemoveResult}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between">
            <Button
              onClick={currentStep === "selection" ? onClose : goToPreviousStep}
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {currentStep === "selection" ? "Cancel" : "Back"}
            </Button>

            {currentStep === "selection" && (
              <Button
                onClick={goToNextStep}
                disabled={selectedMatchups.length === 0}
                size="lg"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
            
            {currentStep === "preview" && (
              <Button
                onClick={handleSubmit}
                disabled={queuedResults.length === 0 || isSubmitting}
                size="lg"
              >
                <Users className="h-4 w-4 mr-2" />
                {isSubmitting ? "Saving..." : "Save Results"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};