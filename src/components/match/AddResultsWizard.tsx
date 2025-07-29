
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
    <div className="min-h-screen flex flex-col">
      {/* Mobile-optimized header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg md:text-2xl font-bold">Add Match Results</h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              {currentStep === "selection" && "Select matchups played"}
              {currentStep === "scoring" && `Match ${currentMatchupIndex + 1} of ${selectedMatchups.length}`}
              {currentStep === "preview" && "Review and save"}
            </p>
          </div>
          
          {/* Mobile progress indicator */}
          {(currentStep === "scoring" || currentStep === "preview") && (
            <div className="flex items-center gap-2">
              <div className="text-xs text-muted-foreground">
                {currentStep === "scoring" ? `${queuedResults.length}/${selectedMatchups.length}` : "Review"}
              </div>
              <div className="w-12 bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: currentStep === "preview" ? "100%" : `${(queuedResults.length / selectedMatchups.length) * 100}%` 
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content area - no card wrapper for mobile */}
      <div className="flex-1 overflow-auto">
        {/* Mobile-optimized progress overview */}
        {currentStep === "scoring" && (
          <div className="px-4 py-3 border-b">
            <MatchupProgressOverview
              players={players}
              selectedMatchups={selectedMatchups}
              queuedResults={queuedResults}
              currentIndex={currentMatchupIndex}
              onMatchupClick={handleJumpToMatchup}
            />
          </div>
        )}

        {/* Step content with mobile padding */}
        <div className="px-4 py-6">
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
        </div>
      </div>

      {/* Sticky bottom navigation for mobile */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t p-4">
        <div className="flex justify-between gap-4">
          <Button
            onClick={currentStep === "selection" ? onClose : goToPreviousStep}
            variant="outline"
            className="flex-1 h-12 text-base"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentStep === "selection" ? "Cancel" : "Back"}
          </Button>

          {currentStep === "selection" && (
            <Button
              onClick={goToNextStep}
              disabled={selectedMatchups.length === 0}
              className="flex-1 h-12 text-base"
            >
              Next ({selectedMatchups.length})
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
          
          {currentStep === "preview" && (
            <Button
              onClick={handleSubmit}
              disabled={queuedResults.length === 0 || isSubmitting}
              className="flex-1 h-12 text-base"
            >
              <Users className="h-4 w-4 mr-2" />
              {isSubmitting ? "Saving..." : `Save ${queuedResults.length} Results`}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
