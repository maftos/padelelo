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
    { team1: "", team2: "" },
    { team1: "", team2: "" },
    { team1: "", team2: "" },
  ]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const { userId } = useUserProfile();

  const { data: friends = [], isLoading: isLoadingFriends } = useQuery({
    queryKey: ['friends', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      console.log('Fetching friends for user:', userId);
      try {
        const { data, error } = await supabase.rpc('view_my_friends', {
          i_user_id: userId
        });
        
        if (error) {
          console.error('Error fetching friends:', error);
          throw error;
        }
        
        console.log('Friends data:', data);
        return data as Friend[];
      } catch (error) {
        console.error('Error in query function:', error);
        throw error;
      }
    },
    enabled: !!userId,
  });

  const playerOptions = [
    { id: userId || "", name: "Me" },
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasEmptyScores = scores.some(score => !score.team1 || !score.team2);
    if (hasEmptyScores) {
      toast.error("Please fill in all score fields");
      return;
    }

    toast.success("Match registered successfully!");
    
    setPage(1);
    setPlayer1("");
    setPlayer2("");
    setPlayer3("");
    setPlayer4("");
    setScores([
      { team1: "", team2: "" },
      { team1: "", team2: "" },
      { team1: "", team2: "" },
    ]);
    setDate(new Date().toISOString().split("T")[0]);
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