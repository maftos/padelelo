
import * as React from "react";
import { Navigation } from "@/components/Navigation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RecentMatches } from "@/components/RecentMatches";
import { useUserProfile } from "@/hooks/use-user-profile";
import { LeaderboardHeader } from "@/components/leaderboard/LeaderboardHeader";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { AddFriendDialog } from "@/components/leaderboard/AddFriendDialog";
import { toast } from "@/hooks/use-toast";

interface LeaderboardPlayer {
  id: string;
  display_name: string;
  profile_photo: string | null;
  current_mmr: number;
  nationality: string | null;
  gender: string | null;
}

const Leaderboard = () => {
  const [filters, setFilters] = React.useState({
    gender: "both",
    friendsOnly: false,
  });
  const [selectedPlayer, setSelectedPlayer] = React.useState<LeaderboardPlayer | null>(null);
  const { userId } = useUserProfile();

  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users_sorted_by_mmr')
        .select('*')
        .limit(25)
        .order('current_mmr', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleGenderChange = (value: string) => {
    setFilters(prev => ({ ...prev, gender: value }));
  };

  const handleFriendsOnlyChange = (checked: boolean) => {
    setFilters(prev => ({ ...prev, friendsOnly: checked }));
  };

  const handleSendFriendRequest = async () => {
    if (!userId || !selectedPlayer) return;

    const { error } = await supabase.rpc('send_friend_request_leaderboard', {
      user_a_id_public: userId,
      user_b_id_public: selectedPlayer.id
    });
    
    if (error) {
      const errorBody = JSON.parse(error.message).body;
      const errorMessage = JSON.parse(errorBody).message;
      toast({
        description: errorMessage,
      });
    }
    
    setSelectedPlayer(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container py-8 px-4">
        <div className="grid md:grid-cols-[1fr,auto] gap-8">
          <div className="space-y-4 animate-fade-in">
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
          
          <div className="md:w-80">
            <RecentMatches />
          </div>
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

