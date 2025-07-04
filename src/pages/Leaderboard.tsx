
import * as React from "react";
import { Navigation } from "@/components/Navigation";
import { RecentMatches } from "@/components/RecentMatches";
import { useUserProfile } from "@/hooks/use-user-profile";
import { LeaderboardHeader } from "@/components/leaderboard/LeaderboardHeader";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { AddFriendDialog } from "@/components/leaderboard/AddFriendDialog";
import { useLeaderboardFilters } from "@/hooks/use-leaderboard-filters";
import { useLeaderboardData } from "@/hooks/use-leaderboard-data";
import { useFriendRequests } from "@/hooks/use-friend-requests";
import { useIsMobile } from "@/hooks/use-mobile";

const Leaderboard = () => {
  const { userId } = useUserProfile();
  const { filters, handleGenderChange, handleFriendsOnlyChange } = useLeaderboardFilters();
  const { data: leaderboardData, isLoading } = useLeaderboardData();
  const { selectedPlayer, setSelectedPlayer, handleSendFriendRequest } = useFriendRequests(userId);
  const isMobile = useIsMobile();

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
              onPlayerSelect={setSelectedPlayer}
            />
          </div>
          
          {!isMobile && (
            <div className="lg:sticky lg:top-24 lg:h-fit">
              <RecentMatches />
            </div>
          )}
        </div>
      </main>

      <AddFriendDialog 
        player={selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
        onSendRequest={handleSendFriendRequest}
      />
    </div>
  );
};

export default Leaderboard;
