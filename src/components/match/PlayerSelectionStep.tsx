
import { Search, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TeamSelect } from "./TeamSelect";
import { Link } from "react-router-dom";
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

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
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
      <div className="pt-6 border-t">
        <Button 
          variant="secondary"
          size="sm"
          asChild
          className="flex items-center gap-2"
        >
          <Link to="/how-it-works">
            <Info className="h-4 w-4" />
            How does this work?
          </Link>
        </Button>
      </div>
    </div>
  );
};
