import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { MatchupsStep } from "./MatchupsStep";
import { SetScoresStep } from "./SetScoresStep";
import { ResultsSummaryStep } from "./ResultsSummaryStep";
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
  const [currentStep, setCurrentStep] = useState(1);
  const {
    matchups,
    setMatchups,
    setScores,
    allSetScores,
    submitResults,
    isSubmitting
  } = useAddResults(matchId);

  const steps = [
    { number: 1, title: "Define Matchups", description: "Select which matches were played" },
    { number: 2, title: "Enter Scores", description: "Add set scores for each match" },
    { number: 3, title: "Review & Save", description: "Confirm your results" }
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    const success = await submitResults();
    if (success) {
      onClose();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return matchups.length > 0;
      case 2:
        return matchups.every(matchup => 
          allSetScores[matchup.id] && allSetScores[matchup.id].length > 0
        );
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={onClose} variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Matches
          </Button>
          <div>
            <h2 className="text-xl font-semibold">Add Match Results</h2>
            <p className="text-sm text-muted-foreground">
              {steps[currentStep - 1].description}
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center space-x-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step.number
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step.number}
            </div>
            <div className="ml-2 hidden sm:block">
              <div className="text-sm font-medium">{step.title}</div>
            </div>
            {index < steps.length - 1 && (
              <div className="w-12 h-px bg-border mx-4" />
            )}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {steps[currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <MatchupsStep
              players={players}
              matchups={matchups}
              onMatchupsChange={setMatchups}
            />
          )}
          
          {currentStep === 2 && (
            <SetScoresStep
              matchups={matchups}
              players={players}
              allSetScores={allSetScores}
              onSetScoresChange={setScores}
            />
          )}
          
          {currentStep === 3 && (
            <ResultsSummaryStep
              matchups={matchups}
              players={players}
              allSetScores={allSetScores}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={handleBack}
          variant="outline"
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {currentStep < 3 ? (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!canProceed() || isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Results"}
          </Button>
        )}
      </div>
    </div>
  );
};