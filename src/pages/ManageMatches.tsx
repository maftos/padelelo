
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import ConfirmedMatchesList from "@/components/match/ConfirmedMatchesList";
import { UserOpenGamesList } from "@/components/match/UserOpenGamesList";
import { ViewApplicantsResponsive } from "@/components/match/ViewApplicantsResponsive";
import { useState } from "react";
import { AddResultsWizard } from "@/components/match/AddResultsWizard";
import { useConfirmedMatches } from "@/hooks/use-confirmed-matches";

const ManageMatches = () => {
  const isMobile = useIsMobile();
  const [selectedMatchId, setSelectedMatchId] = useState<string>();
  const [applicantsDialogOpen, setApplicantsDialogOpen] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<string>();
  const [showAddResults, setShowAddResults] = useState(false);
  const { confirmedMatches } = useConfirmedMatches();

  const handleSelectMatch = (matchId: string) => {
    setSelectedMatchId(matchId);
    setShowAddResults(true);
  };

  const handleCloseAddResults = () => {
    setShowAddResults(false);
    setSelectedMatchId(undefined);
  };

  const handleViewApplicants = (gameId: string) => {
    setSelectedGameId(gameId);
    setApplicantsDialogOpen(true);
  };

  // Mock function to get spots available for a game
  const getSpotsAvailable = (gameId: string) => {
    // In real implementation, this would come from the game data
    return 3; // Mock value
  };

  // Get the selected booking data from confirmed matches
  const getSelectedBooking = () => {
    if (!selectedMatchId) return null;
    
    const selectedMatch = confirmedMatches.find(match => match.booking_id === selectedMatchId);
    if (!selectedMatch) return null;
    
    // Transform the ConfirmedMatch to BookingData format by adding current_mmr
    return {
      booking_id: selectedMatch.booking_id,
      venue_id: selectedMatch.venue_id,
      start_time: selectedMatch.start_time,
      title: selectedMatch.title,
      description: selectedMatch.description,
      status: selectedMatch.status,
      participants: selectedMatch.participants.map(participant => ({
        ...participant,
        current_mmr: participant.current_mmr || 3000 // Default MMR if missing
      }))
    };
  };

  // Get match players from the actual match data
  const getMatchPlayers = () => {
    const selectedBooking = getSelectedBooking();
    if (!selectedBooking) return [];
    
    // Convert participants to the expected format with first names only
    return selectedBooking.participants.map(participant => ({
      id: participant.player_id,
      name: participant.first_name, // Use only first name
      photo: participant.profile_photo
    }));
  };

  // Show Add Results wizard if a match is selected
  if (showAddResults && selectedMatchId) {
    const selectedBooking = getSelectedBooking();
    
    if (!selectedBooking) {
      // If booking not found, close the wizard
      setShowAddResults(false);
      setSelectedMatchId(undefined);
      return null;
    }

    return (
      <>
        <Navigation />
        <div className="w-full min-h-screen">
          <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-6 max-w-full sm:max-w-4xl">
            <AddResultsWizard
              bookingData={selectedBooking}
              players={getMatchPlayers()}
              onClose={handleCloseAddResults}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="w-full min-h-screen bg-background">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-full sm:max-w-4xl">
          {/* Header - Mobile optimized */}
          <div className="mb-6">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground">My Matches</h1>
                  <p className="text-sm text-muted-foreground mt-1">Manage your confirmed matches and open games</p>
                </div>
                
                {/* Create Match Button */}
                <Link to="/create-match" className="w-full sm:w-auto">
                  <Button className="flex items-center justify-center gap-2 text-sm h-9 sm:h-10 w-full sm:w-auto px-4">
                    <Plus className="h-4 w-4" />
                    <span>Create Match</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Confirmed Matches Section */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">Confirmed Matches</h2>
                <p className="text-sm text-muted-foreground">Complete your scheduled matches</p>
              </div>
              <ConfirmedMatchesList 
                onSelectMatch={handleSelectMatch}
                selectedMatchId={selectedMatchId}
              />
            </div>

            {/* Open Games Section */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">My Open Games</h2>
                <p className="text-sm text-muted-foreground">Games you created that are waiting for more players</p>
              </div>
              <UserOpenGamesList onViewApplicants={handleViewApplicants} />
            </div>
          </div>
        </div>
      </div>

      {/* View Applicants Responsive Modal/Drawer */}
      <ViewApplicantsResponsive
        open={applicantsDialogOpen}
        onOpenChange={setApplicantsDialogOpen}
        gameId={selectedGameId || ""}
        spotsAvailable={selectedGameId ? getSpotsAvailable(selectedGameId) : 3}
      />
    </>
  );
};

export default ManageMatches;
