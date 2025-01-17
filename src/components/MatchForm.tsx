import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Player {
  id: number;
  name: string;
}

export const MatchForm = () => {
  const [player1Score, setPlayer1Score] = useState("");
  const [player2Score, setPlayer2Score] = useState("");
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!player1 || !player2 || !player1Score || !player2Score) {
      toast.error("Please fill in all fields");
      return;
    }

    if (player1 === player2) {
      toast.error("Players must be different");
      return;
    }

    toast.success("Match registered successfully!");
    
    // Reset form
    setPlayer1("");
    setPlayer2("");
    setPlayer1Score("");
    setPlayer2Score("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  return (
    <Card className="w-full max-w-md p-6 space-y-6 animate-fade-in">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Register Match</h2>
        <p className="text-sm text-muted-foreground">
          Enter the match details below
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="player1">Player 1</Label>
            <Input
              id="player1"
              placeholder="Name"
              value={player1}
              onChange={(e) => setPlayer1(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="player2">Player 2</Label>
            <Input
              id="player2"
              placeholder="Name"
              value={player2}
              onChange={(e) => setPlayer2(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="score1">Score P1</Label>
            <Input
              id="score1"
              type="number"
              placeholder="0"
              value={player1Score}
              onChange={(e) => setPlayer1Score(e.target.value)}
              min="0"
              max="99"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="score2">Score P2</Label>
            <Input
              id="score2"
              type="number"
              placeholder="0"
              value={player2Score}
              onChange={(e) => setPlayer2Score(e.target.value)}
              min="0"
              max="99"
            />
          </div>
        </div>

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
          Register Match
        </Button>
      </form>
    </Card>
  );
};