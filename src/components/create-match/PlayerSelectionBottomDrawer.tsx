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

  // Filter players based on search term, exclude current user and already selected players
  const filteredPlayers = useMemo(() => {
    const availablePlayers = playerOptions.filter(player => 
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
    .map(id => playerOptions.find(p => p.id === id))
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