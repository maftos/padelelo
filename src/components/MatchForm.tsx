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

// Sample players data - in a real app, this would come from an API
const samplePlayers = [
  { id: 1, name: "John" },
  { id: 2, name: "Sarah" },
  { id: 3, name: "Mike" },
  { id: 4, name: "Emma" },
  { id: 5, name: "David" },
  { id: 6, name: "Lisa" },
];

export const MatchForm = () => {
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [player3, setPlayer3] = useState("");
  const [player4, setPlayer4] = useState("");
  const [player1Score, setPlayer1Score] = useState("");
  const [player2Score, setPlayer2Score] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!player1 || !player2 || !player3 || !player4 || !player1Score || !player2Score) {
      toast.error("Please fill in all fields");
      return;
    }

    const players = new Set([player1, player2, player3, player4]);
    if (players.size !== 4) {
      toast.error("All players must be different");
      return;
    }

    toast.success("Match registered successfully!");
    
    // Reset form
    setPlayer1("");
    setPlayer2("");
    setPlayer3("");
    setPlayer4("");
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
            <Label htmlFor="player1">Team 1 - Player 1</Label>
            <Select value={player1} onValueChange={setPlayer1}>
              <SelectTrigger>
                <SelectValue placeholder="Select player" />
              </SelectTrigger>
              <SelectContent>
                {samplePlayers.map((player) => (
                  <SelectItem key={player.id} value={player.name}>
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
                {samplePlayers.map((player) => (
                  <SelectItem key={player.id} value={player.name}>
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
                {samplePlayers.map((player) => (
                  <SelectItem key={player.id} value={player.name}>
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
                {samplePlayers.map((player) => (
                  <SelectItem key={player.id} value={player.name}>
                    {player.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="score1">Team 1 Score</Label>
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
            <Label htmlFor="score2">Team 2 Score</Label>
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