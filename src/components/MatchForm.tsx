import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScoreForm } from "./ScoreForm";
import { TeamSelect } from "./match/TeamSelect";
import { TeamPreview } from "./match/TeamPreview";
import { useMatchForm } from "@/hooks/use-match-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TeamDisplay } from "./match/TeamDisplay";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

export const MatchForm = () => {
  const {
    page,
    setPage,
    player1,
    setPlayer1,
    player2,
    setPlayer2,
    player3,
    setPlayer3,
    player4,
    setPlayer4,
    scores,
    setScores,
    mmrData,
    isCalculating,
    isSubmitting,
    playerOptions,
    getPlayerName,
    handleNext,
    handleSubmit,
    calculateMMR,
    searchQuery,
    setSearchQuery
  } = useMatchForm();

  const { profile } = useUserProfile();

  // Auto-select current user
  useEffect(() => {
    if (profile?.id && !player1) {
      setPlayer1(profile.id);
    }
  }, [profile?.id, player1, setPlayer1]);

  const selectedPlayers = [player1, player2, player3, player4].filter(Boolean);
  const availablePlayers = playerOptions.filter(p => p.id !== profile?.id);
  const playersLeftToSelect = 3 - (selectedPlayers.length - 1);

  const getPlayerPhoto = (playerId: string) => {
    if (playerId === profile?.id) {
      return profile.profile_photo || "";
    }
    const player = playerOptions.find((p) => p.id === playerId);
    return player?.profile_photo || "";
  };

  return (
    <Card className="w-full max-w-3xl mx-auto p-3 space-y-4 shadow-none bg-transparent md:bg-card md:shadow-sm md:p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {page === 1
              ? `Select Players (${playersLeftToSelect} left)`
              : page === 2
              ? "Select Partner"
              : "Enter match score"}
          </p>
          {page === 1 && (
            <Button
              onClick={handleNext}
              disabled={selectedPlayers.length !== 4 || isCalculating}
              size="sm"
            >
              Next
            </Button>
          )}
        </div>
      </div>

      {page === 1 ? (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm pl-8 pr-8"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-10 px-3 hover:bg-transparent"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
          </div>
          <TeamSelect
            players={searchQuery ? availablePlayers.filter(p => 
              p.name.toLowerCase().includes(searchQuery.toLowerCase())
            ) : availablePlayers}
            selectedPlayers={selectedPlayers}
            currentUserProfile={profile}
            onPlayerSelect={(playerId) => {
              if (selectedPlayers.includes(playerId)) {
                // Remove player only if it's not the current user
                if (playerId !== profile?.id) {
                  if (player1 === playerId) setPlayer1("");
                  if (player2 === playerId) setPlayer2("");
                  if (player3 === playerId) setPlayer3("");
                  if (player4 === playerId) setPlayer4("");
                }
              } else if (selectedPlayers.length < 4) {
                // Add player to first available slot
                if (!player1) setPlayer1(playerId);
                else if (!player2) setPlayer2(playerId);
                else if (!player3) setPlayer3(playerId);
                else if (!player4) setPlayer4(playerId);
              }
            }}
          />
        </div>
      ) : page === 2 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[player2, player3, player4].map((playerId) => (
              <Card
                key={playerId}
                className={`p-4 cursor-pointer transition-all ${
                  isCalculating && mmrData?.selectedPartnerId === playerId
                    ? "opacity-50 pointer-events-none ring-2 ring-primary"
                    : "hover:shadow-md"
                }`}
                onClick={() => {
                  calculateMMR(playerId);
                }}
              >
                <div className="flex flex-col items-center space-y-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={getPlayerPhoto(playerId)}
                      alt={getPlayerName(playerId)}
                    />
                    <AvatarFallback>
                      {getPlayerName(playerId).substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-center">
                    {getPlayerName(playerId)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => setPage(1)}
              size="sm"
            >
              Back
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Select your partner for this match
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-sm mx-auto">
          {mmrData && (
            <TeamPreview
              mmrData={mmrData}
            />
          )}
          <div className="flex items-center justify-between gap-2 mb-6">
            <TeamDisplay
              player1DisplayName={getPlayerName(player1)}
              player1ProfilePhoto={getPlayerPhoto(player1)}
              player2DisplayName={getPlayerName(player2)}
              player2ProfilePhoto={getPlayerPhoto(player2)}
              player1IsCompleter={false}
              player2IsCompleter={false}
            />
            <div className="flex items-center gap-2 font-semibold">
              <span>{scores[0].team1}</span>
              <span className="text-muted-foreground">-</span>
              <span>{scores[0].team2}</span>
            </div>
            <TeamDisplay
              player1DisplayName={getPlayerName(player3)}
              player1ProfilePhoto={getPlayerPhoto(player3)}
              player2DisplayName={getPlayerName(player4)}
              player2ProfilePhoto={getPlayerPhoto(player4)}
              isRightAligned
              player1IsCompleter={false}
              player2IsCompleter={false}
            />
          </div>
          <ScoreForm
            onBack={() => setPage(2)}
            scores={scores}
            setScores={setScores}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      )}
    </Card>
  );
};