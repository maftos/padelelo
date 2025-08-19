
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Users, X, ChevronLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { PlayersStep } from "../create-match/PlayersStep";
import { LocationDetailsStep } from "../create-match/LocationDetailsStep";
import { GameAnnouncementStep } from "../create-match/GameAnnouncementStep";
import { useBookingDetails } from "@/hooks/use-booking-details";
import { usePlayerSelection } from "@/hooks/match/use-player-selection";
import { CancelBookingDialog } from "./CancelBookingDialog";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useEditBooking } from "@/hooks/use-edit-booking";

interface WizardData {
  selectedPlayers: string[];
  location: string;
  matchDate: string;
  matchTime: string;
  feePerPlayer: string;
  gameDescription: string;
}

const EditMatchWizard = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { getPlayerName } = usePlayerSelection();
  const { booking, isLoading, error } = useBookingDetails(bookingId);
  const { user } = useAuth();
  const { editBooking } = useEditBooking();
  const isMobile = useIsMobile();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wizardData, setWizardData] = useState<WizardData>({
    selectedPlayers: [],
    location: "venue1",
    matchDate: "",
    matchTime: "",
    feePerPlayer: "",
    gameDescription: ""
  });

  const isOpenGame = wizardData.selectedPlayers.length < 4;
  // Show 3 steps for open games (< 4 players), 2 steps for closed games (4 players)
  const totalSteps = isOpenGame ? 3 : 2;
  
  console.log('EditMatchWizard: isOpenGame:', isOpenGame, 'totalSteps:', totalSteps, 'booking status:', booking?.status, 'selectedPlayers:', wizardData.selectedPlayers.length);

  useEffect(() => {
    if (booking && booking.start_time && user?.id) {
      console.log('EditMatchWizard: Booking data received:', booking);
      
      // Add null checks for all required fields
      const startTime = booking.start_time || '';
      
      // Convert from UTC to UTC+04:00 for display
      const utcDate = new Date(startTime);
      const mauritiusDate = new Date(utcDate.getTime() + (4 * 60 * 60 * 1000)); // Add 4 hours
      
      const [date, timeWithZ] = mauritiusDate.toISOString().split('T');
      const time = timeWithZ ? timeWithZ.substring(0, 5) : '';
      
      // Get participants and ensure current user is always included
      const participants = booking.participants?.map(p => p.player_id) || [];
      const selectedPlayers = participants.includes(user.id) 
        ? participants 
        : [user.id, ...participants];
      
      const updatedData = {
        selectedPlayers,
        location: booking.venue_id || '',
        matchDate: date || '',
        matchTime: time || '',
        feePerPlayer: booking.booking_fee_per_player?.toString() || "",
        gameDescription: booking.description || ""
      };
      
      console.log('EditMatchWizard: Setting wizard data:', updatedData);
      setWizardData(updatedData);
    }
  }, [booking, user?.id]);

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

  const handleSaveChanges = async () => {
    if (!user?.id || !bookingId) {
      toast.error("Missing user or booking information");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Convert UI time back to UTC for storage
      const localDateTime = `${wizardData.matchDate}T${wizardData.matchTime}:00`;
      const localDate = new Date(localDateTime);
      const utcDate = new Date(localDate.getTime() - (4 * 60 * 60 * 1000)); // Subtract 4 hours to get UTC
      
      const { data, error } = await editBooking({
        p_user_id: user.id,
        p_booking_id: bookingId,
        p_player_ids: wizardData.selectedPlayers,
        p_description: wizardData.gameDescription || null,
        p_venue_id: wizardData.location || null,
        p_start_time: utcDate.toISOString(),
        p_end_time: null, // Not handled in wizard yet
        p_booking_fee_per_player: wizardData.feePerPlayer ? parseFloat(wizardData.feePerPlayer) : null
      });

      if (error) {
        console.error('Error updating booking:', error);
        toast.error(error.message || "Failed to update booking");
        return;
      }

      const result = data as any;
      if (result?.success) {
        toast.success(result.message || "Booking updated successfully!");
        navigate("/manage-bookings");
      } else {
        toast.error(result?.message || "Failed to update booking");
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelBooking = () => {
    setShowCancelDialog(true);
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
        return true; // Description is optional
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
            knownPlayers={(booking.participants || []).map(p => ({
              id: p.player_id,
              name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Unknown',
              profile_photo: p.profile_photo || undefined,
            }))}
          />
        );
      case 2:
        return (
          <LocationDetailsStep
            data={{
              venueId: wizardData.location, // Use the actual venue ID from booking data
              location: wizardData.location, // Keep for backward compatibility
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
        return "Publish Open Game";
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

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Booking not found</p>
          <Button onClick={() => navigate("/manage-bookings")} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bookings
          </Button>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header with Progress Bar */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50">
          <div className="container max-w-lg mx-auto px-4 py-3 space-y-3">
            {/* Title and Cancel */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-xl font-bold">Edit Booking</h1>
                <p className="text-sm text-muted-foreground">
                  Step {currentStep} of {totalSteps}: {getStepTitle()}
                </p>
              </div>
              
              <Button 
                onClick={handleCancelBooking}
                variant="destructive" 
                size="sm"
              >
                <X className="h-4 w-4" />
              </Button>
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
        <div className="flex-1 container max-w-lg mx-auto px-4 py-4">
          <div className="h-full flex flex-col">
            {renderStepContent()}
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border/50">
          <div className="container max-w-lg mx-auto px-4 py-4">
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
                {isSubmitting ? "Saving..." : getNextButtonContent()}
              </Button>
            </div>
          </div>
        </div>

        {/* Cancel Booking Dialog */}
        {bookingId && (
          <CancelBookingDialog
            bookingId={bookingId}
            isOpen={showCancelDialog}
            onOpenChange={setShowCancelDialog}
          />
        )}
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Edit Booking</h1>
          <p className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}: {getStepTitle()}
          </p>
        </div>
        
        {/* Cancel Button - Top Right */}
        <Button 
          onClick={handleCancelBooking}
          variant="destructive" 
          size="sm"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
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
              {isSubmitting ? "Saving..." : getNextButtonContent()}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Booking Dialog */}
      {bookingId && (
        <CancelBookingDialog
          bookingId={bookingId}
          isOpen={showCancelDialog}
          onOpenChange={setShowCancelDialog}
        />
      )}
    </div>
  );
};

export default EditMatchWizard;
