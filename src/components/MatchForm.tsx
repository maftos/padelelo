import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScoreForm } from "./ScoreForm";
import { TeamSelect } from "./match/TeamSelect";
import { TeamPreview } from "./match/TeamPreview";
import { Separator } from "@/components/ui/separator";
import { DateSelector } from "./match/DateSelector";
import { useMatchForm } from "@/hooks/use-match-form";

export const MatchForm = () => {
  const {
    page,
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
  } = useMatchForm();

  return (
    <Card className="w-full max-w-md p-6 space-y-6 animate-fade-in">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Register Match</h2>
        <p className="text-sm text-muted-foreground">
          {page === 1 ? "Select players" : "Enter match score"}
        </p>
      </div>

      {page === 1 ? (
        <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
          <DateSelector value={date} onChange={setDate} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <TeamSelect
                teamNumber={1}
                player1Value={player1}
                player2Value={player2}
                onPlayer1Change={setPlayer1}
                onPlayer2Change={setPlayer2}
                players={playerOptions}
              />
            </div>
            
            <div className="relative">
              <Separator orientation="vertical" className="absolute left-0 h-full hidden md:block" />
              <TeamSelect
                teamNumber={2}
                player1Value={player3}
                player2Value={player4}
                onPlayer1Change={setPlayer3}
                onPlayer2Change={setPlayer4}
                players={playerOptions}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isCalculating}>
            {isCalculating ? "Calculating..." : "Next"}
          </Button>
        </form>
      ) : (
        <>
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
        </>
      )}
    </Card>
  );
};