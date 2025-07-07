
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayerSelectionStep } from "./match/PlayerSelectionStep";
import { ScoreInputStep } from "./match/ScoreInputStep";
import { PendingMatchesList } from "./match/PendingMatchesList";
import { useMatchForm } from "@/hooks/use-match-form";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useState, useEffect } from "react";

export const MatchForm = () => {
  const [selectedPendingMatchId, setSelectedPendingMatchId] = useState<string>();
  const [showCreateMatch, setShowCreateMatch] = useState(false);

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
    setSearchQuery,
    resetForm
  } = useMatchForm();

  const { profile } = useUserProfile();

  // Auto-select current user when creating new match
  useEffect(() => {
    if (profile?.id && !player1 && showCreateMatch) {
      setPlayer1(profile.id);
    }
  }, [profile?.id, player1, setPlayer1, showCreateMatch]);

  const selectedPlayers = [player1, player2, player3, player4].filter(Boolean);

  const getPlayerPhoto = (playerId: string) => {
    if (playerId === profile?.id) {
      return profile.profile_photo || "";
    }
    const player = playerOptions.find((p) => p.id === playerId);
    return player?.profile_photo || "";
  };

  const handleSelectPendingMatch = (matchId: string) => {
    setSelectedPendingMatchId(matchId);
    // Load match data and proceed to score input
    // This would need to be implemented to load the match details
    setPage(2); // Skip to score input for pending matches
  };

  const handleCreateNewMatch = () => {
    setShowCreateMatch(true);
    setSelectedPendingMatchId(undefined);
    resetForm();
  };

  const handleBackToPendingMatches = () => {
    setShowCreateMatch(false);
    setSelectedPendingMatchId(undefined);
    resetForm();
  };

  // Helper function to get the correct team players based on selected partner
  const getTeamPlayers = () => {
    if (!mmrData?.selectedPartnerId) return null;

    const team1Players = {
      player1Id: player1,
      player2Id: mmrData.selectedPartnerId
    };

    const remainingPlayers = [player2, player3, player4].filter(
      p => p !== mmrData.selectedPartnerId
    );

    const team2Players = {
      player1Id: remainingPlayers[0],
      player2Id: remainingPlayers[1]
    };

    return { team1Players, team2Players };
  };

  const teamPlayers = getTeamPlayers();

  // Show pending matches list initially
  if (!showCreateMatch && page === 1) {
    return (
      <div className="space-y-6">
        <PendingMatchesList 
          onSelectMatch={handleSelectPendingMatch}
          selectedMatchId={selectedPendingMatchId}
        />
        
        <div className="text-center">
          <Button onClick={handleCreateNewMatch}>
            Create New Match
          </Button>
        </div>

        {selectedPendingMatchId && (
          <div className="text-center">
            <Button 
              onClick={() => setPage(2)}
              variant="default"
              size="lg"
            >
              Add Scores to Selected Match
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto p-3 space-y-4 shadow-none bg-transparent md:bg-card md:shadow-sm md:p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {page === 1
              ? `Select Players (${3 - (selectedPlayers.length - 1)} left)`
              : page === 2 && !selectedPendingMatchId
              ? "Select Partner"
              : "Enter match score"}
          </p>
          {page === 1 && showCreateMatch && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleBackToPendingMatches}
                size="sm"
              >
                Back to Matches
              </Button>
              <Button
                onClick={handleNext}
                disabled={selectedPlayers.length !== 4 || isCalculating}
                size="sm"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>

      {page === 1 && showCreateMatch ? (
        <PlayerSelectionStep
          selectedPlayers={selectedPlayers}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          playerOptions={playerOptions}
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
          onNext={handleNext}
          isCalculating={isCalculating}
        />
      ) : page === 2 && !selectedPendingMatchId ? (
        // Team formation step for new matches
        <div>Team formation step would go here</div>
      ) : (
        <ScoreInputStep
          teamPlayers={teamPlayers}
          getPlayerName={getPlayerName}
          getPlayerPhoto={getPlayerPhoto}
          scores={scores}
          setScores={setScores}
          mmrData={mmrData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onBack={handleBackToPendingMatches}
        />
      )}
    </Card>
  );
};
