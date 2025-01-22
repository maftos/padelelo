import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ScoreForm } from "./ScoreForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/use-user-profile";
import { TeamSelect } from "./match/TeamSelect";

interface Friend {
  friend_id: string;
  display_name: string;
  status: string;
  created_at: string;
}

export const MatchForm = () => {
  const [page, setPage] = useState(1);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [player3, setPlayer3] = useState("");
  const [player4, setPlayer4] = useState("");
  const [scores, setScores] = useState([
    { team1: "", team2: "" } // Only one set of scores
  ]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const { userId } = useUserProfile();

  const { data: friends = [], isLoading: isLoadingFriends } = useQuery({
    queryKey: ['friends', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      try {
        const { data, error } = await supabase.rpc('view_my_friends', {
          i_user_id: userId
        });
        
        if (error) {
          console.error('Error fetching friends:', error);
          throw error;
        }
        
        return data as Friend[];
      } catch (error) {
        console.error('Error in query function:', error);
        throw error;
      }
    },
    enabled: !!userId,
  });

  const playerOptions = [
    { id: userId || "current-user", name: "Me" },
    ...friends.map(friend => ({ id: friend.friend_id, name: friend.display_name }))
  ];

  const handleNext = () => {
    if (!player1 || !player2 || !player3 || !player4) {
      toast.error("Please fill in all player fields");
      return;
    }

    const players = new Set([player1, player2, player3, player4]);
    if (players.size !== 4) {
      toast.error("All players must be different");
      return;
    }

    setPage(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasEmptyScores = scores.some(score => !score.team1 || !score.team2);
    if (hasEmptyScores) {
      toast.error("Please fill in all score fields");
      return;
    }

    try {
      // Step 2: Create match
      const { data: matchData, error: matchError } = await supabase.rpc('create_match', {
        team1_player1_id: player1,
        team1_player2_id: player2,
        team2_player1_id: player3,
        team2_player2_id: player4,
        match_date: new Date(date).toISOString()
      });

      if (matchError) throw matchError;

      console.log('Match created successfully:', matchData);
      const matchId = matchData;

      // Step 3: Calculate MMR change
      const { data: mmrData, error: mmrError } = await supabase.rpc('calculate_mmr_change', {
        match_id: matchId
      });

      if (mmrError) throw mmrError;

      console.log('MMR calculation successful:', mmrData);

      // Store the MMR data for later use with complete_match
      // We'll implement Step 4 (complete_match) later

      toast.success("Match registered successfully!");
      
      setPage(1);
      setPlayer1("");
      setPlayer2("");
      setPlayer3("");
      setPlayer4("");
      setScores([
        { team1: "", team2: "" } // Reset to one set of scores
      ]);
      setDate(new Date().toISOString().split("T")[0]);
    } catch (error) {
      console.error('Error creating match:', error);
      toast.error("Failed to register match. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-md p-6 space-y-6 animate-fade-in">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Register Match</h2>
        <p className="text-sm text-muted-foreground">
          {page === 1 ? "Select players" : "Enter match score"}
        </p>
      </div>

      {page === 1 ? (
        <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full"
            />
          </div>

          <TeamSelect
            teamNumber={1}
            player1Value={player1}
            player2Value={player2}
            onPlayer1Change={setPlayer1}
            onPlayer2Change={setPlayer2}
            players={playerOptions}
          />

          <TeamSelect
            teamNumber={2}
            player1Value={player3}
            player2Value={player4}
            onPlayer1Change={setPlayer3}
            onPlayer2Change={setPlayer4}
            players={playerOptions}
          />

          <Button type="submit" className="w-full">
            Next
          </Button>
        </form>
      ) : (
        <ScoreForm
          onBack={() => setPage(1)}
          scores={scores}
          setScores={setScores}
          onSubmit={handleSubmit}
        />
      )}
    </Card>
  );
};
