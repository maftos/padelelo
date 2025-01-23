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
import { TeamPreview } from "./match/TeamPreview";
import { Separator } from "@/components/ui/separator";
import { format, isToday } from "date-fns";

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
  const [scores, setScores] = useState([{ team1: "", team2: "" }]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [mmrData, setMmrData] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = useUserProfile();

  const { data: friends = [], isLoading: isLoadingFriends } = useQuery({
    queryKey: ['friends', userId],
    queryFn: async () => {
      if (!userId) return [];
      try {
        const { data, error } = await supabase.rpc('view_my_friends', {
          i_user_id: userId
        });
        if (error) throw error;
        return data as Friend[];
      } catch (error) {
        console.error('Error fetching friends:', error);
        throw error;
      }
    },
    enabled: !!userId,
  });

  const playerOptions = [
    { id: userId || "current-user", name: "Me" },
    ...friends.map(friend => ({ id: friend.friend_id, name: friend.display_name }))
  ];

  const getPlayerName = (playerId: string) => {
    if (playerId === userId) return "Me";
    const friend = friends.find(f => f.friend_id === playerId);
    return friend ? friend.display_name : "Unknown";
  };

  const handleNext = async () => {
    if (!player1 || !player2 || !player3 || !player4) {
      toast.error("Please fill in all player fields");
      return;
    }

    const players = new Set([player1, player2, player3, player4]);
    if (players.size !== 4) {
      toast.error("All players must be different");
      return;
    }

    try {
      setIsCalculating(true);
      
      // Step 1: Create match
      const { data: matchData, error: matchError } = await supabase.rpc('create_match', {
        team1_player1_id: player1,
        team1_player2_id: player2,
        team2_player1_id: player3,
        team2_player2_id: player4,
        match_date: new Date(date).toISOString()
      });

      if (matchError) {
        console.error('Match creation error:', matchError);
        throw matchError;
      }

      if (!matchData) {
        throw new Error('No match ID returned from create_match');
      }

      setMatchId(matchData);

      // Step 2: Calculate MMR change
      const { data: mmrCalcData, error: mmrError } = await supabase.rpc('calculate_mmr_change', {
        match_id: matchData
      });

      if (mmrError) {
        console.error('MMR calculation error:', mmrError);
        throw mmrError;
      }

      if (!mmrCalcData || mmrCalcData.length === 0) {
        throw new Error('No MMR data returned from calculate_mmr_change');
      }

      setMmrData(mmrCalcData[0]);
      setPage(2);
    } catch (error) {
      console.error('Error preparing match:', error);
      toast.error("Failed to prepare match. Please try again.");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!matchId || !mmrData) {
      toast.error("Match data not ready. Please try again.");
      return;
    }

    const hasEmptyScores = scores.some(score => !score.team1 || !score.team2);
    if (hasEmptyScores) {
      toast.error("Please fill in all score fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const { error: completeError } = await supabase.rpc('complete_match', {
        match_id: matchId,
        new_team1_score: parseInt(scores[0].team1),
        new_team2_score: parseInt(scores[0].team2),
        team1_win_mmr_change_amount: mmrData.team1_win_mmr_change_amount,
        team2_win_mmr_change_amount: mmrData.team2_win_mmr_change_amount
      });

      if (completeError) throw completeError;

      toast.success("Match registered successfully!");
      
      // Reset form
      setPage(1);
      setPlayer1("");
      setPlayer2("");
      setPlayer3("");
      setPlayer4("");
      setScores([{ team1: "", team2: "" }]);
      setDate(new Date().toISOString().split("T")[0]);
      setMatchId(null);
      setMmrData(null);
    } catch (error) {
      console.error('Error completing match:', error);
      toast.error("Failed to register match. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isToday(date) ? "Today" : format(date, "PPP");
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
        <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {formatDate(date)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <TeamSelect
                teamNumber={1}
                player1Value={player1}
                player2Value={player2}
                onPlayer1Change={setPlayer1}
                onPlayer2Change={setPlayer2}
                players={playerOptions}
              />
            </div>
            
            <div className="relative">
              <Separator orientation="vertical" className="absolute left-[-1rem] h-full" />
              <TeamSelect
                teamNumber={2}
                player1Value={player3}
                player2Value={player4}
                onPlayer1Change={setPlayer3}
                onPlayer2Change={setPlayer4}
                players={playerOptions}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isCalculating}>
            {isCalculating ? "Calculating..." : "Next"}
          </Button>
        </form>
      ) : (
        <>
          <TeamPreview
            team1Player1Name={getPlayerName(player1)}
            team1Player2Name={getPlayerName(player2)}
            team2Player1Name={getPlayerName(player3)}
            team2Player2Name={getPlayerName(player4)}
            mmrData={mmrData}
          />
          <ScoreForm
            onBack={() => setPage(1)}
            scores={scores}
            setScores={setScores}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </>
      )}
    </Card>
  );
};
