import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScoreForm } from "./ScoreForm";
import { TeamSelect } from "./match/TeamSelect";
import { PartnerSelect } from "./match/PartnerSelect";
import { TeamPreview } from "./match/TeamPreview";
import { Separator } from "@/components/ui/separator";
import { useMatchForm } from "@/hooks/use-match-form";

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
    date,
    setDate,
    mmrData,
    isCalculating,
    isSubmitting,
    playerOptions,
    getPlayerName,
    handleNext,
    handleSubmit,
    userId
  } = useMatchForm();

  // Ensure current user is always in player1 slot
  if (!player1 && userId) {
    setPlayer1(userId);
  }

  // Filter selected players, excluding current user since they're handled separately
  const selectedPlayers = [player2, player3].filter(Boolean);
  const availablePlayers = playerOptions.filter(
    (p) => !selectedPlayers.includes(p.id) && p.id !== userId
  );

  return (
    <Card className="w-full max-w-3xl mx-auto p-3 space-y-4 shadow-none bg-transparent md:bg-card md:shadow-sm md:p-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {page === 1
            ? "Select Players (3)"
            : page === 2
            ? "Select Partner"
            : "Enter match score"}
        </p>
        {page === 1 && (
          <Button
            onClick={handleNext}
            disabled={selectedPlayers.length < 2 || isCalculating}
            size="sm"
          >
            {isCalculating ? "Calculating..." : "Next"}
          </Button>
        )}
      </div>

      {page === 1 ? (
        <div className="space-y-4">
          <TeamSelect
            players={availablePlayers}
            selectedPlayers={selectedPlayers}
            onPlayerSelect={(playerId) => {
              if (selectedPlayers.includes(playerId)) {
                // Remove player
                if (player2 === playerId) setPlayer2("");
                if (player3 === playerId) setPlayer3("");
              } else if (selectedPlayers.length < 2) {
                // Add player to first available slot
                if (!player2) setPlayer2(playerId);
                else if (!player3) setPlayer3(playerId);
              }
            }}
          />
        </div>
      ) : page === 2 ? (
        <div className="space-y-4">
          <PartnerSelect
            players={[player2, player3].map((id) => ({
              id,
              name: getPlayerName(id),
            }))}
            selectedPartner={player4}
            onPartnerSelect={setPlayer4}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setPage(1)}>
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!player4 || isCalculating}
            >
              {isCalculating ? "Calculating..." : "Next"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="max-w-sm mx-auto">
          <TeamPreview
            team1Player1Name={getPlayerName(player1)}
            team1Player2Name={getPlayerName(player2)}
            team2Player1Name={getPlayerName(player3)}
            team2Player2Name={getPlayerName(player4)}
            mmrData={mmrData}
          />
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