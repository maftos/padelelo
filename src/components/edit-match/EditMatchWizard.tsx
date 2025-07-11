
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Users, Trash2 } from "lucide-react";
import { PlayersStep } from "../create-match/PlayersStep";
import { LocationDetailsStep } from "../create-match/LocationDetailsStep";
import { GameAnnouncementStep } from "../create-match/GameAnnouncementStep";
import { usePendingMatches } from "@/hooks/use-pending-matches";
import { usePlayerSelection } from "@/hooks/match/use-player-selection";
import { toast } from "sonner";

interface WizardData {
  selectedPlayers: string[];
  location: string;
  matchDate: string;
  matchTime: string;
  feePerPlayer: string;
  gameTitle: string;
  gameDescription: string;
}

const EditMatchWizard = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { getPlayerName } = usePlayerSelection();
  const { pendingMatches, deletePendingMatch, isDeletingMatch } = usePendingMatches();
  
  const match = pendingMatches.find(m => m.match_id === matchId);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({
    selectedPlayers: [],
    location: "venue1",
    matchDate: "",
    matchTime: "",
    feePerPlayer: "",
    gameTitle: "",
    gameDescription: ""
  });

  const isOpenGame = wizardData.selectedPlayers.length < 4;
  const totalSteps = isOpenGame ? 3 : 2;

  useEffect(() => {
    if (match) {
      setWizardData({
        selectedPlayers: [
          match.team1_player1_id,
          match.team1_player2_id,
          match.team2_player1_id,
          match.team2_player2_id
        ],
        location: "venue1",
        matchDate: match.match_date.split('T')[0],
        matchTime: match.match_date.split('T')[1].substring(0, 5),
        feePerPlayer: "",
        gameTitle: "",
        gameDescription: ""
      });
    }
  }, [match]);

  const updateWizardData = (data: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveChanges = () => {
    if (isOpenGame) {
      toast.success("Open game updated successfully!");
    } else {
      toast.success("Match updated successfully!");
    }
    navigate("/manage-matches");
  };

  const handleDeleteMatch = () => {
    if (!matchId) return;
    
    if (confirm('Are you sure you want to delete this match? This action cannot be undone.')) {
      deletePendingMatch(matchId);
      navigate("/manage-matches");
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return wizardData.selectedPlayers.length > 0;
      case 2:
        // For incomplete matches (less than 4 players), require all fields
        if (isOpenGame) {
          return wizardData.location && wizardData.matchDate && wizardData.matchTime && wizardData.feePerPlayer;
        }
        return true; // For complete matches, details are optional
      case 3:
        return wizardData.gameTitle.trim().length > 0;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PlayersStep
            selectedPlayers={wizardData.selectedPlayers}
            onPlayersChange={(players) => updateWizardData({ selectedPlayers: players })}
          />
        );
      case 2:
        return (
          <LocationDetailsStep
            data={{
              venueId: "",
              location: wizardData.location,
              matchDate: wizardData.matchDate,
              matchTime: wizardData.matchTime,
              feePerPlayer: wizardData.feePerPlayer
            }}
            hasAllPlayers={wizardData.selectedPlayers.length >= 4}
            onDataChange={(data) => updateWizardData(data)}
          />
        );
      case 3:
        return (
          <GameAnnouncementStep
            data={{
              gameTitle: wizardData.gameTitle,
              gameDescription: wizardData.gameDescription
            }}
            onDataChange={(data) => updateWizardData(data)}
          />
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Edit Players";
      case 2:
        return "Edit Match Details";
      case 3:
        return "Edit Match Details";
      default:
        return "";
    }
  };

  const getNextButtonContent = () => {
    if (currentStep === totalSteps) {
      if (isOpenGame) {
        return (
          <>
            <Users className="h-4 w-4 mr-2" />
            Update Open Game
          </>
        );
      } else {
        return (
          <>
            <Users className="h-4 w-4 mr-2" />
            Save Changes
          </>
        );
      }
    }
    return (
      <>
        Next
        <ArrowRight className="h-4 w-4 ml-2" />
      </>
    );
  };

  const handleButtonClick = () => {
    if (currentStep === totalSteps) {
      handleSaveChanges();
    } else {
      handleNext();
    }
  };

  if (!match) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Match not found</p>
          <Button onClick={() => navigate("/manage-matches")} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Matches
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Edit Match</h1>
          <p className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}: {getStepTitle()}
          </p>
        </div>
        
        {/* Delete Button - Top Right */}
        <Button 
          onClick={handleDeleteMatch}
          variant="destructive" 
          size="sm"
          disabled={isDeletingMatch}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {isDeletingMatch ? 'Deleting...' : 'Delete'}
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between">
            <Button
              onClick={currentStep === 1 ? () => navigate("/manage-matches") : handlePrevious}
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {currentStep === 1 ? "Back" : "Previous"}
            </Button>

            <Button
              onClick={handleButtonClick}
              disabled={!canProceed()}
              size="lg"
            >
              {getNextButtonContent()}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditMatchWizard;
