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
    mmrData,
    isCalculating,
    isSubmitting,
    playerOptions,
    getPlayerName,
    handleNext,
    handleSubmit,
  } = useMatchForm();

  const selectedPlayers = [player1, player2, player3, player4].filter(Boolean);
  const availablePlayers = playerOptions.filter(
    (p) => !selectedPlayers.includes(p.id)
  );

  return (
    <Card className="w-full max-w-3xl mx-auto p-3 space-y-4 shadow-none bg-transparent md:bg-card md:shadow-sm md:p-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {page === 1
            ? "Select Players (4)"
            : "Enter match score"}
        </p>
        {page === 1 && (
          <Button
            onClick={handleNext}
            disabled={selectedPlayers.length !== 4 || isCalculating}
            size="sm"
          >
            {isCalculating ? "Calculating..." : "Next"}
          </Button>
        )}
      </div>

      {page === 1 ? (
        <div className="space-y-4">
          <TeamSelect
            players={playerOptions}
            selectedPlayers={selectedPlayers}
            onPlayerSelect={(playerId) => {
              if (selectedPlayers.includes(playerId)) {
                // Remove player
                if (player1 === playerId) setPlayer1("");
                if (player2 === playerId) setPlayer2("");
                if (player3 === playerId) setPlayer3("");
                if (player4 === playerId) setPlayer4("");
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
            onBack={() => setPage(1)}
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