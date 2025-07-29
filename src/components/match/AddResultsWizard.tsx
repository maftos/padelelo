
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Users } from "lucide-react";
import { MatchupSelectionStep } from "./MatchupSelectionStep";
import { ScoreEntryStep } from "./ScoreEntryStep";
import { ResultsCart } from "./ResultsCart";
import { MatchupProgressOverview } from "./MatchupProgressOverview";
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
  matchNumber: number; // New field to track which match number this is
}

interface AddResultsWizardProps {
  bookingId: string;
  players: {
    id: string;
    name: string;
    photo?: string;
  }[];
  onClose: () => void;
}

export const AddResultsWizard = ({ bookingId, players, onClose }: AddResultsWizardProps) => {
  const [currentStep, setCurrentStep] = useState<"selection" | "scoring" | "preview">("selection");
  const [selectedMatchups, setSelectedMatchups] = useState<SelectedMatchup[]>([]);
  const [queuedResults, setQueuedResults] = useState<QueuedResult[]>([]);
  
  // Get current user ID - assuming the first player in the list is the current user
  // In a real implementation, this would come from auth context
  const currentUserId = players[0]?.id || '';
  
  const {
    matchups,
    setMatchups,
    submitResults,
    isSubmitting
  } = useAddResults(bookingId, currentUserId);
  const [currentMatchupIndex, setCurrentMatchupIndex] = useState(0);

  const handleMatchupSelect = (matchup: { id: string; team1: [string, string]; team2: [string, string] }) => {
    // Use unified counter - the order is based on total number of matches selected
    const order = selectedMatchups.length + 1;
    
    // Count how many times this specific matchup has been selected for the matchNumber
    const existingCount = selectedMatchups.filter(m => m.id === matchup.id).length;
    const matchNumber = existingCount + 1;
    
    setSelectedMatchups(prev => [...prev, { ...matchup, order, matchNumber }]);
  };

  const handleAddResult = (result: QueuedResult) => {
    setQueuedResults(prev => [...prev, result]);
    
    // Check if all scores are entered
    if (queuedResults.length + 1 >= selectedMatchups.length) {
      setCurrentStep("preview");
    } else {
      // Move to next incomplete matchup
      const nextIndex = currentMatchupIndex + 1;
      if (nextIndex < selectedMatchups.length) {
        setCurrentMatchupIndex(nextIndex);
      }
    }
  };

  const handleRemoveResult = (resultId: string) => {
    setQueuedResults(prev => prev.filter(r => r.id !== resultId));
  };

  const handleJumpToMatchup = (index: number) => {
    if (currentStep === "scoring" || currentStep === "preview") {
      setCurrentMatchupIndex(index);
      if (currentStep === "preview") {
        setCurrentStep("scoring");
      }
    }
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
    const success = await submitResults(matchupsFromQueue);
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
      setCurrentMatchupIndex(0);
    } else if (currentStep === "preview") {
      setCurrentStep("selection");
      setQueuedResults([]);
      setCurrentMatchupIndex(0);
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

      {/* Progress Overview - Show only in scoring step, not in preview */}
      {currentStep === "scoring" && (
        <MatchupProgressOverview
          players={players}
          selectedMatchups={selectedMatchups}
          queuedResults={queuedResults}
          currentIndex={currentMatchupIndex}
          onMatchupClick={handleJumpToMatchup}
        />
      )}

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
              currentIndex={currentMatchupIndex}
              onAddResult={handleAddResult}
              onIndexChange={setCurrentMatchupIndex}
            />
          )}
          
          {currentStep === "preview" && (
            <ResultsCart
              queuedResults={queuedResults}
              players={players}
              selectedMatchups={selectedMatchups}
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
