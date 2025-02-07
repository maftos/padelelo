
import * as React from "react";
import { Navigation } from "@/components/Navigation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RecentMatches } from "@/components/RecentMatches";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useToast } from "@/hooks/use-toast";
import { LeaderboardHeader } from "@/components/leaderboard/LeaderboardHeader";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { AddFriendDialog } from "@/components/leaderboard/AddFriendDialog";

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
  const { toast } = useToast();

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
      let errorMessage = error.message;
      
      // The error object from PostgreSQL RPC calls comes in a specific format
      try {
        // First parse the error object which contains the body
        const errorData = JSON.parse(error.message);
        // Then parse the body which contains the actual PostgreSQL error
        const pgError = JSON.parse(errorData.body);
        // Use the PostgreSQL error message
        errorMessage = pgError.message;
      } catch (parseError) {
        console.error('Error parsing error message:', parseError);
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Friend request sent to ${selectedPlayer.display_name}`,
      });
    }
    
    setSelectedPlayer(null);
  };

  // Test function to demonstrate different toast types
  const testToasts = () => {
    // Success toast
    toast({
      title: "Success Example",
      description: "This is how a success toast looks like!",
    });

    // After 1 second, show an error toast
    setTimeout(() => {
      toast({
        title: "Error Example",
        description: "This is how an error message would appear.",
        variant: "destructive",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container py-8 px-4">
        {/* Test Button */}
        <button
          onClick={testToasts}
          className="mb-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Test Toast Messages
        </button>

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

