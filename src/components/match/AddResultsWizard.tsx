
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

import { MatchupSelectionStep } from "./MatchupSelectionStep";
import { ScoreEntryStep } from "./ScoreEntryStep";
import { ResultsCart } from "./ResultsCart";
import { MatchupProgressOverview } from "./MatchupProgressOverview";
import { useAddResults } from "@/hooks/match/use-add-results";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  
  // Get current user ID from auth context
  const currentUserId = user?.id || '';
  
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
    <div className="container max-w-full sm:max-w-4xl mx-auto px-3 sm:px-4 pt-2 sm:pt-4 pb-24 sm:pb-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h1 className="text-xl md:text-2xl font-bold">Add Match Results</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            {currentStep === "selection" && "Select which matchups were played in order"}
            {currentStep === "scoring" && "Enter scores for each matchup"}
            {currentStep === "preview" && "Review and save your results"}
          </p>
        </div>
      </div>

      {/* Step Content */}
      {currentStep === "selection" && (
        <MatchupSelectionStep
          players={players}
          selectedMatchups={selectedMatchups}
          onMatchupSelect={handleMatchupSelect}
        />
      )}
      
      {currentStep === "scoring" && (
        <Card className="mb-20 md:mb-4">
          <CardContent className="p-3 md:p-6">
            <ScoreEntryStep
              players={players}
              selectedMatchups={selectedMatchups}
              currentIndex={currentMatchupIndex}
              onAddResult={handleAddResult}
              onIndexChange={setCurrentMatchupIndex}
            />
          </CardContent>
        </Card>
      )}
      
      {currentStep === "preview" && (
        <Card className="mb-20 md:mb-4">
          <CardContent className="p-3 md:p-6">
            <ResultsCart
              queuedResults={queuedResults}
              players={players}
              selectedMatchups={selectedMatchups}
              onRemoveResult={handleRemoveResult}
            />
          </CardContent>
        </Card>
      )}

      {/* Navigation - Fixed at bottom on mobile */}
      <div className="fixed bottom-0 left-0 right-0 md:relative md:bottom-auto bg-background border-t md:border-t-0 p-4 md:p-0 z-10">
        <Card className="border-0 md:border shadow-none md:shadow-sm">
          <CardContent className="p-0 md:p-6">
            <div className="flex items-center gap-3">
              <Button
                onClick={currentStep === "selection" ? onClose : goToPreviousStep}
                variant="outline"
                size="lg"
                className="flex-shrink-0 h-12"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              {currentStep === "selection" && (
                <Button
                  onClick={goToNextStep}
                  disabled={selectedMatchups.length === 0}
                  size="lg"
                  className="flex-1 h-12 rounded-lg font-medium transition-all duration-200"
                >
                  Next
                </Button>
              )}

              {currentStep === "scoring" && (
                <Button
                  onClick={() => {
                    // Check if all scores are entered
                    if (queuedResults.length >= selectedMatchups.length) {
                      setCurrentStep("preview");
                    }
                  }}
                  disabled={queuedResults.length < selectedMatchups.length}
                  size="lg"
                  className="flex-1 h-12 rounded-lg font-medium transition-all duration-200"
                >
                  Next
                </Button>
              )}
              
              {currentStep === "preview" && (
                <Button
                  onClick={handleSubmit}
                  disabled={queuedResults.length === 0 || isSubmitting}
                  size="lg"
                  className="flex-1 h-12 rounded-lg font-medium transition-all duration-200"
                >
                  {isSubmitting ? "Saving..." : "Save Results"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
