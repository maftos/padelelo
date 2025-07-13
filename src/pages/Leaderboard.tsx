
import * as React from "react";
import { Navigation } from "@/components/Navigation";
import { RecentMatches } from "@/components/RecentMatches";
import { useUserProfile } from "@/hooks/use-user-profile";
import { LeaderboardHeader } from "@/components/leaderboard/LeaderboardHeader";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { useLeaderboardFilters } from "@/hooks/use-leaderboard-filters";
import { useLeaderboardData } from "@/hooks/use-leaderboard-data";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";

const Leaderboard = () => {
  const { userId } = useUserProfile();
  const { filters, handleGenderChange, handleFriendsOnlyChange } = useLeaderboardFilters();
  const { data: leaderboardData, isLoading } = useLeaderboardData();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handlePlayerSelect = (player: any) => {
    navigate(`/profile/${player.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Navigation />
      <main className="container py-6 md:py-12 px-4 max-w-7xl mx-auto">
        <div className={`grid gap-6 md:gap-8 ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-[1fr,320px]'}`}>
          <div className="space-y-6 md:space-y-8 animate-fade-in">
            <LeaderboardHeader 
              filters={filters}
              onGenderChange={handleGenderChange}
              onFriendsOnlyChange={handleFriendsOnlyChange}
            />
            
            <LeaderboardTable 
              isLoading={isLoading}
              data={leaderboardData}
              userId={userId}
              onPlayerSelect={handlePlayerSelect}
            />
          </div>
          
          {!isMobile && (
            <div className="lg:sticky lg:top-24 lg:h-fit">
              <RecentMatches />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
