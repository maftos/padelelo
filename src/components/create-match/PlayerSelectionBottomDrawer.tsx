import { useState, useMemo } from "react";
import { Search, X, Users } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface PlayerOption {
  id: string;
  name: string;
  profile_photo?: string;
}

interface PlayerSelectionBottomDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedPlayers: string[];
  onPlayersChange: (players: string[]) => void;
  playerOptions: PlayerOption[];
  currentUserId?: string;
  maxPlayers?: number;
}

export const PlayerSelectionBottomDrawer = ({
  open,
  onClose,
  selectedPlayers,
  onPlayersChange,
  playerOptions,
  currentUserId,
  maxPlayers = 4,
}: PlayerSelectionBottomDrawerProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Remove duplicates by ID and filter players based on search term, exclude current user and already selected players
  const filteredPlayers = useMemo(() => {
    // First, deduplicate players by ID to prevent duplicate entries
    const uniquePlayers = playerOptions.reduce((acc, player) => {
      const existing = acc.find(p => p.id === player.id);
      if (!existing) {
        acc.push(player);
      } else if (player.name.length > existing.name.length) {
        // If we find a duplicate, keep the one with the longer (more complete) name
        const index = acc.findIndex(p => p.id === player.id);
        acc[index] = player;
      }
      return acc;
    }, [] as PlayerOption[]);

    const availablePlayers = uniquePlayers.filter(player => 
      player.id !== currentUserId && !selectedPlayers.includes(player.id)
    );
    
    if (!searchTerm) {
      return availablePlayers;
    }
    return availablePlayers.filter(player =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [playerOptions, searchTerm, currentUserId, selectedPlayers]);

  const handlePlayerToggle = (playerId: string) => {
    // Prevent removing current user in edit booking mode
    if (playerId === currentUserId) {
      return; // Do nothing - current user should always be selected
    }
    
    if (selectedPlayers.includes(playerId)) {
      onPlayersChange(selectedPlayers.filter(p => p !== playerId));
    } else if (selectedPlayers.length < maxPlayers) {
      onPlayersChange([...selectedPlayers, playerId]);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const selectedPlayersData = selectedPlayers
    .map(id => {
      // Find the player with the complete name (longest name for that ID)
      const matchingPlayers = playerOptions.filter(p => p.id === id);
      if (matchingPlayers.length === 0) return null;
      if (matchingPlayers.length === 1) return matchingPlayers[0];
      // Return the player with the longest (most complete) name
      return matchingPlayers.reduce((longest, current) => 
        current.name.length > longest.name.length ? current : longest
      );
    })
    .filter(Boolean) as PlayerOption[];

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="h-[85vh] flex flex-col">
        <DrawerHeader className="border-b border-border pb-4">
          <DrawerTitle className="text-center">
            Select Players
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 flex flex-col min-h-0">
          {/* Selected Players Section */}
          {selectedPlayersData.length > 0 && (
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium">Selected Players</span>
                <Badge variant="secondary">{selectedPlayersData.length}/{maxPlayers}</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedPlayersData.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-2 rounded-full text-sm"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={player.profile_photo || ""} />
                      <AvatarFallback className="text-xs">
                        {getInitials(player.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{player.name}</span>
                    {player.id !== currentUserId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-destructive/20"
                        onClick={() => handlePlayerToggle(player.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Input */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 h-12"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Players List */}
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              <div className="p-2">
                {filteredPlayers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "No players found" : "No players available"}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredPlayers.map((player) => {
                      const isDisabled = selectedPlayers.length >= maxPlayers;

                      return (
                        <Button
                          key={player.id}
                          variant="ghost"
                          className="w-full h-14 justify-start p-4 text-left"
                          onClick={() => handlePlayerToggle(player.id)}
                          disabled={isDisabled}
                        >
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={player.profile_photo || ""} alt={player.name} />
                            <AvatarFallback>
                              {getInitials(player.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-base flex-1">{player.name}</span>
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};