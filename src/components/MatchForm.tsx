
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
import { useNavigate } from "react-router-dom";

export const MatchForm = () => {
  const navigate = useNavigate();
  const [selectedPendingMatchId, setSelectedPendingMatchId] = useState<string>();

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
    handleSubmit,
    calculateMMR,
    resetForm
  } = useMatchForm();

  const { profile } = useUserProfile();

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
    navigate("/create-booking");
  };

  const handleBackToPendingMatches = () => {
    setSelectedPendingMatchId(undefined);
    resetForm();
  };

  const handlePartnerSelect = async (partnerId: string) => {
    // calculateMMR handles the page navigation internally, so we don't need to check its return value
    await calculateMMR(partnerId);
  };

  // Helper function to get the correct team players based on selected partner
  const getTeamPlayers = () => {
    if (!mmrData) return null;
    
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

  // Get potential partners (excluding current user)
  const getPotentialPartners = () => {
    return [player2, player3, player4].filter(p => p !== player1);
  };

  // Find selected partner from MMR data
  const selectedPartner = mmrData?.selectedPartnerId;
  const teamPlayers = selectedPartner ? getTeamPlayers() : null;

  // Show pending matches list initially
  if (!selectedPendingMatchId && page === 1) {
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

  // Handle pending match flow
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
            {page === 2 && selectedPendingMatchId
              ? "Choose Your Partner"
              : "Enter Match Score"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {page === 2 
              ? "Select who you want to partner with for this match"
              : "Complete your match setup"}
          </p>
        </div>
      </div>

      {/* Main Content Card */}
      <Card>
        <div className="p-6">
          {page === 2 && selectedPendingMatchId ? (
            <div className="space-y-6">
              <TeamFormationStep
                players={getPotentialPartners()}
                getPlayerName={getPlayerName}
                getPlayerPhoto={getPlayerPhoto}
                onPlayerSelect={handlePartnerSelect}
                selectedPartnerId={selectedPartner}
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
