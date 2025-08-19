
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X, Users } from "lucide-react";
import { usePlayerSelection } from "@/hooks/match/use-player-selection";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useIsMobile } from "@/hooks/use-mobile";
import { PlayerSelectionBottomDrawer } from "./PlayerSelectionBottomDrawer";
import { toast } from "sonner";

interface PlayersStepProps {
  selectedPlayers: string[];
  onPlayersChange: (players: string[]) => void;
  knownPlayers?: { id: string; name: string; profile_photo?: string }[];
}

export const PlayersStep = ({ selectedPlayers, onPlayersChange, knownPlayers = [] }: PlayersStepProps) => {
  const { playerOptions } = usePlayerSelection();
  const { profile } = useUserProfile();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // In edit booking mode, always ensure current user is included and can't be removed
    if (profile?.id && !selectedPlayers.includes(profile.id)) {
      onPlayersChange([profile.id, ...selectedPlayers]);
    }
  }, [profile?.id, selectedPlayers.length]);

  const getPlayerName = (playerId: string) => {
    if (playerId === profile?.id) return "Me";
    const player = playerOptions.find((p) => p.id === playerId) || knownPlayers.find((p) => p.id === playerId);
    return player?.name || "Unknown";
  };

  const getPlayerPhoto = (playerId: string) => {
    if (playerId === profile?.id) {
      return profile.profile_photo || "";
    }
    const player = playerOptions.find((p) => p.id === playerId) || knownPlayers.find((p) => p.id === playerId);
    return player?.profile_photo || "";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handlePlayerToggle = (playerId: string) => {
    // Prevent removing current user in edit booking mode
    if (playerId === profile?.id) {
      toast.error("You cannot remove yourself from the booking");
      return;
    }
    
    if (selectedPlayers.includes(playerId)) {
      onPlayersChange(selectedPlayers.filter(p => p !== playerId));
    } else if (selectedPlayers.length < 4) {
      onPlayersChange([...selectedPlayers, playerId]);
    } else {
      toast.error("Maximum 4 players allowed");
    }
  };

  const handleRemovePlayer = (playerId: string) => {
    // Prevent removing current user in edit booking mode  
    if (playerId === profile?.id) {
      toast.error("You cannot remove yourself from the booking");
      return;
    }
    onPlayersChange(selectedPlayers.filter(p => p !== playerId));
  };

  // Filter out selected players from available players list
  const filteredPlayers = playerOptions.filter(player => 
    player.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    player.id !== profile?.id &&
    !selectedPlayers.includes(player.id)
  );

  // Mobile: Show trigger button and drawer
  if (isMobile) {
    return (
      <div className="space-y-6">
        {/* Player Selection Trigger */}
        <Button
          variant="outline"
          className="w-full h-14 justify-start text-left border-2 border-dashed"
          onClick={() => setIsDrawerOpen(true)}
        >
          <Users className="h-5 w-5 mr-3" />
          <div className="flex-1">
            <span className="font-medium">
              {selectedPlayers.length} player{selectedPlayers.length === 1 ? '' : 's'} selected
            </span>
            <div className="text-sm text-muted-foreground">
              Tap to change player selection
            </div>
          </div>
        </Button>

        {/* Selected Players Display - Grid Layout */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {[0, 1, 2, 3].map((index) => {
            const playerId = selectedPlayers[index];
            
            if (!playerId) {
              return (
                <div 
                  key={index} 
                  className="flex items-center gap-2 sm:gap-3 bg-muted/30 rounded-lg p-2 sm:p-3 border-2 border-border min-h-[50px] sm:min-h-[60px]"
                >
                  <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                    <AvatarFallback className="text-xs bg-muted text-muted-foreground"></AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-muted-foreground text-xs sm:text-sm">Empty Slot</div>
                    <div className="text-xs text-muted-foreground hidden sm:block">Available</div>
                  </div>
                </div>
              );
            }
            
            return (
              <div 
                key={playerId} 
                className="flex items-center gap-2 sm:gap-3 bg-muted/50 rounded-lg p-2 sm:p-3 min-h-[50px] sm:min-h-[60px]"
              >
                <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                  <AvatarImage src={getPlayerPhoto(playerId)} />
                  <AvatarFallback className="text-xs">
                    {getInitials(getPlayerName(playerId))}
                  </AvatarFallback>
                </Avatar>
                <div className="text-xs sm:text-sm flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {getPlayerName(playerId)}
                    {playerId === profile?.id && (
                      <span className="text-primary ml-1">(You)</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Player Selection Drawer */}
        <PlayerSelectionBottomDrawer
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          selectedPlayers={selectedPlayers}
          onPlayersChange={onPlayersChange}
          playerOptions={[...playerOptions, ...knownPlayers]}
          currentUserId={profile?.id}
          maxPlayers={4}
        />
      </div>
    );
  }

  // Desktop: Show inline selection
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
