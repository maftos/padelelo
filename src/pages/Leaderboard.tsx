
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

interface PostgresError {
  code: string;
  message: string;
  details?: string | null;
  hint?: string | null;
}

interface SupabaseErrorBody {
  body: string;
  message: string;
}

const parseErrorMessage = (error: any): { title: string; description: string } => {
  try {
    const errorData: SupabaseErrorBody = JSON.parse(error.message);
    if (errorData.body) {
      const pgError: PostgresError = JSON.parse(errorData.body);
      
      // Handle specific error cases
      if (pgError.message.includes("already friends")) {
        return {
          title: "Already Friends",
          description: "You are already friends with this player! 🤝",
        };
      }
      if (pgError.message.includes("Invitation sent already")) {
        return {
          title: "Request Pending",
          description: "You have already sent a friend request to this player ⏳",
        };
      }
      if (pgError.message.includes("Please complete your profile")) {
        return {
          title: "Profile Incomplete",
          description: "Please update your profile information before sending friend requests 📝",
        };
      }
      
      // Default error case
      return {
        title: "Error",
        description: pgError.message,
      };
    }
    return {
      title: "Error",
      description: errorData.message,
    };
  } catch (parseError) {
    console.error('Error parsing error message:', parseError);
    return {
      title: "Error",
      description: error.message,
    };
  }
};

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
    if (!userId || !selectedPlayer) {
      toast({
        title: "Missing Information",
        description: "Could not process your request due to missing information.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.rpc('send_friend_request_leaderboard', {
        user_a_id_public: userId,
        user_b_id_public: selectedPlayer.id
      });

      if (error) {
        const { title, description } = parseErrorMessage(error);
        toast({
          title,
          description,
          variant: error.message.includes("already friends") ? "default" : "destructive",
          duration: 5000,
        });
      } else {
        toast({
          title: "Success",
          description: `Friend request sent to ${selectedPlayer.display_name} 🎉`,
          duration: 5000,
        });
        setSelectedPlayer(null);
      }
    } catch (error: any) {
      toast({
        title: "System Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
      console.error('Error sending friend request:', error);
    }
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
