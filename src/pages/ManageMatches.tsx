
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { ConfirmedMatchesList } from "@/components/match/ConfirmedMatchesList";
import { OpenGamesList } from "@/components/match/OpenGamesList";
import { ViewApplicantsDialog } from "@/components/match/ViewApplicantsDialog";
import { useState } from "react";
import { AddResultsWizard } from "@/components/match/AddResultsWizard";
import { usePlayerSelection } from "@/hooks/match/use-player-selection";

const ManageMatches = () => {
  const isMobile = useIsMobile();
  const [selectedMatchId, setSelectedMatchId] = useState<string>();
  const [applicantsDialogOpen, setApplicantsDialogOpen] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<string>();
  const [showAddResults, setShowAddResults] = useState(false);
  const { getPlayerName } = usePlayerSelection();

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

  // Mock function to get match players - this will need to be updated when we have the actual match data structure
  const getMatchPlayers = () => {
    if (!selectedMatchId) return [];
    
    // This is mock data - in real implementation, this would come from the confirmed match data
    return [
      { id: "player1", name: "Player 1" },
      { id: "player2", name: "Player 2" },
      { id: "player3", name: "Player 3" },
      { id: "player4", name: "Player 4" }
    ];
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
      <div className="w-full min-h-screen">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-6 max-w-full sm:max-w-4xl">
          {/* Header - Mobile optimized */}
          <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
              <div className="min-w-0 flex-1 w-full">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">My Matches</h1>
                <p className="text-sm sm:text-base text-muted-foreground">Manage your confirmed matches and open games</p>
              </div>
              
              {/* Action buttons - Stack on mobile, side by side on larger screens */}
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
                <Link to="/create-match" className="w-full sm:w-auto">
                  <Button className="flex items-center justify-center gap-2 text-sm h-9 sm:h-10 w-full px-3">
                    <Plus className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Create Match</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6 sm:space-y-8 w-full">
            {/* Confirmed Matches Section */}
            <div className="space-y-3 sm:space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Confirmed Matches</h2>
                <p className="text-sm text-muted-foreground">Complete your scheduled matches</p>
              </div>
              <ConfirmedMatchesList 
                onSelectMatch={handleSelectMatch}
                selectedMatchId={selectedMatchId}
              />
            </div>

            {/* Open Games Section */}
            <div className="space-y-3 sm:space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">My Open Games</h2>
                <p className="text-sm text-muted-foreground">Games you created that are waiting for more players</p>
              </div>
              <OpenGamesList onViewApplicants={handleViewApplicants} />
            </div>
          </div>
        </div>
      </div>

      {/* View Applicants Dialog */}
      <ViewApplicantsDialog
        open={applicantsDialogOpen}
        onOpenChange={setApplicantsDialogOpen}
        gameId={selectedGameId || ""}
        spotsAvailable={selectedGameId ? getSpotsAvailable(selectedGameId) : 3}
      />
    </>
  );
};

export default ManageMatches;
