
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TeamSelect } from "./TeamSelect";
import { useUserProfile } from "@/hooks/use-user-profile";

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
  const playersLeftToSelect = 3 - (selectedPlayers.length - 1);
  const availablePlayers = playerOptions.filter(p => p.id !== profile?.id);
  
  // Dynamic button text based on selected players (excluding current user)
  const selectedPlayersCount = selectedPlayers.length - 1; // Subtract 1 for current user
  const getButtonText = () => {
    if (selectedPlayersCount <= 2) {
      return "Next (Open Match)";
    }
    return "Next";
  };

  return (
    <>
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
      
      <div className="pt-4 mt-4">
        <Button 
          onClick={onNext}
          disabled={selectedPlayers.length < 1 || isCalculating}
          className="w-full"
        >
          {getButtonText()}
        </Button>
      </div>
    </>
  );
};
