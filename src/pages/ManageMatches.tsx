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
import { useConfirmedMatches } from "@/hooks/use-confirmed-matches";
import { useOpenGames } from "@/hooks/use-open-games";
import { useQueryClient } from "@tanstack/react-query";

const ManageMatches = () => {
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const [selectedMatchId, setSelectedMatchId] = useState<string>();
  const [applicantsDialogOpen, setApplicantsDialogOpen] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<string>();
  const [showAddResults, setShowAddResults] = useState(false);
  const { confirmedMatches } = useConfirmedMatches();
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
      display_name: `${app.first_name} ${app.last_name}`,
      profile_photo: app.profile_photo,
      current_mmr: app.current_mmr,
      status: app.status.toLowerCase() as 'pending' | 'accepted' | 'rejected',
      isFriend: false // This would need friendship logic
    }));
    
    return { spotsAvailable, applicants };
  };

  // Handle successful application response
  const handleApplicationResponse = (applicationId: number, status: 'ACCEPTED' | 'DECLINED', applicant: any) => {
    // Invalidate and refetch the open games query to get updated data
    queryClient.invalidateQueries({ queryKey: ['open-games'] });
  };

  // Get match players from the actual match data
  const getMatchPlayers = () => {
    if (!selectedMatchId) return [];
    
    // Find the selected match from confirmed matches
    const selectedMatch = confirmedMatches.find(match => match.booking_id === selectedMatchId);
    if (!selectedMatch) return [];
    
    // Convert participants to the expected format with first names only
    return selectedMatch.participants.map(participant => ({
      id: participant.player_id,
      name: participant.first_name, // Use only first name
      photo: participant.profile_photo
    }));
  };

  // Show Add Results wizard if a match is selected
  if (showAddResults && selectedMatchId) {
    return (
      <>
        <Navigation />
        <div className="w-full min-h-screen">
          <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-6 max-w-full sm:max-w-4xl">
            <AddResultsWizard
              matchId={selectedMatchId}
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
        spotsAvailable={selectedGameId ? getGameData(selectedGameId).spotsAvailable : 0}
        applicants={selectedGameId ? getGameData(selectedGameId).applicants : []}
        onApplicationResponse={handleApplicationResponse}
      />
    </>
  );
};

export default ManageMatches;
