
import { Search, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TeamSelect } from "./TeamSelect";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useIsMobile } from "@/hooks/use-mobile";
import { PlayerSelectionBottomDrawer } from "../create-match/PlayerSelectionBottomDrawer";
import { useState } from "react";

interface PlayerSelectionStepProps {
  selectedPlayers: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  playerOptions: any[];
  onPlayerSelect: (playerId: string) => void;
  onNext: () => void;
  isCalculating: boolean;
}

export const PlayerSelectionStep = ({
  selectedPlayers,
  searchQuery,
  setSearchQuery,
  playerOptions,
  onPlayerSelect,
  onNext,
  isCalculating
}: PlayerSelectionStepProps) => {
  const { profile } = useUserProfile();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = useIsMobile();
  const availablePlayers = playerOptions.filter(p => p.id !== profile?.id);

  const getPlayerName = (playerId: string) => {
    if (playerId === profile?.id) return "Me";
    const player = playerOptions.find(p => p.id === playerId);
    return player?.name || "Unknown";
  };

  const handlePlayersChange = (players: string[]) => {
    // Handle the difference between current selection and new selection
    const newPlayers = players.filter(p => !selectedPlayers.includes(p));
    const removedPlayers = selectedPlayers.filter(p => !players.includes(p));
    
    // Add new players
    newPlayers.forEach(playerId => onPlayerSelect(playerId));
    // Remove players
    removedPlayers.forEach(playerId => onPlayerSelect(playerId));
  };

  // Mobile: Show trigger button and drawer
  if (isMobile) {
    return (
      <div>
        {/* Player Selection Trigger */}
        <Button
          variant="outline"
          className="w-full h-14 justify-start text-left mb-4"
          onClick={() => setIsDrawerOpen(true)}
        >
          <Users className="h-5 w-5 mr-3" />
          <div className="flex-1">
            {selectedPlayers.length === 0 ? (
              <span className="text-muted-foreground">Select players for your match</span>
            ) : (
              <div>
                <span className="font-medium">
                  {selectedPlayers.length} player{selectedPlayers.length === 1 ? '' : 's'} selected
                </span>
                <div className="text-sm text-muted-foreground">
                  {selectedPlayers.slice(0, 2).map(id => getPlayerName(id)).join(', ')}
                  {selectedPlayers.length > 2 && ` +${selectedPlayers.length - 2} more`}
                </div>
              </div>
            )}
          </div>
        </Button>

        {/* Player Selection Drawer */}
        <PlayerSelectionBottomDrawer
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          selectedPlayers={selectedPlayers}
          onPlayersChange={handlePlayersChange}
          playerOptions={playerOptions}
          currentUserId={profile?.id}
          maxPlayers={4}
        />
      </div>
    );
  }

  // Desktop: Show inline selection with search
  return (
    <div>
      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1 h-8 px-2 hover:bg-transparent"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}
      </div>
      
      <TeamSelect
        players={availablePlayers}
        selectedPlayers={selectedPlayers}
        currentUserProfile={profile}
        onPlayerSelect={onPlayerSelect}
      />
    </div>
  );
};
