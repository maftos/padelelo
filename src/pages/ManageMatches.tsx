
import { MatchForm } from "@/components/MatchForm";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const ManageMatches = () => {
  const isMobile = useIsMobile();

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
                <p className="text-sm sm:text-base text-muted-foreground">Manage your pending matches</p>
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

          {/* Main Content - Only pending matches, no redundant form */}
          <div className="space-y-3 sm:space-y-4 w-full">
            {/* This would be where pending matches list goes */}
            <div className="text-center py-8 text-muted-foreground">
              <p>Your pending matches will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageMatches;
