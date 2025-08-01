
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { usePlayerSelection } from "@/hooks/match/use-player-selection";
import { useUserProfile } from "@/hooks/use-user-profile";
import { toast } from "sonner";

interface PlayersStepProps {
  selectedPlayers: string[];
  onPlayersChange: (players: string[]) => void;
}

export const PlayersStep = ({ selectedPlayers, onPlayersChange }: PlayersStepProps) => {
  const { playerOptions } = usePlayerSelection();
  const { profile } = useUserProfile();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (profile?.id && !selectedPlayers.includes(profile.id)) {
      onPlayersChange([profile.id]);
    }
  }, [profile?.id]);

  const getPlayerName = (playerId: string) => {
    if (playerId === profile?.id) return "Me";
    const player = playerOptions.find((p) => p.id === playerId);
    return player?.name || "Unknown";
  };

  const getPlayerPhoto = (playerId: string) => {
    if (playerId === profile?.id) {
      return profile.profile_photo || "";
    }
    const player = playerOptions.find((p) => p.id === playerId);
    return player?.profile_photo || "";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handlePlayerToggle = (playerId: string) => {
    if (playerId === profile?.id) return; // Can't remove current user
    
    if (selectedPlayers.includes(playerId)) {
      onPlayersChange(selectedPlayers.filter(p => p !== playerId));
    } else if (selectedPlayers.length < 4) {
      onPlayersChange([...selectedPlayers, playerId]);
    } else {
      toast.error("Maximum 4 players allowed");
    }
  };

  const handleRemovePlayer = (playerId: string) => {
    if (playerId === profile?.id) return; // Can't remove current user
    onPlayersChange(selectedPlayers.filter(p => p !== playerId));
  };

  // Filter out selected players from available players list
  const filteredPlayers = playerOptions.filter(player => 
    player.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    player.id !== profile?.id &&
    !selectedPlayers.includes(player.id)
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <Input
        placeholder="Search for players..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Selected Players */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {selectedPlayers.map((playerId) => (
          <div key={playerId} className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={getPlayerPhoto(playerId)} />
                <AvatarFallback className="text-sm">
                  {getInitials(getPlayerName(playerId))}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{getPlayerName(playerId)}</span>
              {playerId === profile?.id && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">You</span>
              )}
            </div>
            {playerId !== profile?.id && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemovePlayer(playerId)}
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Available Players */}
      {filteredPlayers.length > 0 && selectedPlayers.length < 4 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Available Players</div>
          <div className="grid gap-2 max-h-48 overflow-y-auto">
            {filteredPlayers.slice(0, 10).map((player) => (
              <div
                key={player.id}
                onClick={() => handlePlayerToggle(player.id)}
                className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={player.profile_photo || ""} />
                  <AvatarFallback className="text-xs">
                    {getInitials(player.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{player.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
