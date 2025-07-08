import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Player {
  id: string;
  name: string;
  photo?: string;
}

interface ScoreEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (team1Score: number, team2Score: number) => void;
  team1: [string, string];
  team2: [string, string];
  players: Player[];
}

export const ScoreEntryModal = ({
  isOpen,
  onClose,
  onConfirm,
  team1,
  team2,
  players
}: ScoreEntryModalProps) => {
  const [team1Score, setTeam1Score] = useState("");
  const [team2Score, setTeam2Score] = useState("");

  const getPlayerName = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    return player?.name === "Me" ? "You" : player?.name || "Unknown";
  };

  const getPlayerPhoto = (playerId: string) => {
    return players.find(p => p.id === playerId)?.photo || "";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleConfirm = () => {
    if (team1Score && team2Score) {
      onConfirm(parseInt(team1Score), parseInt(team2Score));
      setTeam1Score("");
      setTeam2Score("");
      onClose();
    }
  };

  const handleBack = () => {
    setTeam1Score("");
    setTeam2Score("");
    onClose();
  };

  const TeamDisplay = ({ team, label }: { team: [string, string]; label: string }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-muted-foreground">{label}</Label>
      <div className="flex items-center justify-center gap-2">
        {team.map((playerId, index) => (
          <div key={playerId} className="flex items-center gap-1">
            <Avatar className="h-6 w-6">
              <AvatarImage src={getPlayerPhoto(playerId)} />
              <AvatarFallback className="text-xs">
                {getInitials(getPlayerName(playerId))}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{getPlayerName(playerId)}</span>
            {index === 0 && <span className="text-muted-foreground">&</span>}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter Match Scores</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <TeamDisplay team={team1} label="Team 1" />
            <div className="space-y-2">
              <Label htmlFor="team1-score">Team 1 Score</Label>
              <Input
                id="team1-score"
                type="number"
                min="0"
                value={team1Score}
                onChange={(e) => setTeam1Score(e.target.value)}
                placeholder="Enter score"
              />
            </div>
          </div>

          <div className="space-y-4">
            <TeamDisplay team={team2} label="Team 2" />
            <div className="space-y-2">
              <Label htmlFor="team2-score">Team 2 Score</Label>
              <Input
                id="team2-score"
                type="number"
                min="0"
                value={team2Score}
                onChange={(e) => setTeam2Score(e.target.value)}
                placeholder="Enter score"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!team1Score || !team2Score}
            >
              Confirm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};