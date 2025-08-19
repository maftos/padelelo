import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { ConfirmedMatchesList } from "@/components/match/ConfirmedMatchesList";
import { UserOpenGamesList } from "@/components/match/UserOpenGamesList";
import { ViewApplicantsResponsive } from "@/components/match/ViewApplicantsResponsive";
import { useState } from "react";
import { AddResultsWizard } from "@/components/match/AddResultsWizard";
import { useConfirmedBookings } from "@/hooks/use-confirmed-bookings";
import { useOpenGames } from "@/hooks/use-open-games";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

const ManageMatches = () => {
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [selectedMatchId, setSelectedMatchId] = useState<string>();
  const [applicantsDialogOpen, setApplicantsDialogOpen] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<string>();
  const [showAddResults, setShowAddResults] = useState(false);
  const { confirmedBookings } = useConfirmedBookings();
  const { openGames } = useOpenGames();

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

  // Get spots available and applicants from the actual game data
  const getGameData = (gameId: string) => {
    const game = openGames.find(g => g.booking_id === gameId);
    if (!game) return { spotsAvailable: 0, applicants: [] };
    
    const spotsAvailable = 4 - game.player_count;
    const applicants = game.applications.map(app => ({
      id: parseInt(app.id),
      player_id: app.player_id,
      display_name: `${app.first_name} ${app.last_name}`,
      profile_photo: app.profile_photo,
      current_mmr: app.current_mmr,
      status: app.status.toLowerCase() as 'pending' | 'accepted' | 'rejected',
      isFriend: false // This would need friendship logic
    }));
    
    return { spotsAvailable, applicants };
  };

  // Handle successful application response
  const handleApplicationResponse = (applicationId: number, status: 'ACCEPTED', applicant: any) => {
    // Invalidate and refetch the open games query to get updated data
    queryClient.invalidateQueries({ queryKey: ['open-games'] });
  };

  // Get match players from the actual match data
  const getMatchPlayers = () => {
    if (!selectedMatchId) return [];
    
    // Find the selected booking from confirmed bookings
    const selectedBooking = confirmedBookings.find(booking => booking.booking_id === selectedMatchId);
    if (!selectedBooking) return [];
    
    // Convert participants to the expected format with first names only
    const players = selectedBooking.participants.map(participant => ({
      id: participant.player_id,
      name: participant.player_id === user?.id ? "You" : participant.first_name, // Show "You" for current user
      photo: participant.profile_photo
    }));
    
    // Sort players to ensure current user is always first
    return players.sort((a, b) => {
      if (a.id === user?.id) return -1;
      if (b.id === user?.id) return 1;
      return 0;
    });
  };

  // Show Add Results wizard if a match is selected
  if (showAddResults && selectedMatchId) {
    return (
      <>
        <Navigation />
        <div className="w-full min-h-screen">
          <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-6 max-w-full sm:max-w-4xl">
            <AddResultsWizard
              bookingId={selectedMatchId}
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
        <div className="container mx-auto px-3 sm:px-4 pt-2 sm:pt-4 pb-24 sm:pb-6 max-w-full sm:max-w-4xl">
          {/* Main Content */}
          <div className="space-y-8">
            {/* Confirmed Matches Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">Confirmed Bookings</h2>
                  <p className="text-sm text-muted-foreground">Complete your scheduled bookings</p>
                </div>
                
                {/* Create Booking Button - Desktop */}
                <Link to="/create-booking" className="hidden sm:block">
                  <Button className="flex items-center justify-center gap-2 text-sm h-10 px-4">
                    <Plus className="h-4 w-4" />
                    <span>Create Booking</span>
                  </Button>
                </Link>
              </div>
              <ConfirmedMatchesList 
                onSelectMatch={handleSelectMatch}
                selectedMatchId={selectedMatchId}
              />
            </div>

            {/* Open Games Section */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">My Open Games</h2>
                <p className="text-sm text-muted-foreground">Games you created that are waiting for more players</p>
              </div>
              <UserOpenGamesList onViewApplicants={handleViewApplicants} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky Create Booking CTA */}
      <div className="sm:hidden fixed inset-x-0 bottom-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
        <div className="container mx-auto max-w-4xl px-3 py-3">
          <Link to="/create-booking">
            <Button className="w-full h-12 text-base">
              <Plus className="h-5 w-5 mr-2" />
              Create Booking
            </Button>
          </Link>
        </div>
      </div>

      {/* View Applicants Responsive Modal/Drawer */}
      <ViewApplicantsResponsive
        open={applicantsDialogOpen}
        onOpenChange={setApplicantsDialogOpen}
        gameId={selectedGameId || ""}
        spotsAvailable={selectedGameId ? getGameData(selectedGameId).spotsAvailable : 0}
        applicants={selectedGameId ? getGameData(selectedGameId).applicants : []}
        onApplicationResponse={handleApplicationResponse}
      />
    </>
  );
};

export default ManageMatches;
