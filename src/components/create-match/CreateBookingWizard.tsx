import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Megaphone, Users } from "lucide-react";
import { PlayersStep } from "./PlayersStep";
import { LocationDetailsStep } from "./LocationDetailsStep";
import { GameAnnouncementStep } from "./GameAnnouncementStep";
import { toast } from "sonner";
import { useBookingSubmission } from "@/hooks/create-booking/use-booking-submission";

interface WizardData {
  selectedPlayers: string[];
  venueId: string;
  location: string;
  matchDate: string;
  matchTime: string;
  feePerPlayer: string;
  gameTitle: string;
  gameDescription: string;
}

const CreateBookingWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const { submitBooking, isSubmitting } = useBookingSubmission();
  const [wizardData, setWizardData] = useState<WizardData>({
    selectedPlayers: [],
    venueId: "",
    location: "",
    matchDate: "",
    matchTime: "",
    feePerPlayer: "",
    gameTitle: "",
    gameDescription: ""
  });

  const isOpenGame = wizardData.selectedPlayers.length < 4;
  const totalSteps = isOpenGame ? 3 : 2;

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

  const handleFinish = async () => {
    const success = await submitBooking(wizardData);
    if (success) {
      navigate("/manage-bookings");
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return wizardData.selectedPlayers.length > 0;
      case 2:
        // For incomplete matches (less than 4 players), require all fields
        if (isOpenGame) {
          return wizardData.venueId && wizardData.matchDate && wizardData.matchTime && wizardData.feePerPlayer;
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
              venueId: wizardData.venueId,
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
        return "Select Players";
      case 2:
        return "Booking Details";
      case 3:
        return "Game Details";
      default:
        return "";
    }
  };

  const getNextButtonContent = () => {
    if (currentStep === totalSteps) {
      if (isOpenGame) {
        return (
          <>
            <Megaphone className="h-4 w-4 mr-2" />
            Publish Open Game
          </>
        );
      } else {
        return (
          <>
            <Users className="h-4 w-4 mr-2" />
            Create Booking
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
      handleFinish();
    } else {
      handleNext();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Create New Booking</h1>
          <p className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}: {getStepTitle()}
          </p>
        </div>
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
              onClick={currentStep === 1 ? () => navigate("/manage-bookings") : handlePrevious}
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {currentStep === 1 ? "Back" : "Previous"}
            </Button>

            <Button
              onClick={handleButtonClick}
              disabled={!canProceed() || isSubmitting}
              size="lg"
            >
              {isSubmitting ? "Creating..." : getNextButtonContent()}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateBookingWizard;