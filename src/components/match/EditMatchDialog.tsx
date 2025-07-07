
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, MapPin, Users, Trash2, Globe } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePlayerSelection } from "@/hooks/match/use-player-selection";
import { toast } from "sonner";
import { PendingMatch } from "@/hooks/use-pending-matches";

interface EditMatchDialogProps {
  matchId: string;
  match: PendingMatch;
  onClose: () => void;
}

export const EditMatchDialog = ({ matchId, match, onClose }: EditMatchDialogProps) => {
  const { getPlayerName } = usePlayerSelection();
  const [matchDate, setMatchDate] = useState(match.match_date.split('T')[0]);
  const [matchTime, setMatchTime] = useState(match.match_date.split('T')[1].substring(0, 5));
  const [location, setLocation] = useState("TBD"); // Mock location
  const [players, setPlayers] = useState([
    match.team1_player1_id,
    match.team1_player2_id,
    match.team2_player1_id,
    match.team2_player2_id
  ]);

  const getPlayerPhoto = (playerId: string) => {
    // Mock profile photos for demo
    const mockPhotos: { [key: string]: string } = {
      "player2": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      "player3": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      "player4": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      "player5": "https://images.unsplash.com/photo-1494790108755-2616b612b630?w=150&h=150&fit=crop&crop=face",
      "player6": "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
      "player7": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face"
    };
    
    return mockPhotos[playerId] || "";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleRemovePlayer = (playerId: string) => {
    if (players.length <= 3) {
      toast.error("Cannot remove player - minimum 3 players required");
      return;
    }
    setPlayers(players.filter(p => p !== playerId));
    toast.success("Player removed from match");
  };

  const handleSaveChanges = () => {
    // Here you would typically call an API to update the match
    toast.success("Match details updated successfully");
    onClose();
  };

  const handleAdvertiseAsOpenGame = () => {
    // Here you would typically call an API to convert to open game
    toast.success("Match advertised as open game");
    onClose();
  };

  const formatDateTime = () => {
    const date = new Date(`${matchDate}T${matchTime}`);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Edit Match Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Date & Time */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4" />
              Date & Time
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={matchDate}
                  onChange={(e) => setMatchDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={matchTime}
                  onChange={(e) => setMatchTime(e.target.value)}
                />
              </div>
            </div>
            <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
              {formatDateTime()}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4" />
              Location
            </div>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter match location"
            />
          </div>

          {/* Players */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4" />
              Players ({players.length}/4)
            </div>
            <div className="space-y-2">
              {players.map((playerId) => (
                <div key={playerId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={getPlayerPhoto(playerId)} />
                      <AvatarFallback className="text-xs">
                        {getInitials(getPlayerName(playerId))}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{getPlayerName(playerId)}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemovePlayer(playerId)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            {players.length < 4 && (
              <div className="text-sm text-muted-foreground">
                {4 - players.length} more player{4 - players.length > 1 ? 's' : ''} needed
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4 border-t">
            <Button onClick={handleSaveChanges} className="w-full">
              Save Changes
            </Button>
            
            <Button 
              onClick={handleAdvertiseAsOpenGame}
              variant="outline" 
              className="w-full"
            >
              <Globe className="h-4 w-4 mr-2" />
              Advertise as Open Game
            </Button>
            
            <Button onClick={onClose} variant="ghost" className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
