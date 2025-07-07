
import { MatchForm } from "@/components/MatchForm";
import { Navigation } from "@/components/Navigation";
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
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-3 sm:space-y-4 w-full">
            <MatchForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageMatches;
