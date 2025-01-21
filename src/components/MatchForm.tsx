import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScoreForm } from "./ScoreForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/use-user-profile";

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

  const { userId, profile } = useUserProfile();

  const { data: friends = [], isLoading: isLoadingFriends } = useQuery({
    queryKey: ['friends', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase.rpc('view_my_friends', {
        user_id: userId
      });
      if (error) throw error;
      return data as Friend[];
    },
    enabled: !!userId,
  });

  // Combine current user and friends for dropdown options
  const playerOptions = userId && profile ? [
    { id: userId, name: "Me" },
    ...friends.map(friend => ({ id: friend.friend_id, name: friend.display_name }))
  ] : [];

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
    
    // Reset form
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="player1">Team 1 - Player 1</Label>
              <Select value={player1} onValueChange={setPlayer1}>
                <SelectTrigger>
                  <SelectValue placeholder="Select player" />
                </SelectTrigger>
                <SelectContent>
                  {playerOptions.map((player) => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="player2">Team 1 - Player 2</Label>
              <Select value={player2} onValueChange={setPlayer2}>
                <SelectTrigger>
                  <SelectValue placeholder="Select player" />
                </SelectTrigger>
                <SelectContent>
                  {playerOptions.map((player) => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="player3">Team 2 - Player 1</Label>
              <Select value={player3} onValueChange={setPlayer3}>
                <SelectTrigger>
                  <SelectValue placeholder="Select player" />
                </SelectTrigger>
                <SelectContent>
                  {playerOptions.map((player) => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="player4">Team 2 - Player 2</Label>
              <Select value={player4} onValueChange={setPlayer4}>
                <SelectTrigger>
                  <SelectValue placeholder="Select player" />
                </SelectTrigger>
                <SelectContent>
                  {playerOptions.map((player) => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

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