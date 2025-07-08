
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { ConfirmedMatchesList } from "@/components/match/ConfirmedMatchesList";
import { UserOpenGamesList } from "@/components/match/UserOpenGamesList";
import { ViewApplicantsDialog } from "@/components/match/ViewApplicantsDialog";
import { useState } from "react";
import { AddResultsWizard } from "@/components/match/AddResultsWizard";

const ManageMatches = () => {
  const isMobile = useIsMobile();
  const [selectedMatchId, setSelectedMatchId] = useState<string>();
  const [applicantsDialogOpen, setApplicantsDialogOpen] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<string>();
  const [showAddResults, setShowAddResults] = useState(false);

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

  // Mock function to get match players - this will be updated when integrating with real data
  const getMatchPlayers = () => {
    if (!selectedMatchId) return [];
    
    // Mock data for now - will be replaced with real data later
    return [
      { id: "player1", name: "John Doe" },
      { id: "player2", name: "Jane Smith" },
      { id: "player3", name: "Mike Johnson" },
      { id: "player4", name: "Sarah Wilson" }
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
