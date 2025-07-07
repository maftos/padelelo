
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { PendingMatchesList } from "@/components/match/PendingMatchesList";
import { UserOpenGamesList } from "@/components/match/UserOpenGamesList";
import { ViewApplicantsDialog } from "@/components/match/ViewApplicantsDialog";
import { useState } from "react";

const ManageMatches = () => {
  const isMobile = useIsMobile();
  const [selectedMatchId, setSelectedMatchId] = useState<string>();
  const [applicantsDialogOpen, setApplicantsDialogOpen] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<string>();

  const handleSelectMatch = (matchId: string) => {
    setSelectedMatchId(matchId);
    // Additional logic for handling match selection can go here
  };

  const handleViewApplicants = (gameId: string) => {
    setSelectedGameId(gameId);
    setApplicantsDialogOpen(true);
  };

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
                <p className="text-sm sm:text-base text-muted-foreground">Manage your pending matches and open games</p>
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
            {/* Pending Matches Section */}
            <div className="space-y-3 sm:space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Pending Matches</h2>
                <p className="text-sm text-muted-foreground">Complete your scheduled matches</p>
              </div>
              <PendingMatchesList 
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
      />
    </>
  );
};

export default ManageMatches;
