
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayerSelectionStep } from "./match/PlayerSelectionStep";
import { LocationSelectionStep } from "./match/LocationSelectionStep";
import { TeamFormationStep } from "./match/TeamFormationStep";
import { ScoreInputStep } from "./match/ScoreInputStep";
import { PendingMatchesList } from "./match/PendingMatchesList";
import { useMatchForm } from "@/hooks/use-match-form";
import { useUserProfile } from "@/hooks/use-user-profile";
import { usePendingMatches } from "@/hooks/use-pending-matches";
import { useState, useEffect } from "react";
import { Plus, ArrowLeft } from "lucide-react";

export const MatchForm = () => {
  const [selectedPendingMatchId, setSelectedPendingMatchId] = useState<string>();
  const [showCreateMatch, setShowCreateMatch] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState("");
  const [feePerPlayer, setFeePerPlayer] = useState("");
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>();

  const { pendingMatches } = usePendingMatches();

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

  useEffect(() => {
    if (profile?.id && !player1 && showCreateMatch) {
      setPlayer1(profile.id);
    }
  }, [profile?.id, player1, setPlayer1, showCreateMatch]);

  const selectedPlayers = [player1, player2, player3, player4].filter(Boolean);
  const hasAllPlayers = selectedPlayers.length === 4;

  const getPlayerPhoto = (playerId: string) => {
    if (playerId === profile?.id) {
      return profile.profile_photo || "";
    }
    const player = playerOptions.find((p) => p.id === playerId);
    return player?.profile_photo || "";
  };

  const handleSelectPendingMatch = (matchId: string) => {
    setSelectedPendingMatchId(matchId);
    
    // Load match data from the selected pending match
    const selectedMatch = pendingMatches.find(match => match.match_id === matchId);
    if (selectedMatch) {
      setPlayer1(selectedMatch.team1_player1_id);
      setPlayer2(selectedMatch.team1_player2_id);
      setPlayer3(selectedMatch.team2_player1_id);
      setPlayer4(selectedMatch.team2_player2_id);
      
      // Go to team formation step
      setPage(2);
    }
  };

  const handleCreateNewMatch = () => {
    setShowCreateMatch(true);
    setSelectedPendingMatchId(undefined);
    resetForm();
  };

  const handleBackToPendingMatches = () => {
    setShowCreateMatch(false);
    setSelectedPendingMatchId(undefined);
    setSelectedLocation("");
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setSelectedTime("");
    setFeePerPlayer("");
    setSelectedPartnerId(undefined);
    resetForm();
  };

  const handleLocationNext = async () => {
    // Here you would typically create the match in the database
    // For now, we'll just show a success message and reset
    console.log("Creating match with:", {
      players: selectedPlayers,
      location: selectedLocation,
      date: selectedDate,
      time: selectedTime,
      fee: feePerPlayer
    });
    // You can add actual match creation logic here
    handleBackToPendingMatches();
  };

  const handlePartnerSelect = async (partnerId: string) => {
    setSelectedPartnerId(partnerId);
    // calculateMMR handles the page navigation internally, so we don't need to check its return value
    await calculateMMR(partnerId);
  };

  // Helper function to get the correct team players based on selected partner
  const getTeamPlayers = () => {
    if (!selectedPartnerId) return null;

    const team1Players = {
      player1Id: player1,
      player2Id: selectedPartnerId
    };

    const remainingPlayers = [player2, player3, player4].filter(
      p => p !== selectedPartnerId
    );

    const team2Players = {
      player1Id: remainingPlayers[0],
      player2Id: remainingPlayers[1]
    };

    return { team1Players, team2Players };
  };

  const teamPlayers = getTeamPlayers();

  // Get potential partners (excluding current user)
  const getPotentialPartners = () => {
    return [player2, player3, player4].filter(p => p !== player1);
  };

  // Dynamic button text based on selected players (excluding current user)
  const selectedPlayersCount = selectedPlayers.length - 1; // Subtract 1 for current user
  const getButtonText = () => {
    if (selectedPlayersCount <= 2) {
      return "Next (Open Match)";
    }
    return "Next";
  };

  // Show pending matches list initially
  if (!showCreateMatch && page === 1) {
    return (
      <div className="space-y-6">
        <PendingMatchesList 
          onSelectMatch={handleSelectPendingMatch}
          selectedMatchId={selectedPendingMatchId}
        />
        
        <Card 
          className="cursor-pointer transition-all hover:shadow-md border-dashed border-2"
          onClick={handleCreateNewMatch}
        >
          <div className="p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Register New Match</h3>
            <p className="text-muted-foreground">Create a new match with 4 players</p>
          </div>
        </Card>
      </div>
    );
  }

  // Create match flow with similar layout to EditMatch
  return (
    <div className="space-y-6">
      {/* Header with back button and title */}
      <div className="flex items-center gap-4">
        <Button 
          onClick={handleBackToPendingMatches} 
          variant="ghost" 
          size="sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-xl font-semibold">
            {page === 1
              ? "Select Players"
              : page === 2 && showCreateMatch
              ? "Match Details"
              : page === 2 && selectedPendingMatchId
              ? "Choose Your Partner"
              : "Enter Match Score"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {page === 1 
              ? "Add up to 3 players to your match"
              : page === 2 && showCreateMatch
              ? "Set the match location, date, and time"
              : "Complete your match setup"}
          </p>
        </div>
      </div>

      {/* Main Content Card */}
      <Card>
        <div className="p-6">
          {page === 1 && showCreateMatch ? (
            <div className="space-y-6">
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
              <div className="flex justify-end">
                <Button
                  onClick={handleNext}
                  disabled={isCalculating}
                  size="lg"
                >
                  {getButtonText()}
                </Button>
              </div>
            </div>
          ) : page === 2 && showCreateMatch ? (
            <LocationSelectionStep
              selectedLocation={selectedLocation}
              onLocationChange={setSelectedLocation}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              selectedTime={selectedTime}
              onTimeChange={setSelectedTime}
              feePerPlayer={feePerPlayer}
              onFeeChange={setFeePerPlayer}
              onBack={() => setPage(1)}
              onNext={handleLocationNext}
              isSubmitting={isSubmitting}
              hasAllPlayers={hasAllPlayers}
            />
          ) : page === 2 && selectedPendingMatchId ? (
            <div className="space-y-6">
              <TeamFormationStep
                players={getPotentialPartners()}
                getPlayerName={getPlayerName}
                getPlayerPhoto={getPlayerPhoto}
                onPlayerSelect={handlePartnerSelect}
                selectedPartnerId={selectedPartnerId}
                onBack={handleBackToPendingMatches}
                isCalculating={isCalculating}
              />
            </div>
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
        </div>
      </Card>
    </div>
  );
};
