import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Megaphone, Users, ChevronLeft } from "lucide-react";
import { PlayersStep } from "./PlayersStep";
import { LocationDetailsStep } from "./LocationDetailsStep";
import { GameAnnouncementStep } from "./GameAnnouncementStep";
import { toast } from "sonner";
import { useBookingSubmission } from "@/hooks/create-booking/use-booking-submission";
import { useIsMobile } from "@/hooks/use-mobile";

interface WizardData {
  selectedPlayers: string[];
  venueId: string;
  location: string;
  matchDate: string;
  matchTime: string;
  feePerPlayer: string;
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
        return true; // Description is optional, so always allow proceeding
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
              gameDescription: wizardData.gameDescription,
              feePerPlayer: wizardData.feePerPlayer
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

  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header with Progress Bar */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50">
          <div className="container max-w-full mx-auto px-3 pt-2 pb-3 space-y-3">
            {/* Title */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-xl font-bold">Create New Booking</h1>
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
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 container max-w-full mx-auto px-3 py-4">
          <div className="h-full flex flex-col">
            {renderStepContent()}
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border/50">
          <div className="container max-w-full mx-auto px-3 py-4">
            <div className="flex items-center gap-3">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handlePrevious}
                  className="flex-shrink-0 h-12"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              )}
              {currentStep === 1 && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/manage-bookings")}
                  className="flex-shrink-0 h-12"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              )}
              <Button
                onClick={handleButtonClick}
                disabled={!canProceed() || isSubmitting}
                size="lg"
                className="flex-1 h-12 rounded-lg font-medium transition-all duration-200"
              >
                {isSubmitting ? "Creating..." : getNextButtonContent()}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="container max-w-full sm:max-w-4xl mx-auto px-3 sm:px-4 pt-2 sm:pt-4 pb-24 sm:pb-6 space-y-6">
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
              size="lg"
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