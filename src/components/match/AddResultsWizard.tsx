
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Users } from "lucide-react";
import { MatchupSelectionStep } from "./MatchupSelectionStep";
import { ScoreEntryStep } from "./ScoreEntryStep";
import { ResultsCart } from "./ResultsCart";
import { MatchupProgressOverview } from "./MatchupProgressOverview";
import { useAddResults } from "@/hooks/match/use-add-results";

interface SetScore {
  order: number;
  team1_score: number;
  team2_score: number;
}

interface QueuedResult {
  id: string;
  team1: [string, string];
  team2: [string, string];
  sets: SetScore[];
}

interface SelectedMatchup {
  id: string;
  team1: [string, string];
  team2: [string, string];
  order: number;
  matchNumber: number;
}

interface BookingData {
  booking_id: string;
  venue_id: string;
  start_time: string;
  title: string;
  description: string;
  status: string;
  participants: Array<{
    player_id: string;
    first_name: string;
    last_name: string;
    profile_photo: string;
    current_mmr: number;
  }>;
}

interface AddResultsWizardProps {
  bookingData: BookingData;
  players: {
    id: string;
    name: string;
    photo?: string;
  }[];
  onClose: () => void;
}

export const AddResultsWizard = ({ bookingData, players, onClose }: AddResultsWizardProps) => {
  const [currentStep, setCurrentStep] = useState<"selection" | "scoring" | "preview">("selection");
  const [selectedMatchups, setSelectedMatchups] = useState<SelectedMatchup[]>([]);
  const [globalSetOrder, setGlobalSetOrder] = useState(1); // Track global set order across all matchups
  const {
    queuedResults,
    addResult,
    removeResult,
    submitResults,
    isSubmitting
  } = useAddResults(bookingData);
  const [currentMatchupIndex, setCurrentMatchupIndex] = useState(0);

  const handleMatchupSelect = (matchup: { id: string; team1: [string, string]; team2: [string, string] }) => {
    const order = selectedMatchups.length + 1;
    const existingCount = selectedMatchups.filter(m => m.id === matchup.id).length;
    const matchNumber = existingCount + 1;
    
    setSelectedMatchups(prev => [...prev, { ...matchup, order, matchNumber }]);
  };

  const handleAddResult = (team1Score: number, team2Score: number) => {
    const currentMatchup = selectedMatchups[currentMatchupIndex];
    if (!currentMatchup) return;

    // Create a set score with global order
    const setScore: SetScore = {
      order: globalSetOrder,
      team1_score: team1Score,
      team2_score: team2Score
    };

    // Check if we already have a result for this matchup
    const existingResultIndex = queuedResults.findIndex(r => 
      r.team1[0] === currentMatchup.team1[0] && 
      r.team1[1] === currentMatchup.team1[1] && 
      r.team2[0] === currentMatchup.team2[0] && 
      r.team2[1] === currentMatchup.team2[1]
    );

    if (existingResultIndex >= 0) {
      // Add set to existing result
      const updatedResult = {
        ...queuedResults[existingResultIndex],
        sets: [...queuedResults[existingResultIndex].sets, setScore]
      };
      
      const newResults = [...queuedResults];
      newResults[existingResultIndex] = updatedResult;
      
      // Update the queued results manually since we're modifying existing
      removeResult(queuedResults[existingResultIndex].id);
      addResult(updatedResult);
    } else {
      // Create new result
      const newResult: QueuedResult = {
        id: `${currentMatchup.id}-${currentMatchup.order}-${Date.now()}`,
        team1: currentMatchup.team1,
        team2: currentMatchup.team2,
        sets: [setScore]
      };
      
      addResult(newResult);
    }

    // Increment global set order
    setGlobalSetOrder(prev => prev + 1);
    
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

  const handleJumpToMatchup = (index: number) => {
    if (currentStep === "scoring" || currentStep === "preview") {
      setCurrentMatchupIndex(index);
      if (currentStep === "preview") {
        setCurrentStep("scoring");
      }
    }
  };

  const handleSubmit = async () => {
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
      // Clear results when going back
      queuedResults.forEach(result => removeResult(result.id));
      setCurrentMatchupIndex(0);
      setGlobalSetOrder(1);
    } else if (currentStep === "preview") {
      setCurrentStep("selection");
      queuedResults.forEach(result => removeResult(result.id));
      setCurrentMatchupIndex(0);
      setGlobalSetOrder(1);
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
          queuedResults={queuedResults.map(r => ({
            id: r.id,
            team1: r.team1,
            team2: r.team2,
            team1Score: r.sets[r.sets.length - 1]?.team1_score || 0,
            team2Score: r.sets[r.sets.length - 1]?.team2_score || 0
          }))}
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
              queuedResults={queuedResults.map(r => ({
                id: r.id,
                team1: r.team1,
                team2: r.team2,
                team1Score: r.sets[r.sets.length - 1]?.team1_score || 0,
                team2Score: r.sets[r.sets.length - 1]?.team2_score || 0
              }))}
              players={players}
              selectedMatchups={selectedMatchups}
              onRemoveResult={removeResult}
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
